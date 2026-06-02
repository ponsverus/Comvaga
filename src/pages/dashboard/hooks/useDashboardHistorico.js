import { useCallback, useEffect, useMemo, useState } from 'react';
import { AG_PAGE_SIZE, compareAgendamentoDateTimeDesc } from '../utils';
import { fetchAgendamentosNegocio } from '../api/dashboardApi';

export function useDashboardHistorico({
  negocioId,
  hoje,
  parceiroProfissionalId,
}) {
  const [historicoAgendamentos, setHistoricoAgendamentos] = useState([]);
  const [historicoPage, setHistoricoPage] = useState(0);
  const [historicoHasMore, setHistoricoHasMore] = useState(false);
  const [historicoLoadingMore, setHistoricoLoadingMore] = useState(false);
  const [historicoData, setHistoricoData] = useState('');
  const [historicoError, setHistoricoError] = useState('');

  useEffect(() => {
    setHistoricoData((prev) => (prev ? prev : hoje));
  }, [hoje]);

  const historicoProfIds = useMemo(
    () => (parceiroProfissionalId ? [parceiroProfissionalId] : []),
    [parceiroProfissionalId]
  );

  const fetchHistoricoPage = useCallback(async ({ profIds, date, page, append }) => {
    const rows = await fetchAgendamentosNegocio({
      negocioId,
      profissionalIds: profIds,
      dataInicio: date,
      dataFim: date,
      limit: AG_PAGE_SIZE,
      offset: page * AG_PAGE_SIZE,
    });

    setHistoricoAgendamentos((prev) => {
      const next = append ? [...prev, ...rows] : rows;
      const seen = new Set();
      return next
        .filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)))
        .sort(compareAgendamentoDateTimeDesc);
    });
    setHistoricoHasMore(rows.length === AG_PAGE_SIZE);
    setHistoricoError('');
  }, [negocioId]);

  useEffect(() => {
    if (!historicoData || !negocioId) return;
    setHistoricoPage(0);
    setHistoricoHasMore(false);
    setHistoricoAgendamentos([]);
    setHistoricoError('');
    fetchHistoricoPage({ profIds: historicoProfIds, date: historicoData, page: 0, append: false })
      .catch(() => {
        setHistoricoAgendamentos([]);
        setHistoricoHasMore(false);
        setHistoricoError('dashboard.history_load_error');
      });
  }, [fetchHistoricoPage, historicoData, historicoProfIds, negocioId]);

  const loadMoreHistorico = useCallback(async () => {
    if (historicoLoadingMore || !historicoHasMore || !negocioId) return;
    try {
      setHistoricoLoadingMore(true);
      const nextPage = historicoPage + 1;
      await fetchHistoricoPage({ profIds: historicoProfIds, date: historicoData, page: nextPage, append: true });
      setHistoricoPage(nextPage);
    } catch (error) {
      console.warn('Falha ao carregar mais histórico.', error);
      setHistoricoError('dashboard.history_load_error');
    } finally {
      setHistoricoLoadingMore(false);
    }
  }, [
    fetchHistoricoPage,
    historicoData,
    historicoHasMore,
    historicoLoadingMore,
    historicoPage,
    historicoProfIds,
    negocioId,
  ]);

  return {
    historicoAgendamentos,
    historicoHasMore,
    historicoLoadingMore,
    historicoError,
    historicoData,
    setHistoricoData,
    loadMoreHistorico,
  };
}
