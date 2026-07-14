import { getCorsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient } from '../_shared/supabase.ts';

const ASAAS_PROVIDER = 'asaas';
const DEFAULT_ASAAS_BASE_URL = 'https://api-sandbox.asaas.com/v3';

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

function waitUntil(promise: Promise<unknown>) {
  const runtime = (globalThis as { EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void } }).EdgeRuntime;
  if (runtime?.waitUntil) {
    runtime.waitUntil(promise);
    return;
  }
  promise.catch((error) => console.error('asaas background task failed:', error));
}

function parseExternalReference(value: unknown) {
  const text = String(value || '');
  const match = /^comvaga:([0-9a-f-]{36}):([a-z0-9_-]+)(?::([a-z0-9_-]+))?$/i.exec(text);
  if (!match) return { negocioId: null, planCode: null, action: null };
  return { negocioId: match[1], planCode: match[2].toLowerCase(), action: match[3]?.toLowerCase() || null };
}

function entityFromPayload(payload: Record<string, unknown>) {
  return (payload.subscription || payload.payment || payload.checkout || {}) as Record<string, unknown>;
}

function checkoutFromPayload(payload: Record<string, unknown>) {
  return (payload.checkout || {}) as Record<string, unknown>;
}

function scalarId(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value).trim();
    return text || null;
  }
  return null;
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message || fallback);
  }
  return String(error || fallback);
}

function centsToReais(cents: number) {
  return Number((Number(cents || 0) / 100).toFixed(2));
}

async function callAsaas(path: string, body: Record<string, unknown>, method = 'POST') {
  const apiKey = requiredEnv('ASAAS_API_KEY');
  const baseUrl = (Deno.env.get('ASAAS_BASE_URL') || DEFAULT_ASAAS_BASE_URL).replace(/\/+$/, '');

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      access_token: apiKey,
      accept: 'application/json',
      'content-type': 'application/json',
      'User-Agent': 'ComVaga/1.0',
    },
    body: JSON.stringify(body),
  });

  const responseText = await response.text().catch(() => '');
  let data: Record<string, unknown> = {};
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.error('Asaas subscription update error:', response.status, data || responseText);
    const asaasError = Array.isArray(data?.errors)
      ? data.errors.map((item: Record<string, unknown>) => item.description || item.message || item.code).filter(Boolean).join(' | ')
      : data?.description || data?.message || responseText || JSON.stringify(data);
    throw new Error(`asaas_subscription_update_failed (${response.status}): ${String(asaasError || '').trim() || 'empty_response'}`);
  }

  return data;
}

async function updateAsaasSubscriptionValue(subscriptionId: string, plan: Record<string, unknown>) {
  return callAsaas(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    value: centsToReais(Number(plan.price_cents || 0)),
    updatePendingPayments: false,
    externalReference: `comvaga-subscription:${plan.code}`,
    description: `Plano ${plan.name}`,
  }, 'PUT');
}

