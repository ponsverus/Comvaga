import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { createAdminClient, createUserClient } from '../_shared/supabase.ts';

type BillingPlan = {
  code: string;
  name: string;
  price_cents: number;
  max_profissionais: number | null;
  features: Record<string, unknown>;
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

function hasFeature(plan: BillingPlan, feature: string) {
  return plan.features?.[feature] === true;
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

  const responseText = await response.text().catch(() => '');
  let data: Record<string, unknown> = {};
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.error('Asaas checkout error:', response.status, data || responseText);
    const asaasError = Array.isArray(data?.errors)
      ? data.errors.map((item: Record<string, unknown>) => item.description || item.message || item.code).filter(Boolean).join(' | ')
      : data?.description || data?.message || responseText || JSON.stringify(data);
    const details = String(asaasError || '').trim();
    throw new Error(`asaas_checkout_failed (${response.status}): ${details || 'empty_response'}`);
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
      admin.from('billing_plans').select('code, name, price_cents, max_profissionais, features').eq('code', planCode).eq('active', true).maybeSingle(),
      admin.from('negocios').select('id, owner_id, nome').eq('id', negocioId).maybeSingle(),
    ]);

    if (planFetchError) throw planFetchError;
    if (negocioError) throw negocioError;
    if (!plan) return jsonResponse({ error: 'plan_not_found' }, 404);
    if (!negocio || negocio.owner_id !== authData.user.id) return jsonResponse({ error: 'acao_nao_permitida' }, 403);

    const selectedPlan = plan as BillingPlan;

    if (selectedPlan.max_profissionais != null) {
      const { count, error: countError } = await admin
        .from('profissionais')
        .select('id', { count: 'exact', head: true })
        .eq('negocio_id', negocioId)
        .in('status', ['ativo', 'pendente']);
      if (countError) throw countError;
      if (Number(count || 0) > selectedPlan.max_profissionais) {
        return jsonResponse({ error: 'plan_professional_limit_reached' }, 400);
      }
    }

    if (!hasFeature(selectedPlan, 'offers')) {
      const { count, error: offersError } = await admin
        .from('entregas')
        .select('id', { count: 'exact', head: true })
        .eq('negocio_id', negocioId)
        .eq('ativo', true)
        .gt('preco_promocional', 0);
      if (offersError) throw offersError;
      if (Number(count || 0) > 0) {
        return jsonResponse({ error: 'feature_unavailable: offers' }, 400);
      }
    }

    const { data: statusData, error: statusError } = await userClient.rpc('get_business_billing_status', {
      p_negocio_id: negocioId,
    });
    if (statusError) throw statusError;

    const currentStatus = String(statusData?.status || '').toLowerCase();
    const paymentStatus = String(statusData?.payment_method_status || '').toLowerCase();
    const canOpenCheckout = (
      ['payment_required', 'billing_required', 'blocked', 'past_due', 'canceled'].includes(currentStatus)
      || Boolean(statusData?.cancellation_scheduled)
      || (currentStatus === 'active' && !['valid', 'none'].includes(paymentStatus))
    );

    if (!canOpenCheckout) {
      return jsonResponse({
        error: 'trial_access_active',
        billing_status: statusData,
      }, 409);
    }

    const siteUrl = publicSiteUrl(req);
    const externalReference = `comvaga:${negocioId}:${selectedPlan.code}`;
    const nextDueDate = asAsaasDateTime(new Date());
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

    const checkoutEventPayload = {
      checkout,
      checkout_request: {
        externalReference,
        planCode: selectedPlan.code,
        nextDueDate,
      },
    };
    const checkoutEventId = `checkout:${checkout.id}`;
    const { error: eventError } = await admin.rpc('record_gateway_event', {
      p_provider: ASAAS_PROVIDER,
      p_event_type: 'CHECKOUT_CREATED',
      p_payload: checkoutEventPayload,
      p_provider_event_id: checkoutEventId,
      p_negocio_id: negocioId,
      p_provider_customer_id: null,
      p_provider_subscription_id: null,
      p_provider_status: checkout?.status || null,
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
