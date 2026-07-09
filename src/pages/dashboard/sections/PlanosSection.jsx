import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  cancelAsaasSubscription,
  createAsaasCheckout,
  fetchBillingPlans,
  fetchBusinessBillingStatus,
} from '../api/dashboardApi';
import { getRequestErrorKey } from '../../../utils/requestError';
import { useFeedback } from '../../../feedback/useFeedback';
import { ptBR } from '../../../feedback/messages/ptBR.js';

function getByPath(obj, path) {
  const parts = String(path || '').split('.');
  let cur = obj;
  for (const part of parts) {
    if (!cur || typeof cur !== 'object') return null;
    cur = cur[part];
  }
  return cur || null;
}

function interpolateMessage(value, params) {
  return String(value || '').replace(/\{(\w+)\}/g, (_, key) => {
    const next = params?.[key];
    return next === undefined || next === null ? '' : String(next);
  });
}

function messageBody(key, params) {
  const entry = getByPath(ptBR, key);
  return interpolateMessage(entry?.body || '', params);
}

function formatCurrencyFromCents(value) {
  return `R$ ${(Number(value || 0) / 100).toFixed(2).replace('.', ',')}`;
}

function isCancellationScheduled(status) {
  return Boolean(status?.cancellation_scheduled)
    || (
      String(status?.status || '').toLowerCase() === 'active'
      && Boolean(status?.canceled_at)
      && Boolean(status?.access_ends_on || status?.access_ends_at || status?.cancel_at || status?.current_period_end)
    );
}

function statusText(status) {
  if (isCancellationScheduled(status)) return 'Cancelado';
  const current = String(status?.status || '').toLowerCase();
  if (current === 'active') return 'Ativo';
  if (current === 'trialing') return 'Teste grátis';
  if (current === 'past_due') return 'Pagamento pendente';
  if (current === 'blocked') return 'Agenda bloqueada';
  if (current === 'billing_required') return 'Agenda bloqueada';
  if (current === 'payment_required') return 'Pagamento necessário';
  if (current === 'canceled') return 'Cancelado';
  return 'Config.';
}

function statusBadgeClass(status) {
  if (isCancellationScheduled(status)) {
    return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200';
  }

  const current = String(status?.status || '').toLowerCase();
  const paymentStatus = String(status?.payment_method_status || '').toLowerCase();

  if (current === 'active' && ['valid', 'none'].includes(paymentStatus)) {
    return 'border-green-400/30 bg-green-400/10 text-green-300';
  }
  if (current === 'trialing') {
    return 'border-primary/30 bg-primary/10 text-primary';
  }
  if (current === 'payment_required') {
    return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-200';
  }
  if (current === 'billing_required' || current === 'blocked' || current === 'past_due') {
    return 'border-red-400/30 bg-red-400/10 text-red-200';
  }
  if (current === 'canceled') {
    return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
  }

  return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
}

function statusButtonText(status) {
  if (isCancellationScheduled(status)) return 'Reativar plano';
  const current = String(status?.status || '').toLowerCase();
  if (current === 'billing_required' || current === 'blocked' || current === 'past_due') {
    return 'Regularizar pagamento';
  }
  if (current === 'canceled') return 'Reativar plano';
  return 'Adicionar pagamento';
}

function statusButtonClass(status) {
  if (isCancellationScheduled(status)) {
    return 'rounded-full border border-primary text-primary px-5 py-2.5 text-xs font-normal uppercase tracking-wider hover:bg-primary/10';
  }

  const current = String(status?.status || '').toLowerCase();
  if (current === 'billing_required' || current === 'blocked' || current === 'past_due') {
    return 'rounded-full bg-yellow-400 px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-black hover:bg-yellow-300';
  }
  if (current === 'payment_required' || current === 'trialing') {
    return 'rounded-full bg-primary px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-black hover:bg-primary/90';
  }
  return 'rounded-full border border-primary text-primary px-5 py-2.5 text-xs font-normal uppercase tracking-wider hover:bg-primary/10';
}

