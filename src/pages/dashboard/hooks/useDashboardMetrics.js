import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardOverview } from '../api/dashboardApi';

export function useDashboardMetrics({
  negocioId,
  hoje,
  faturamentoData,
  faturamentoPeriodo,
  parceiroProfissionalId,
}) {
  const [metricsHoje, setMetricsHoje] = useState(null);
  const [metricsTopCards, setMetricsTopCards] = useState(null);
  const [metricsDia, setMetricsDia] = useState(null);
  const [metricsPeriodoData, setMetricsPeriodoData] = useState(null);
  const [metricsUtilizacao, setMetricsUtilizacao] = useState(null);
  const [metricsFutureBookings, setMetricsFutureBookings] = useState(null);
  const [proximoAgendamento, setProximoAgendamento] = useState(null);
  const [metricsHojeLoading, setMetricsHojeLoading] = useState(false);
  const [metricsTopCardsLoading, setMetricsTopCardsLoading] = useState(false);
  const [metricsDiaLoading, setMetricsDiaLoading] = useState(false);
  const [metricsPeriodoLoading, setMetricsPeriodoLoading] = useState(false);
  const [metricsUtilizacaoLoading, setMetricsUtilizacaoLoading] = useState(false);
  const [metricsFutureBookingsLoading, setMetricsFutureBookingsLoading] = useState(false);
  const [proximoAgendamentoLoading, setProximoAgendamentoLoading] = useState(false);

  const setOverviewLoading = useCallback((loading) => {
    setMetricsHojeLoading(loading);
    setMetricsTopCardsLoading(loading);
    setMetricsDiaLoading(loading);
    setMetricsPeriodoLoading(loading);
    setMetricsUtilizacaoLoading(loading);
    setMetricsFutureBookingsLoading(loading);
    setProximoAgendamentoLoading(loading);
  }, []);

  const clearOverview = useCallback(() => {
    setMetricsHoje(null);
    setMetricsTopCards(null);
    setMetricsDia(null);
    setMetricsPeriodoData(null);
    setMetricsUtilizacao(null);
    setMetricsFutureBookings(null);
    setProximoAgendamento(null);
  }, []);

  const loadOverview = useCallback(async (
    id = negocioId,
    refDateISO = hoje,
    selectedDateISO = faturamentoData || hoje,
    periodo = faturamentoPeriodo,
    profId = parceiroProfissionalId,
    options = {}
  ) => {
    if (!id || !refDateISO || !selectedDateISO) return;
    const silent = !!options?.silent;

    try {
      if (!silent) setOverviewLoading(true);
      const overview = await fetchDashboardOverview({
        negocioId: id,
        refDateISO: String(refDateISO),
        faturamentoDateISO: String(selectedDateISO),
        periodo: String(periodo || '7d'),
        profissionalId: profId,
      });
      setMetricsHoje(overview.metricsHoje);
      setMetricsTopCards(overview.metricsTopCards);
      setMetricsDia(overview.metricsDia);
      setMetricsPeriodoData(overview.metricsPeriodoData);
      setMetricsUtilizacao(overview.metricsUtilizacao);
      setMetricsFutureBookings(overview.metricsFutureBookings);
      setProximoAgendamento(overview.proximoAgendamento);
    } catch {
      clearOverview();
    } finally {
      if (!silent) setOverviewLoading(false);
    }
  }, [
    clearOverview,
    faturamentoData,
    faturamentoPeriodo,
    hoje,
    negocioId,
    parceiroProfissionalId,
    setOverviewLoading,
  ]);

  const loadHoje = useCallback((id = negocioId, profId = parceiroProfissionalId, options = {}) => (
    loadOverview(id, hoje, faturamentoData || hoje, faturamentoPeriodo, profId, options)
  ), [faturamentoData, faturamentoPeriodo, hoje, loadOverview, negocioId, parceiroProfissionalId]);

  const loadDia = useCallback((id = negocioId, dateISO = faturamentoData || hoje, profId = parceiroProfissionalId, options = {}) => (
    loadOverview(id, hoje, dateISO, faturamentoPeriodo, profId, options)
  ), [faturamentoData, faturamentoPeriodo, hoje, loadOverview, negocioId, parceiroProfissionalId]);

  const loadPeriodo = useCallback((id = negocioId, refDateISO = hoje, periodo = faturamentoPeriodo, profId = parceiroProfissionalId, options = {}) => (
    loadOverview(id, refDateISO, faturamentoData || refDateISO, periodo, profId, options)
  ), [faturamentoData, faturamentoPeriodo, hoje, loadOverview, negocioId, parceiroProfissionalId]);

  useEffect(() => {
    if (!negocioId || !hoje || !faturamentoData) return;
    loadOverview(negocioId, hoje, faturamentoData, faturamentoPeriodo, parceiroProfissionalId);
  }, [negocioId, hoje, faturamentoData, faturamentoPeriodo, parceiroProfissionalId, loadOverview]);

  return {
    metricsHoje,
    metricsTopCards,
    metricsDia,
    metricsPeriodoData,
    metricsUtilizacao,
    metricsFutureBookings,
    proximoAgendamento,
    metricsHojeLoading,
    metricsTopCardsLoading,
    metricsDiaLoading,
    metricsPeriodoLoading,
    metricsUtilizacaoLoading,
    metricsFutureBookingsLoading,
    proximoAgendamentoLoading,
    loadOverview,
    loadHoje,
    loadDia,
    loadPeriodo,
  };
}
