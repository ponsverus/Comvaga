import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import {
  fetchBillingPlans,
  fetchBusinessBillingStatus,
  setBusinessPlan,
} from '../api/dashboardApi';

function formatCurrencyFromCents(value) {
  return `R$ ${(Number(value || 0) / 100).toFixed(2).replace('.', ',')}`;
}

function formatDateBR(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
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
  const bookingAllowed = billingStatus?.booking_allowed !== false;
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
      setError('Não foi possível trocar o plano agora.');
    } finally {
      setSavingPlan('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-14 text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Carregando planos...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-normal text-white">Planos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Plano atual: <span className="text-primary">{selectedPlan?.name || statusText(billingStatus)}</span>
          </p>
        </div>

        <div className={`rounded-custom border px-5 py-4 ${bookingAllowed ? 'border-primary/30 bg-primary/10' : 'border-red-500/40 bg-red-500/10'}`}>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-white">
            <CreditCard className="h-4 w-4 text-primary" />
            {statusText(billingStatus)}
          </div>
          <div className="mt-2 grid gap-1 text-xs text-gray-400 sm:grid-cols-2">
            <span>Fim do teste: {formatDateBR(billingStatus?.trial_ends_at)}</span>
            <span>Bloqueio da agenda: {formatDateBR(billingStatus?.billing_blocked_at)}</span>
            <span>Pagamento: {billingStatus?.payment_method_status === 'valid' ? 'Validado' : 'Pendente'}</span>
            <span>Agenda: {bookingAllowed ? 'Liberada' : 'Bloqueada'}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-custom border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const active = plan.code === currentPlanCode;
          const saving = savingPlan === plan.code;
          return (
            <article key={plan.code} className={`flex flex-col rounded-custom border p-5 ${active ? 'border-primary bg-primary/10' : 'border-gray-800 bg-dark-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-normal text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{planLimitText(plan)}</p>
                </div>
                {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
              </div>

              <div className="mt-5">
                <span className="text-3xl font-normal text-white">{formatCurrencyFromCents(plan.price_cents)}</span>
                <span className="ml-1 text-sm text-gray-500">/mês</span>
              </div>

              <div className="mt-5 space-y-2 text-sm text-gray-400">
                <p>{plan.trial_days || 30} dias grátis</p>
                <p>{plan.grace_days || 2} dias de tolerância</p>
                <p>{planLimitText(plan)}</p>
              </div>

              <button
                type="button"
                disabled={active || !!savingPlan}
                onClick={() => handleSelectPlan(plan.code)}
                className={`mt-6 rounded-button px-4 py-2.5 text-sm font-normal uppercase transition-all ${active ? 'cursor-default bg-primary/20 text-primary' : 'border border-primary/40 text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40'}`}
              >
                {active ? 'Selecionado' : saving ? 'Salvando...' : 'Selecionar plano'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="rounded-custom border border-gray-800 bg-dark-100 px-5 py-4 text-sm text-gray-400">
        Gateway pendente: quando o provedor de pagamento for conectado, o webhook deve atualizar esta assinatura com
        método de pagamento válido, status ativo ou pendência de cobrança.
      </div>
    </section>
  );
}