function getPlanCancelErrorMessage(error) {
  const raw = `${error?.code || ''} ${error?.message || ''} ${error?.details || ''}`.toLowerCase();
  if (raw.includes('subscription_not_cancelable')) {
    return messageBody('dashboard.billing_cancel_not_cancelable');
  }
  if (raw.includes('asaas_cancel_failed')) {
    return messageBody('dashboard.billing_cancel_gateway_error');
  }
  return messageBody('dashboard.billing_cancel_error');
}

function getPlanChangeErrorMessage(error) {
  const raw = `${error?.code || ''} ${error?.message || ''} ${error?.details || ''}`.toLowerCase();
  if (raw.includes('plan_professional_limit_reached')) {
    return messageBody('dashboard.plan_professional_limit_reached');
  }
  if (raw.includes('feature_unavailable') && raw.includes('offers')) {
    return messageBody('dashboard.plan_feature_offers_unavailable');
  }
  if (raw.includes('asaas_checkout_failed')) {
    return messageBody('dashboard.billing_checkout_error');
  }
  return messageBody('dashboard.billing_plan_change_error');
}

function getPlanLimit(plan) {
  if (plan?.max_profissionais == null) return null;
  const value = Number(plan.max_profissionais);
  return Number.isFinite(value) ? value : null;
}

function getPlanLimitMessage(plan, count) {
  const limit = getPlanLimit(plan);
  if (limit == null) return '';
  return messageBody('dashboard.plan_professional_limit_current', {
    count,
    limit,
    professionalsLabel: limit === 1 ? 'profissional ativo ou pendente' : 'profissionais ativos ou pendentes',
  });
}

const PLAN_CONTENT = {
  essencial: {
    label: 'Essencial',
    description: 'Para autônomos que buscam organizar sua agenda.',
    badgeClass: 'text-gray-400 bg-gray-800',
    price: (
      <>
        R$ 39<span className="text-base font-normal text-gray-500">,99/mês</span>
      </>
    ),
    items: [
      'Reabertura automática de horários cancelados na agenda',
      'Reserva em lote de múltiplos trabalhos em sequência para o mesmo dia',
      'Direcionamento inteligente de novos agendamentos para horários colados aos já existentes',
      'Controle individual para um único profissional com indicadores básicos de agendamentos e receita',
      'Agendamento assistido pelo profissional',
      'Vitrine profissional',
      'Sistema segmentado: Notas e depoimentos separados por profissional e por negócio',
      'Reagendamento inteligente em um clique pela área exclusiva do cliente',
      'Alertas por e-mail em tempo real',
      'Lembrete automático 30 min antes',
      'Sincronia total com o Google Agenda.',
    ],
    checkClass: 'text-gray-600',
    textClass: 'text-gray-400',
    buttonText: 'Selecionar Essencial',
    buttonClass: 'bg-transparent border border-primary text-primary text-xs font-normal uppercase tracking-wider rounded-full hover:bg-primary/10',
  },
  profissional: {
    label: 'Profissional',
    description: 'Para negócios em crescimento, com inteligência de dados e gerenciamento centralizado de equipe.',
    badgeClass: 'text-primary bg-primary/15',
    price: (
      <>
        R$ <span className="text-green-400">39</span><span className="text-base font-normal text-green-400">,99</span><span className="text-base font-normal text-gray-400">/mês</span>
      </>
    ),
    items: [
      'Tudo do plano ESSENCIAL',
      'Painel admin: controle de múltiplos profissionais',
      'Painel individual para cada profissional parceiro',
      'Até 5 profissionais parceiros sem taxas ou custos adicionais',
      'Métricas de faturamento e desempenho operacional por data ou período',
      'Montagem de ofertas nos trabalhos oferecidos',
    ],
    checkClass: 'text-primary',
    textClass: 'text-gray-300',
    highlight: 'MESMO VALOR DO ESSENCIAL COM MAIS BENEFÍCIOS',
    buttonText: 'Selecionar plano',
    buttonClass: 'bg-gradient-to-r from-primary to-yellow-600 text-black text-sm uppercase rounded-full hover:shadow-lg hover:shadow-primary/30',
  },
  premium: {
    label: 'Premium Real',
    description: 'Experiência completa com acesso ilimitado a todos os recursos.',
    badgeClass: 'text-gray-400 bg-gray-800',
    price: (
      <>
        R$ 69<span className="text-base font-normal text-gray-500">,99/mês</span>
      </>
    ),
    items: [
      'Tudo do plano PROFISSIONAL',
      'Profissionais ilimitados e sem custo extra por parceiro',
      'Comprometimento da agenda e receita futura projetada',
      'Acesso antecipado a novos recursos',
    ],
    checkClass: 'text-gray-600',
    textClass: 'text-gray-400',
    buttonText: 'Selecionar Premium',
    buttonClass: 'bg-transparent border border-primary text-primary text-xs font-normal uppercase tracking-wider rounded-full hover:bg-primary/10',
  },
};

