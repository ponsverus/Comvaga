import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  fetchBillingPlans,
  fetchBusinessBillingStatus,
  setBusinessPlan,
} from '../api/dashboardApi';

function formatCurrencyFromCents(value) {
  return `R$ ${(Number(value || 0) / 100).toFixed(2).replace('.', ',')}`;
}

function planLimitText(plan) {
  if (plan?.max_profissionais == null) return 'Profissionais ilimitados';
  if (Number(plan.max_profissionais) === 1) return '1 profissional';
  return `Até ${plan.max_profissionais} profissionais`;
}

function statusText(status) {
  const current = String(status?.status || '').toLowerCase();
  if (current === 'active') return 'Ativo';
  if (current === 'trialing') return 'Teste grátis';
  if (current === 'past_due') return 'Pagamento pendente';
  if (current === 'blocked') return 'Agenda bloqueada';
  if (current === 'billing_required') return 'Pagamento necessário';
  if (current === 'payment_required') return 'Pagamento necessário';
  if (current === 'canceled') return 'Cancelado';
  return 'Em configuração';
}

function getPlanChangeErrorMessage(error) {
  const raw = `${error?.code || ''} ${error?.message || ''} ${error?.details || ''}`.toLowerCase();
  if (raw.includes('plan_professional_limit_reached')) {
    return 'Este plano não comporta a quantidade atual de profissionais. Reduza os profissionais ativos/pendentes antes de trocar.';
  }
  if (raw.includes('feature_unavailable') && raw.includes('offers')) {
    return 'Este plano não permite ofertas. Remova as ofertas ativas antes de trocar.';
  }
  return 'Não foi possível trocar o plano agora.';
}

export default function PlanosSection({ negocioId }) {
  const [plans, setPlans] = useState([]);
  const [billingStatus, setBillingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState('');
  const [error, setError] = useState('');

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
    } catch (err) {
      console.error('PlanosSection load error:', err);
      setError('Não foi possível carregar os planos agora.');
    } finally {
      setLoading(false);
    }
  }, [negocioId]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const currentPlanCode = billingStatus?.plan_code || '';
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.code === currentPlanCode) || null,
    [currentPlanCode, plans]
  );

  const handleSelectPlan = async (planCode) => {
    if (!negocioId || savingPlan || planCode === currentPlanCode) return;
    setSavingPlan(planCode);
    setError('');
    try {
      const updated = await setBusinessPlan(negocioId, planCode);
      setBillingStatus(updated);
    } catch (err) {
      console.error('setBusinessPlan error:', err);
      setError(getPlanChangeErrorMessage(err));
    } finally {
      setSavingPlan('');
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
        <p className="mt-1 text-sm text-gray-500">
          PLANO ATUAL: <span className="text-primary">{selectedPlan?.name || statusText(billingStatus)}</span>
        </p>
      </div>

      {error && (
        <div className="rounded-custom border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-custom border border-gray-800 bg-dark-100">
        <div className="grid lg:grid-cols-3 divide-y divide-gray-800 lg:divide-y-0 lg:divide-x">
        {plans.map((plan) => {
          const active = plan.code === currentPlanCode;
          const saving = savingPlan === plan.code;
          return (
            <article key={plan.code} className={`flex min-h-[360px] flex-col p-6 sm:p-8 ${active ? 'bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-normal text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{planLimitText(plan)}</p>
                </div>
                {active && (
                  <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-normal uppercase tracking-wide text-primary">
                    Ativo
                  </span>
                )}
              </div>

              <div className="mt-5">
                <span className="text-3xl font-normal text-white">{formatCurrencyFromCents(plan.price_cents)}</span>
                <span className="ml-1 text-sm text-gray-500">/mês</span>
              </div>

              <button
                type="button"
                disabled={active || !!savingPlan}
                onClick={() => handleSelectPlan(plan.code)}
                className={`mt-auto rounded-button px-4 py-2.5 text-sm font-normal uppercase transition-all ${active ? 'cursor-default bg-primary/15 text-primary' : 'border border-primary/40 text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40'}`}
              >
                {active ? 'Selecionado' : saving ? 'Salvando...' : 'Selecionar plano'}
              </button>
            </article>
          );
        })}
        </div>
      </div>
    </section>
  );
}
