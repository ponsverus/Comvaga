import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient } from '../_shared/supabase.ts';

const ASAAS_PROVIDER = 'asaas';

function parseExternalReference(value: unknown) {
  const text = String(value || '');
  const match = /^comvaga:([0-9a-f-]{36}):([a-z0-9_-]+)$/i.exec(text);
  if (!match) return { negocioId: null, planCode: null };
  return { negocioId: match[1], planCode: match[2].toLowerCase() };
}

function entityFromPayload(payload: Record<string, unknown>) {
  return (payload.subscription || payload.payment || payload.checkout || {}) as Record<string, unknown>;
}

function checkoutFromPayload(payload: Record<string, unknown>) {
  return (payload.checkout || {}) as Record<string, unknown>;
}

function providerSubscriptionId(payload: Record<string, unknown>, entity: Record<string, unknown>) {
  const direct = entity.id && entity.object === 'subscription' ? entity.id : null;
  return String(direct || entity.subscription || payload.subscriptionId || '') || null;
}

function providerCustomerId(entity: Record<string, unknown>) {
  return String(entity.customer || entity.customerId || '') || null;
}

function providerStatus(entity: Record<string, unknown>) {
  return String(entity.status || entity.event || '') || null;
}

function currentPeriodEnd(entity: Record<string, unknown>) {
  const value = entity.nextDueDate || entity.dueDate || null;
  if (!value) return null;
  return String(value).slice(0, 10);
}

function mapEvent(eventType: string, entity: Record<string, unknown>) {
  const event = eventType.toUpperCase();
  const status = String(entity.status || '').toUpperCase();

  if (event === 'CHECKOUT_PAID') {
    return { status: 'active', paymentMethodStatus: 'valid' };
  }
  if (event === 'CHECKOUT_CANCELED' || event === 'CHECKOUT_EXPIRED') {
    return { status: 'payment_required', paymentMethodStatus: 'missing' };
  }
  if (event === 'SUBSCRIPTION_DELETED' || event === 'SUBSCRIPTION_INACTIVATED') {
    return { status: 'canceled', paymentMethodStatus: 'expired' };
  }
  if (event === 'SUBSCRIPTION_CREATED' || event === 'SUBSCRIPTION_UPDATED') {
    if (status === 'ACTIVE') return { status: 'active', paymentMethodStatus: 'valid' };
    if (status === 'INACTIVE' || status === 'EXPIRED') return { status: 'canceled', paymentMethodStatus: 'expired' };
    return { status: null, paymentMethodStatus: null };
  }
  if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
    return { status: 'active', paymentMethodStatus: 'valid' };
  }
  if (event === 'PAYMENT_OVERDUE') {
    return { status: 'past_due', paymentMethodStatus: 'failed' };
  }
  if (
    event === 'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED'
    || event === 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'
    || event === 'PAYMENT_REFUNDED'
    || event === 'PAYMENT_CHARGEBACK_REQUESTED'
  ) {
    return { status: 'payment_required', paymentMethodStatus: 'failed' };
  }
  if (event === 'PAYMENT_DELETED') {
    return { status: 'canceled', paymentMethodStatus: 'expired' };
  }

  return { status: null, paymentMethodStatus: null };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405);

  const expectedToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN');
  const receivedToken = req.headers.get('asaas-access-token');
  if (!expectedToken || receivedToken !== expectedToken) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const eventType = String(payload?.event || '');
    const eventId = String(payload?.id || '');
    if (!eventType || !eventId) return jsonResponse({ error: 'invalid_payload' }, 400);

    const entity = entityFromPayload(payload);
    const checkout = checkoutFromPayload(payload);
    const reference = parseExternalReference(entity.externalReference || payload.externalReference || checkout.externalReference);
    const mapped = mapEvent(eventType, entity);
    const admin = createAdminClient();

    await admin.rpc('apply_gateway_subscription_event', {
      p_provider: ASAAS_PROVIDER,
      p_event_type: eventType,
      p_payload: payload,
      p_provider_event_id: eventId,
      p_negocio_id: reference.negocioId,
      p_provider_customer_id: providerCustomerId(entity),
      p_provider_subscription_id: providerSubscriptionId(payload, entity),
      p_provider_status: providerStatus(entity),
      p_plan_code: reference.planCode,
      p_payment_method_status: mapped.paymentMethodStatus,
      p_status: mapped.status,
      p_current_period_end: currentPeriodEnd(entity),
      p_canceled_at: eventType.toUpperCase().includes('DELETED') || eventType.toUpperCase().includes('INACTIVATED')
        ? new Date().toISOString()
        : null,
    });

    return jsonResponse({ received: true });
  } catch (error) {
    console.error('asaas-webhook failed:', error);
    return jsonResponse({ error: error?.message || 'webhook_failed' }, 200);
  }
});
