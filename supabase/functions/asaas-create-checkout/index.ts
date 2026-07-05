import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient, createUserClient } from '../_shared/supabase.ts';

type BillingPlan = {
  code: string;
  name: string;
  price_cents: number;
  trial_days: number;
};

const ASAAS_PROVIDER = 'asaas';
const DEFAULT_ASAAS_BASE_URL = 'https://api-sandbox.asaas.com/v3';
const DEFAULT_CHECKOUT_BASE_URL = 'https://asaas.com/checkoutSession/show';
const DEFAULT_SANDBOX_CHECKOUT_BASE_URL = 'https://sandbox.asaas.com/checkoutSession/show';

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`missing_${name.toLowerCase()}`);
  return value;
}

function normalizePlanCode(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function asDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function asAsaasDateTime(date: Date) {
  return `${asDateOnly(date)} 00:00:00`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function checkoutUrlFor(id: string) {
  const apiBase = Deno.env.get('ASAAS_BASE_URL') || DEFAULT_ASAAS_BASE_URL;
  const defaultBase = apiBase.includes('api-sandbox.') ? DEFAULT_SANDBOX_CHECKOUT_BASE_URL : DEFAULT_CHECKOUT_BASE_URL;
  const base = Deno.env.get('ASAAS_CHECKOUT_BASE_URL') || defaultBase;
  const url = new URL(base);
  url.searchParams.set('id', id);
  return url.toString();
}

function publicSiteUrl(req: Request) {
  const configured = Deno.env.get('PUBLIC_SITE_URL') || Deno.env.get('APP_URL');
  if (configured) return configured.replace(/\/+$/, '');
  const origin = req.headers.get('origin');
  if (origin) return origin.replace(/\/+$/, '');
  throw new Error('missing_public_site_url');
}

function centsToReais(cents: number) {
  return Number((Number(cents || 0) / 100).toFixed(2));
}

async function callAsaas(path: string, body: Record<string, unknown>) {
  const apiKey = requiredEnv('ASAAS_API_KEY');
  const baseUrl = (Deno.env.get('ASAAS_BASE_URL') || DEFAULT_ASAAS_BASE_URL).replace(/\/+$/, '');

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      access_token: apiKey,
      accept: 'application/json',
      'content-type': 'application/json',
      'User-Agent': 'ComVaga/1.0',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Asaas checkout error:', response.status, data);
    const asaasError = Array.isArray(data?.errors)
      ? data.errors.map((item: Record<string, unknown>) => item.description || item.message || item.code).filter(Boolean).join(' | ')
      : data?.description || data?.message || JSON.stringify(data);
    throw new Error(`asaas_checkout_failed: ${asaasError || response.status}`);
  }

  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'method_not_allowed' }, 405);

  let adminForDebug: ReturnType<typeof createAdminClient> | null = null;
  let debugNegocioId: string | null = null;
  let debugPlanCode: string | null = null;
  let debugPayload: Record<string, unknown> = {};

  try {
    const authorization = req.headers.get('authorization') || '';
    if (!authorization.toLowerCase().startsWith('bearer ')) {
      return jsonResponse({ error: 'not_authenticated' }, 401);
    }

    const userClient = createUserClient(authorization);
    const admin = createAdminClient();
    adminForDebug = admin;
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData?.user?.id) return jsonResponse({ error: 'not_authenticated' }, 401);

    const body = await req.json().catch(() => ({}));
    const negocioId = String(body?.negocio_id || '').trim();
    const planCode = normalizePlanCode(body?.plan_code);
    debugNegocioId = negocioId || null;
    debugPlanCode = planCode || null;
    if (!negocioId || !planCode) return jsonResponse({ error: 'missing_required_fields' }, 400);

    const [{ data: plan, error: planFetchError }, { data: negocio, error: negocioError }] = await Promise.all([
      admin.from('billing_plans').select('code, name, price_cents, trial_days').eq('code', planCode).eq('active', true).maybeSingle(),
      admin.from('negocios').select('id, owner_id, nome').eq('id', negocioId).maybeSingle(),
    ]);

    if (planFetchError) throw planFetchError;
    if (negocioError) throw negocioError;
    if (!plan) return jsonResponse({ error: 'plan_not_found' }, 404);
    if (!negocio || negocio.owner_id !== authData.user.id) return jsonResponse({ error: 'acao_nao_permitida' }, 403);

    const { data: statusData, error: planError } = await userClient.rpc('set_business_plan', {
      p_negocio_id: negocioId,
      p_plan_code: planCode,
    });
    if (planError) throw planError;

    const selectedPlan = plan as BillingPlan;
    const siteUrl = publicSiteUrl(req);
    const externalReference = `comvaga:${negocioId}:${selectedPlan.code}`;
    const nextDueDate = asAsaasDateTime(addDays(new Date(), Number(selectedPlan.trial_days || 0)));
    const checkoutPayload = {
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      minutesToExpire: Number(Deno.env.get('ASAAS_CHECKOUT_EXPIRES_MINUTES') || 1440),
      externalReference,
      callback: {
        successUrl: `${siteUrl}/dashboard?tab=planos&billing=success`,
        cancelUrl: `${siteUrl}/dashboard?tab=planos&billing=cancel`,
        expiredUrl: `${siteUrl}/dashboard?tab=planos&billing=expired`,
      },
      items: [{
        name: `Plano ${selectedPlan.name}`,
        description: `Assinatura mensal do plano ${selectedPlan.name}`,
        quantity: 1,
        value: centsToReais(selectedPlan.price_cents),
      }],
      subscription: {
        cycle: 'MONTHLY',
        nextDueDate,
      },
    };
    debugPayload = checkoutPayload;

    const checkout = await callAsaas('/checkouts', checkoutPayload);
    if (!checkout?.id) throw new Error('asaas_checkout_without_id');

    const { error: eventError } = await admin.rpc('apply_gateway_subscription_event', {
      p_provider: ASAAS_PROVIDER,
      p_event_type: 'CHECKOUT_CREATED',
      p_payload: {
        checkout,
        checkout_request: {
          externalReference,
          planCode: selectedPlan.code,
          nextDueDate,
        },
      },
      p_provider_event_id: `checkout:${checkout.id}`,
      p_negocio_id: negocioId,
      p_plan_code: selectedPlan.code,
      p_payment_method_status: statusData?.payment_method_status || 'missing',
      p_status: statusData?.stored_status || statusData?.status || 'trialing',
    });
    if (eventError) throw eventError;

    return jsonResponse({
      checkout_id: checkout.id,
      checkout_url: checkout.url || checkout.link || checkoutUrlFor(checkout.id),
      billing_status: statusData,
    });
  } catch (error) {
    console.error('asaas-create-checkout failed:', error);
    try {
      await adminForDebug?.from('billing_events').insert({
        negocio_id: debugNegocioId,
        provider: ASAAS_PROVIDER,
        provider_event_id: `checkout_error:${crypto.randomUUID()}`,
        event_type: 'CHECKOUT_CREATE_FAILED',
        provider_status: 'failed',
        payload: {
          error: error?.message || 'checkout_failed',
          planCode: debugPlanCode,
          checkoutPayload: debugPayload,
        },
        processed_at: new Date().toISOString(),
        processing_error: error?.message || 'checkout_failed',
      });
    } catch (debugError) {
      console.error('checkout debug insert failed:', debugError);
    }
    return jsonResponse({ error: error?.message || 'checkout_failed' }, 400);
  }
});