async function timingSafeTokenMatch(received: string, expected: string) {
  const encoder = new TextEncoder();
  const [receivedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(received)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const receivedBytes = new Uint8Array(receivedHash);
  const expectedBytes = new Uint8Array(expectedHash);

  let diff = 0;
  for (let i = 0; i < receivedBytes.length; i++) {
    diff |= receivedBytes[i] ^ expectedBytes[i];
  }
  return diff === 0;
}

function providerSubscriptionId(payload: Record<string, unknown>, entity: Record<string, unknown>) {
  const direct = entity.object === 'subscription' ? scalarId(entity.id) : null;
  return direct || scalarId(entity.subscription) || scalarId(payload.subscriptionId);
}

function providerCustomerId(entity: Record<string, unknown>) {
  return scalarId(entity.customer) || scalarId(entity.customerId);
}

function providerStatus(entity: Record<string, unknown>) {
  return String(entity.status || entity.event || '') || null;
}

function isPaymentEvent(eventType: string) {
  return eventType.toUpperCase().startsWith('PAYMENT_');
}

function currentPeriodEnd(eventType: string, entity: Record<string, unknown>) {
  if (!isPaymentEvent(eventType)) return null;
  const value = entity.dueDate || null;
  if (!value) return null;
  return String(value).slice(0, 10);
}

function currentPeriodStart(eventType: string, entity: Record<string, unknown>) {
  if (!isPaymentEvent(eventType)) return null;
  const value = entity.dateCreated || null;
  if (!value) return null;
  return String(value).slice(0, 10);
}

function checkoutSessionId(payload: Record<string, unknown>, entity: Record<string, unknown>, checkout: Record<string, unknown>) {
  return scalarId(entity.checkoutSession)
    || scalarId(payload.checkoutSession)
    || scalarId(checkout.id);
}

async function referenceFromCheckoutSession(
  admin: ReturnType<typeof createAdminClient>,
  checkoutSession: string | null,
) {
  if (!checkoutSession) return { negocioId: null, planCode: null, action: null, request: null };

  const { data, error } = await admin
    .from('billing_events')
    .select('negocio_id, payload')
    .eq('provider', ASAAS_PROVIDER)
    .eq('provider_event_id', `checkout:${checkoutSession}`)
    .maybeSingle();

  if (error) {
    console.error('asaas checkout reference lookup failed:', error);
    return { negocioId: null, planCode: null, action: null, request: null };
  }

  const payload = (data?.payload || {}) as Record<string, unknown>;
  const request = (payload.checkout_request || {}) as Record<string, unknown>;
  const checkout = (payload.checkout || {}) as Record<string, unknown>;
  const parsed = parseExternalReference(request.externalReference || checkout.externalReference);

  return {
    negocioId: data?.negocio_id || parsed.negocioId,
    planCode: scalarId(request.planCode)?.toLowerCase() || parsed.planCode,
    action: scalarId(request.action)?.toLowerCase() || parsed.action,
    request,
  };
}

async function markEventProcessed(
  admin: ReturnType<typeof createAdminClient>,
  eventId: string,
  values: Record<string, unknown> = {},
) {
  const { error } = await admin
    .from('billing_events')
    .update({
      ...values,
      processed_at: new Date().toISOString(),
      processing_error: null,
    })
    .eq('provider', ASAAS_PROVIDER)
    .eq('provider_event_id', eventId);

  if (error) throw error;
}

async function recordIgnoredEvent(
  admin: ReturnType<typeof createAdminClient>,
  payload: Record<string, unknown>,
  eventType: string,
  eventId: string,
  reason: string,
  entity: Record<string, unknown>,
) {
  const row = {
    provider: ASAAS_PROVIDER,
    provider_event_id: eventId,
    event_type: eventType,
    provider_customer_id: providerCustomerId(entity),
    provider_subscription_id: providerSubscriptionId(payload, entity),
    provider_status: providerStatus(entity),
    payload,
    processed_at: new Date().toISOString(),
    processing_error: reason,
  };

  const { error } = await admin
    .from('billing_events')
    .upsert(row, { onConflict: 'provider,provider_event_id' });
  if (error) console.error('asaas ignored event log failed:', error);
}

async function markEventProcessingError(
  admin: ReturnType<typeof createAdminClient>,
  eventId: string,
  error: unknown,
) {
  const message = errorMessage(error, 'webhook_processing_failed');
  const { error: updateError } = await admin
    .from('billing_events')
    .update({
      processed_at: new Date().toISOString(),
      processing_error: message,
    })
    .eq('provider', ASAAS_PROVIDER)
    .eq('provider_event_id', eventId);

  if (updateError) console.error('asaas event error mark failed:', updateError);
}

function mapEvent(eventType: string, entity: Record<string, unknown>) {
  const event = eventType.toUpperCase();
  const status = String(entity.status || '').toUpperCase();

  if (event === 'CHECKOUT_PAID') {
    return { status: null, paymentMethodStatus: null };
  }
  if (event === 'CHECKOUT_CANCELED' || event === 'CHECKOUT_EXPIRED') {
    return { status: 'payment_required', paymentMethodStatus: 'missing' };
  }
  if (event === 'SUBSCRIPTION_DELETED' || event === 'SUBSCRIPTION_INACTIVATED') {
    return { status: 'canceled', paymentMethodStatus: 'expired' };
  }
  if (event === 'SUBSCRIPTION_CREATED' || event === 'SUBSCRIPTION_UPDATED') {
    if (status === 'INACTIVE' || status === 'EXPIRED') return { status: 'canceled', paymentMethodStatus: 'expired' };
    return { status: null, paymentMethodStatus: null };
  }
  if (event === 'PAYMENT_CONFIRMED') {
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
  return { status: null, paymentMethodStatus: null };
}

async function processAsaasEvent(
  admin: ReturnType<typeof createAdminClient>,
  payload: Record<string, unknown>,
  eventType: string,
  providerEventId: string,
  gatewayEventId: string,
) {
  try {
    const entity = entityFromPayload(payload);
    const checkout = checkoutFromPayload(payload);
    const reference = parseExternalReference(entity.externalReference || payload.externalReference || checkout.externalReference);
    const mapped = mapEvent(eventType, entity);
    const customerId = providerCustomerId(entity);
    const subscriptionId = providerSubscriptionId(payload, entity);
    const checkoutSession = checkoutSessionId(payload, entity, checkout);
    const normalizedEventType = eventType.toUpperCase();
    const checkoutReference = reference.negocioId
      ? { negocioId: null, planCode: null, action: null, request: null }
      : await referenceFromCheckoutSession(admin, checkoutSession);
    const negocioId = reference.negocioId || checkoutReference.negocioId;
    const planCode = reference.planCode || checkoutReference.planCode;
    const action = reference.action || checkoutReference.action;

    if (action === 'upgrade' || action === 'upgrade_proration') {
      if (!negocioId || !planCode) {
        throw new Error('upgrade_reference_missing');
      }

      if (normalizedEventType !== 'PAYMENT_CONFIRMED') {
        await markEventProcessed(admin, providerEventId, {
          negocio_id: negocioId,
          provider_customer_id: customerId,
          provider_subscription_id: subscriptionId,
          provider_status: providerStatus(entity),
        });
        return;
      }

      const { data: subscription, error: subscriptionError } = await admin
        .from('business_subscriptions')
        .select('id, provider, provider_subscription_id')
        .eq('negocio_id', negocioId)
        .maybeSingle();
      if (subscriptionError) throw subscriptionError;
      if (!subscription) throw new Error('subscription_not_found');

      const { data: targetPlan, error: planError } = await admin
        .from('billing_plans')
        .select('code, name, price_cents')
        .eq('code', planCode)
        .eq('active', true)
        .maybeSingle();
      if (planError) throw planError;
      if (!targetPlan) throw new Error('plan_not_found');

      const providerSubscriptionId = scalarId((checkoutReference.request || {}).providerSubscriptionId)
        || scalarId(subscription.provider_subscription_id)
        || subscriptionId;
      let providerPayload: Record<string, unknown> = {};
      if (String(subscription.provider || '').toLowerCase() === ASAAS_PROVIDER && providerSubscriptionId) {
        providerPayload = {
          provider_response: await updateAsaasSubscriptionValue(providerSubscriptionId, targetPlan),
        };
      }

      const { data: upgradeStatus, error: upgradeError } = await admin.rpc('apply_paid_business_plan_upgrade', {
        p_negocio_id: negocioId,
        p_plan_code: planCode,
        p_provider_event_id: providerEventId,
        p_provider_payload: {
          webhook_payload: payload,
          checkout_request: checkoutReference.request || null,
          providerPayload,
        },
      });
      if (upgradeError) throw upgradeError;

      await markEventProcessed(admin, providerEventId, {
        negocio_id: negocioId,
        subscription_id: (upgradeStatus as Record<string, unknown>)?.subscription_id || subscription.id,
        provider_customer_id: customerId,
        provider_subscription_id: providerSubscriptionId,
        provider_status: providerStatus(entity),
      });
      return;
    }

    const { error: processError } = await admin.rpc('process_gateway_event', {
      p_event_id: gatewayEventId,
      p_provider: ASAAS_PROVIDER,
      p_provider_event_id: providerEventId,
      p_negocio_id: negocioId,
      p_provider_customer_id: customerId,
      p_provider_subscription_id: subscriptionId,
      p_provider_status: providerStatus(entity),
      p_plan_code: planCode,
      p_payment_method_status: mapped.paymentMethodStatus,
      p_status: mapped.status,
      p_current_period_start: currentPeriodStart(normalizedEventType, entity),
      p_current_period_end: currentPeriodEnd(normalizedEventType, entity),
      p_canceled_at: normalizedEventType === 'SUBSCRIPTION_DELETED' || normalizedEventType === 'SUBSCRIPTION_INACTIVATED'
        ? new Date().toISOString()
        : null,
    });

    if (processError) {
      if (String(processError.message || '').includes('subscription_not_found')) {
        await recordIgnoredEvent(admin, payload, eventType, providerEventId, 'ignored_subscription_not_found', entity);
        return;
      }
      throw processError;
    }
  } catch (error) {
    console.error('asaas webhook processing failed:', error);
    await markEventProcessingError(admin, providerEventId, error);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: getCorsHeaders(req) });
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405, req);

  const expectedToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN');
  const receivedToken = req.headers.get('asaas-access-token') || '';
  if (!expectedToken || !(await timingSafeTokenMatch(receivedToken, expectedToken))) {
    return jsonResponse({ error: 'unauthorized' }, 401, req);
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const eventType = String(payload?.event || '');
    const eventId = String(payload?.id || '');
    if (!eventType || !eventId) return jsonResponse({ error: 'invalid_payload' }, 400, req);

    const entity = entityFromPayload(payload);
    const checkout = checkoutFromPayload(payload);
    const reference = parseExternalReference(entity.externalReference || payload.externalReference || checkout.externalReference);
    const admin = createAdminClient();
    const customerId = providerCustomerId(entity);
    const subscriptionId = providerSubscriptionId(payload, entity);
    const checkoutSession = checkoutSessionId(payload, entity, checkout);

    if (!reference.negocioId && !customerId && !subscriptionId && !checkoutSession) {
      await recordIgnoredEvent(admin, payload, eventType, eventId, 'ignored_unlinked_event', entity);
      return jsonResponse({ received: true, ignored: true }, 200, req);
    }

    const { data: gatewayEventId, error: recordError } = await admin.rpc('record_gateway_event', {
      p_provider: ASAAS_PROVIDER,
      p_event_type: eventType,
      p_payload: payload,
      p_provider_event_id: eventId,
      p_negocio_id: reference.negocioId,
      p_provider_customer_id: customerId,
      p_provider_subscription_id: subscriptionId,
      p_provider_status: providerStatus(entity),
    });
    if (recordError || !gatewayEventId) throw recordError || new Error('gateway_event_not_recorded');

    waitUntil(processAsaasEvent(admin, payload, eventType, eventId, String(gatewayEventId)));

    return jsonResponse({ received: true }, 200, req);
  } catch (error) {
    console.error('asaas-webhook failed:', error);
    return jsonResponse({ error: 'webhook_failed' }, 500, req);
  }
});