function CheckMark({ className }) {
  return (
    <svg className={`h-4 w-4 shrink-0 mt-0.5 ${className}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarGlyph({ className = '', sizeClass = 'h-8 w-8 text-[32px]' }) {
  return (
    <span className={`inline-flex items-center justify-center font-normal leading-none text-primary ${sizeClass} ${className}`}>
      {'\u2606'}
    </span>
  );
}

export default function PlanosSection({ negocioId, profissionais = [], onBillingStatusChange }) {
  const feedback = useFeedback();
  const [plans, setPlans] = useState([]);
  const [billingStatus, setBillingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState('');
  const [cancelingPlan, setCancelingPlan] = useState('');
  const [error, setError] = useState('');
  const planScrollerRef = useRef(null);
  const planCardRefs = useRef({});

  const loadBilling = useCallback(async () => {
    if (!negocioId) return;
    setLoading(true);
    setError('');
    try {
      const [plansData, statusData] = await Promise.all([
        fetchBillingPlans(),
        fetchBusinessBillingStatus(negocioId),
      ]);
      setPlans(plansData);
      setBillingStatus(statusData);
      onBillingStatusChange?.(statusData);
    } catch (err) {
      console.error('PlanosSection load error:', err);
      const requestKey = getRequestErrorKey(err);
      if (requestKey === 'alerts.request_timeout') {
        setError(messageBody('alerts.request_timeout'));
      } else if (requestKey === 'alerts.rate_limit_exceeded') {
        setError(messageBody('alerts.rate_limit_exceeded'));
      } else {
        setError(messageBody('dashboard.billing_plans_load_error'));
      }
    } finally {
      setLoading(false);
    }
  }, [negocioId, onBillingStatusChange]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const currentPlanCode = billingStatus?.plan_code || '';
  const currentStatusLabel = statusText(billingStatus);
  const cancellationScheduled = isCancellationScheduled(billingStatus);
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.code === currentPlanCode) || null,
    [currentPlanCode, plans]
  );
  const billableProfessionalsCount = useMemo(
    () => profissionais.filter((item) => ['ativo', 'pendente'].includes(String(item?.status || '').toLowerCase())).length,
    [profissionais]
  );

  useEffect(() => {
    const scroller = planScrollerRef.current;
    const activeCard = planCardRefs.current[currentPlanCode];
    if (!scroller || !activeCard) return;

    window.requestAnimationFrame(() => {
      const scrollerRect = scroller.getBoundingClientRect();
      const cardRect = activeCard.getBoundingClientRect();
      const nextLeft = scroller.scrollLeft
        + (cardRect.left - scrollerRect.left)
        - ((scrollerRect.width - cardRect.width) / 2);

      scroller.scrollTo({ left: Math.max(0, nextLeft), behavior: 'auto' });
    });
  }, [currentPlanCode, plans]);

  const handleSelectPlan = async (planCode) => {
    if (!negocioId || savingPlan) return;
    const targetPlan = plans.find((plan) => plan.code === planCode);
    const targetLimit = getPlanLimit(targetPlan);
    if (targetLimit != null && billableProfessionalsCount > targetLimit) {
      setError(getPlanLimitMessage(targetPlan, billableProfessionalsCount));
      return;
    }

    setSavingPlan(planCode);
    setError('');
    try {
      const checkout = await createAsaasCheckout(negocioId, planCode);
      if (checkout?.billing_status) {
        setBillingStatus(checkout.billing_status);
        onBillingStatusChange?.(checkout.billing_status);
      }
      window.location.assign(checkout.checkout_url);
    } catch (err) {
      console.error('createAsaasCheckout error:', err);
      const requestKey = getRequestErrorKey(err);
      if (requestKey === 'alerts.request_timeout') {
        setError(messageBody('dashboard.billing_checkout_timeout'));
      } else if (requestKey === 'alerts.rate_limit_exceeded') {
        setError(messageBody('alerts.rate_limit_exceeded'));
      } else {
        setError(getPlanChangeErrorMessage(err));
      }
    } finally {
      setSavingPlan('');
    }
  };

  const handleCancelPlan = async (planCode) => {
    if (!negocioId || savingPlan || cancelingPlan) return;
    const confirmed = await feedback.confirm('dashboard.billing_cancel_confirm');
    if (!confirmed) return;

    setCancelingPlan(planCode);
    setError('');
    try {
      const result = await cancelAsaasSubscription(negocioId);
      if (result?.billing_status) {
        setBillingStatus(result.billing_status);
        onBillingStatusChange?.(result.billing_status);
      } else {
        await loadBilling();
      }
    } catch (err) {
      console.error('cancelAsaasSubscription error:', err);
      const requestKey = getRequestErrorKey(err);
      if (requestKey === 'alerts.request_timeout') {
        setError(messageBody('dashboard.billing_cancel_timeout'));
      } else if (requestKey === 'alerts.rate_limit_exceeded') {
        setError(messageBody('alerts.rate_limit_exceeded'));
      } else {
        setError(getPlanCancelErrorMessage(err));
      }
    } finally {
      setCancelingPlan('');
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-14 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        CARREGANDO PLANOS...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-normal text-white">PLANOS</h2>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm uppercase text-gray-500">
          <span>PLANO ATUAL: <span className="text-primary">{selectedPlan?.name || currentStatusLabel}</span></span>
        </div>
      </div>

      {error && (
        <div className="rounded-custom border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div
        ref={planScrollerRef}
        className="-mx-6 -mb-6 bg-gray-800 border-t border-gray-800 flex sm:grid sm:grid-cols-3 gap-px overflow-x-auto sm:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {plans.map((plan) => {
          const active = plan.code === currentPlanCode;
          const saving = savingPlan === plan.code;
          const canceling = cancelingPlan === plan.code;
          const paymentStatus = String(billingStatus?.payment_method_status || '').toLowerCase();
          const currentStatus = String(billingStatus?.status || '').toLowerCase();
          const scheduledCancellation = active && cancellationScheduled;
          const canCancel = active
            && !scheduledCancellation
            && currentStatus === 'active'
            && ['valid', 'none'].includes(paymentStatus);
          const needsPayment = active
            && !['valid', 'none'].includes(paymentStatus);
          const activeWithoutAction = active && !needsPayment && !scheduledCancellation;
          const planLimit = getPlanLimit(plan);
          const planLimitBlocked = !active && planLimit != null && billableProfessionalsCount > planLimit;
          const selectedStatusLabel = statusText(billingStatus);
          const selectedStatusClass = statusBadgeClass(billingStatus);
          const selectedPaymentButtonText = statusButtonText(billingStatus);
          const selectedPaymentButtonClass = statusButtonClass(billingStatus);
          const content = PLAN_CONTENT[plan.code] || {
            label: plan.name,
            description: '',
            badgeClass: 'text-gray-400 bg-gray-800',
            price: (
              <>
                {formatCurrencyFromCents(plan.price_cents)}
                <span className="text-base font-normal text-gray-500">/mês</span>
              </>
            ),
            items: [],
            checkClass: 'text-gray-600',
            textClass: 'text-gray-400',
            buttonText: 'Selecionar plano',
            buttonClass: 'bg-transparent border border-primary text-primary text-xs font-normal uppercase tracking-wider rounded-full hover:bg-primary/10',
          };

          return (
            <article
              key={plan.code}
              ref={(node) => {
                if (node) planCardRefs.current[plan.code] = node;
                else delete planCardRefs.current[plan.code];
              }}
              className={`relative shrink-0 w-[calc(100vw-3rem)] sm:w-auto snap-center p-8 sm:p-10 flex flex-col px-4 sm:px-8 md:px-12 ${plan.code === 'profissional' ? 'bg-primary/5' : 'bg-dark-100'}`}
            >
              <div className="mb-5">
                <span className={`inline-block text-[10px] font-normal uppercase tracking-widest rounded-full px-3 py-1 mb-4 ${content.badgeClass}`}>
                  {content.label}
                </span>
                {active && (
                  <span className={`absolute right-4 top-8 sm:right-8 sm:top-10 rounded-full border px-3 py-1 text-[10px] font-normal uppercase tracking-wide ${selectedStatusClass}`}>
                    {selectedStatusLabel}
                  </span>
                )}
                <p className="text-2xl font-normal text-white mb-1">
                  {content.price}
                </p>
                <p className={`text-sm leading-relaxed ${plan.code === 'profissional' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {content.description}
                </p>
              </div>

              <div className="pt-5 flex flex-col gap-3 flex-grow">
                {content.items.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckMark className={content.checkClass} />
                    <span className={`text-sm leading-snug ${content.textClass}`}>{item}</span>
                  </div>
                ))}
              </div>

              {content.highlight && (
                <div className="mt-8 flex items-center justify-center gap-2.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-3">
                  <StarGlyph sizeClass="h-4 w-4 text-[18px]" className="shrink-0" />
                  <span className="text-xs font-normal text-primary uppercase tracking-wide">
                    PLANO PROFISSIONAL PELO MESMO <strong className="font-bold">VALOR</strong> DO ESSENCIAL, COM MAIS BENEFÍCIOS
                  </span>
                </div>
              )}

              <button
                type="button"
                disabled={activeWithoutAction || !!savingPlan || !!cancelingPlan || planLimitBlocked}
                onClick={() => handleSelectPlan(plan.code)}
                className={`mt-4 flex min-h-[42px] items-center justify-center px-5 py-2.5 transition-all disabled:cursor-not-allowed disabled:opacity-40 ${activeWithoutAction ? 'cursor-default rounded-full bg-green-400/10 text-xs font-normal uppercase tracking-wider text-green-300 border border-green-400/30' : active && (needsPayment || scheduledCancellation) ? selectedPaymentButtonClass : content.buttonClass}`}
              >
                {planLimitBlocked ? 'Limite excedido' : activeWithoutAction ? 'Plano ativo' : saving ? 'Abrindo checkout...' : active && (needsPayment || scheduledCancellation) ? selectedPaymentButtonText : content.buttonText}
              </button>

              {canCancel && (
                <button
                  type="button"
                  disabled={!!savingPlan || !!cancelingPlan}
                  onClick={() => handleCancelPlan(plan.code)}
                  className="mt-3 flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-red-300 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {canceling ? 'Cancelando...' : 'Cancelar'}
                </button>
              )}
            </article>
          );
        })}
      </div>

    </section>
  );
}
