import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient, createUserClient } from '../_shared/supabase.ts';

const ASAAS_PROVIDER = 'asaas';
const DEFAULT_ASAAS_BASE_URL = 'https://api-sandbox.asaas.com/v3';

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

function asText(value: unknown) {
  return String(value || '').trim();
}

function isPaymentConfigured(status: Record<string, unknown> | null) {
  const current = String(status?.status || '').toLowerCase();
  const payment = String(status?.payment_method_status || '').toLowerCase();
  return current === 'active' && ['valid', 'none'].includes(payment);
}

async function cancelAsaasSubscription(subscriptionId: string) {
  const apiKey = requiredEnv('ASAAS_API_KEY');
  const baseUrl = (Deno.env.get('ASAAS_BASE_URL') || DEFAULT_ASAAS_BASE_URL).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: 'DELETE',
    headers: {
      access_token: apiKey,
      accept: 'application/json',
      'User-Agent': 'ComVaga/1.0',
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Asaas cancel subscription error:', response.status, data);
    const asaasError = Array.isArray(data?.errors)
      ? data.errors.map((item: Record<string, unknown>) => item.description || item.message || item.code).filter(Boolean).join(' | ')
      : data?.description || data?.message || JSON.stringify(data);
    throw new Error(`asaas_cancel_failed: ${asaasError || response.status}`);
  }

  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405);

  try {
    const authorization = req.headers.get('authorization') || '';
    if (!authorization.toLowerCase().startsWith('bearer ')) {
      return jsonResponse({ error: 'not_authenticated' }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const negocioId = asText(body?.negocio_id);
    if (!negocioId) return jsonResponse({ error: 'missing_required_fields' }, 400);

    const userClient = createUserClient(authorization);
    const admin = createAdminClient();
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData?.user?.id) return jsonResponse({ error: 'not_authenticated' }, 401);

    const [{ data: negocio, error: negocioError }, { data: subscription, error: subscriptionError }] = await Promise.all([
      admin.from('negocios').select('id, owner_id').eq('id', negocioId).maybeSingle(),
      admin
        .from('business_subscriptions')
        .select('id, negocio_id, provider, provider_subscription_id, status, payment_method_status')
        .eq('negocio_id', negocioId)
        .maybeSingle(),
    ]);

    if (negocioError) throw negocioError;
    if (subscriptionError) throw subscriptionError;
    if (!negocio || negocio.owner_id !== authData.user.id) return jsonResponse({ error: 'acao_nao_permitida' }, 403);
    if (!subscription || !isPaymentConfigured(subscription)) {
      return jsonResponse({ error: 'subscription_not_cancelable' }, 400);
    }

    let providerPayload: Record<string, unknown> = {
      source: 'owner_dashboard',
      negocio_id: negocioId,
    };
    const providerSubscriptionId = asText(subscription.provider_subscription_id);
    const provider = String(subscription.provider || '').toLowerCase();

    if (provider === ASAAS_PROVIDER && providerSubscriptionId) {
      providerPayload = {
        ...providerPayload,
        provider_response: await cancelAsaasSubscription(providerSubscriptionId),
      };
    }

    const { data: billingStatus, error: cancelError } = await admin.rpc('cancel_business_subscription', {
      p_negocio_id: negocioId,
      p_actor_id: authData.user.id,
      p_provider_event_id: `owner_cancel:${negocioId}:${crypto.randomUUID()}`,
      p_provider_payload: providerPayload,
    });

    if (cancelError) throw cancelError;
    return jsonResponse({ billing_status: billingStatus });
  } catch (error) {
    console.error('asaas-cancel-subscription failed:', error);
    return jsonResponse({ error: error?.message || 'cancel_failed' }, 400);
  }
});
