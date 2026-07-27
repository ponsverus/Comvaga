import { useCallback, useEffect, useState } from 'react';
import {
  fetchDashboardCanceladosHoje,
  fetchDashboardOverview,
} from '../api/dashboardApi';

const CANCELADOS_HOJE_PAGE_SIZE = 50;

export function useDashboardMetrics({
  negocioId,
  hoje,
  faturamentoData,
  faturamentoPeriodo,
  parceiroProfissionalId,
  shouldLoadCancelados = false,
}) {
  const [metricsHoje, setMetricsHoje] = useState(null);
  const [metricsTopCards, setMetricsTopCards] = useState(null);
  const [metricsDia, setMetricsDia] = useState(null);
  const [metricsPeriodoData, setMetricsPeriodoData] = useState(null);
  const [metricsUtilizacao, setMetricsUtilizacao] = useState(null);
  const [metricsFutureBookings, setMetricsFutureBookings] = useState(null);
  const [proximoAgendamento, setProximoAgendamento] = useState(null);
  const [canceladosHoje, setCanceladosHoje] = useState([]);
  const [canceladosHojeHasMore, setCanceladosHojeHasMore] = useState(false);
  const [metricsHojeLoading, setMetricsHojeLoading] = useState(false);
  const [metricsTopCardsLoading, setMetricsTopCardsLoading] = useState(false);
  const [metricsDiaLoading, setMetricsDiaLoading] = useState(false);
  const [metricsPeriodoLoading, setMetricsPeriodoLoading] = useState(false);
  const [metricsUtilizacaoLoading, setMetricsUtilizacaoLoading] = useState(false);
  const [metricsFutureBookingsLoading, setMetricsFutureBookingsLoading] = useState(false);
  const [proximoAgendamentoLoading, setProximoAgendamentoLoading] = useState(false);
  const [canceladosHojeLoading, setCanceladosHojeLoading] = useState(false);
  const [canceladosHojeLoadingMore, setCanceladosHojeLoadingMore] = useState(false);

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

  const loadCanceladosHoje = useCallback(async (id = negocioId, profId = parceiroProfissionalId, options = {}) => {
    if (!id) return;
    const silent = !!options?.silent;
    try {
      if (!silent) setCanceladosHojeLoading(true);
      const rows = await fetchDashboardCanceladosHoje({
        negocioId: id,
        profissionalId: profId,
        limit: CANCELADOS_HOJE_PAGE_SIZE + 1,
        offset: 0,
      });
      setCanceladosHoje(rows.slice(0, CANCELADOS_HOJE_PAGE_SIZE));
      setCanceladosHojeHasMore(rows.length > CANCELADOS_HOJE_PAGE_SIZE);
    } catch {
      setCanceladosHoje([]);
      setCanceladosHojeHasMore(false);
    } finally {
      if (!silent) setCanceladosHojeLoading(false);
    }
  }, [negocioId, parceiroProfissionalId]);

  const loadMoreCanceladosHoje = useCallback(async () => {
    if (canceladosHojeLoadingMore || !canceladosHojeHasMore || !negocioId) return;

    try {
      setCanceladosHojeLoadingMore(true);
      const rows = await fetchDashboardCanceladosHoje({
        negocioId,
        profissionalId: parceiroProfissionalId,
        limit: CANCELADOS_HOJE_PAGE_SIZE + 1,
        offset: canceladosHoje.length,
      });
      const visibleRows = rows.slice(0, CANCELADOS_HOJE_PAGE_SIZE);
      setCanceladosHoje((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...visibleRows.filter((item) => !existingIds.has(item.id))];
      });
      setCanceladosHojeHasMore(rows.length > CANCELADOS_HOJE_PAGE_SIZE);
    } finally {
      setCanceladosHojeLoadingMore(false);
    }
  }, [
    canceladosHoje.length,
    canceladosHojeHasMore,
    canceladosHojeLoadingMore,
    negocioId,
    parceiroProfissionalId,
  ]);

  useEffect(() => {
    if (!negocioId || !hoje || !faturamentoData) return;
    loadOverview(negocioId, hoje, faturamentoData, faturamentoPeriodo, parceiroProfissionalId);
  }, [negocioId, hoje, faturamentoData, faturamentoPeriodo, parceiroProfissionalId, loadOverview]);

  useEffect(() => {
    setCanceladosHoje([]);
    setCanceladosHojeHasMore(false);
  }, [negocioId, hoje, parceiroProfissionalId]);

  useEffect(() => {
    if (!shouldLoadCancelados || !negocioId || !hoje) return;
    loadCanceladosHoje(negocioId, parceiroProfissionalId);
  }, [shouldLoadCancelados, negocioId, hoje, parceiroProfissionalId, loadCanceladosHoje]);

  return {
    metricsHoje,
    metricsTopCards,
    metricsDia,
    metricsPeriodoData,
    metricsUtilizacao,
    metricsFutureBookings,
    proximoAgendamento,
    canceladosHoje,
    canceladosHojeHasMore,
    metricsHojeLoading,
    metricsTopCardsLoading,
    metricsDiaLoading,
    metricsPeriodoLoading,
    metricsUtilizacaoLoading,
    metricsFutureBookingsLoading,
    proximoAgendamentoLoading,
    canceladosHojeLoading,
    canceladosHojeLoadingMore,
    loadOverview,
    loadHoje,
    loadDia,
    loadPeriodo,
    loadCanceladosHoje,
    loadMoreCanceladosHoje,
  };
}
