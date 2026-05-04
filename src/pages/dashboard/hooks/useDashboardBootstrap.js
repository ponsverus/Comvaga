import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchAgendamentosNegocio,
  fetchEntregas,
  fetchGaleria,
  fetchNegocioById,
  fetchOfficialDate,
  fetchOwnerBusinessCount,
  fetchOwnerNegocio,
  fetchPartnerNegocioIds,
  fetchProfissionaisComStatus,
} from '../api/dashboardApi';

const AGENDAMENTOS_PAGE_SIZE = 15;

export function useDashboardBootstrap({
  userId,
  locationNegocioId,
  navigate,
  rpcSequence,
  uiAlert,
}) {
  const [parceiroProfissional, setParceiroProfissional] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [profissionais, setProfissionais] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosHasMore, setAgendamentosHasMore] = useState(false);
  const [agendamentosLoadingMore, setAgendamentosLoadingMore] = useState(false);
  const [galeriaItems, setGaleriaItems] = useState([]);
  const [ownerBusinessCount, setOwnerBusinessCount] = useState(0);
  const [bootstrapState, setBootstrapState] = useState('loading');
  const [error, setError] = useState(null);
  const [serverNow, setServerNow] = useState(() => ({ ts: null, dow: 0, date: '', source: 'db', minutes: 0 }));
  const [hoje, setHoje] = useState('');

  const hojeRef = useRef('');
  const loadDataRunRef = useRef(0);

  const fetchNowFromDb = useCallback(async () => {
    const payload = await fetchOfficialDate(rpcSequence);
    const date = String(payload.date || '');
    hojeRef.current = date;
    setServerNow(payload);
    setHoje(date);
    return date;
  }, [rpcSequence]);

  const reloadNegocio = useCallback(async (negocioId) => {
    const id = negocioId || negocio?.id;
    if (!id) return null;
    const data = await fetchNegocioById(id);
    if (!data) return null;
    setNegocio(data);
    return data;
  }, [negocio?.id]);

  const scopeProfissionais = useCallback((allProfissionais, negocioOwnerId) => {
    const ownerContext = negocioOwnerId === userId;
    const scoped = ownerContext ? allProfissionais : allProfissionais.filter((item) => item.user_id === userId);
    return {
      scoped,
      parceiro: ownerContext ? null : (scoped[0] || null),
    };
  }, [userId]);

  const reloadProfissionais = useCallback(async (negocioId, negocioOwnerId = negocio?.owner_id) => {
    const id = negocioId || negocio?.id;
    if (!id) return;
    const allProfissionais = await fetchProfissionaisComStatus(id);
    const { scoped, parceiro } = scopeProfissionais(allProfissionais, negocioOwnerId);
    setProfissionais(scoped);
    setParceiroProfissional(parceiro);
    return scoped;
  }, [negocio?.id, negocio?.owner_id, scopeProfissionais]);

  const reloadEntregas = useCallback(async (negocioId, profissionalIds) => {
    const id = negocioId || negocio?.id;
    const ids = profissionalIds || profissionais.map((item) => item.id);
    if (!id || !ids?.length) return;
    const rows = await fetchEntregas(id, ids);
    setEntregas(rows);
    return rows;
  }, [negocio?.id, profissionais]);

  const reloadAgendamentos = useCallback(async (negocioId, profissionalIds, dataHoje) => {
    const id = negocioId || negocio?.id;
    const ids = profissionalIds || profissionais.map((item) => item.id);
    const dataBase = dataHoje || hojeRef.current;
    if (!id || !ids?.length || !dataBase) return;
    const rows = await fetchAgendamentosNegocio({
      negocioId: id,
      profissionalIds: ids,
      dataInicio: dataBase,
      limit: AGENDAMENTOS_PAGE_SIZE + 1,
      offset: 0,
    });
    const visibleRows = rows.slice(0, AGENDAMENTOS_PAGE_SIZE);
    setAgendamentos(visibleRows);
    setAgendamentosHasMore(rows.length > AGENDAMENTOS_PAGE_SIZE);
    return visibleRows;
  }, [negocio?.id, profissionais]);

  const loadMoreAgendamentos = useCallback(async () => {
    const id = negocio?.id;
    const ids = profissionais.map((item) => item.id);
    const dataBase = hojeRef.current;
    if (agendamentosLoadingMore || !agendamentosHasMore || !id || !ids.length || !dataBase) return;

    try {
      setAgendamentosLoadingMore(true);
      const rows = await fetchAgendamentosNegocio({
        negocioId: id,
        profissionalIds: ids,
        dataInicio: dataBase,
        limit: AGENDAMENTOS_PAGE_SIZE + 1,
        offset: agendamentos.length,
      });
      const visibleRows = rows.slice(0, AGENDAMENTOS_PAGE_SIZE);
      setAgendamentos((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...visibleRows.filter((item) => !existingIds.has(item.id))];
      });
      setAgendamentosHasMore(rows.length > AGENDAMENTOS_PAGE_SIZE);
    } finally {
      setAgendamentosLoadingMore(false);
    }
  }, [agendamentos.length, agendamentosHasMore, agendamentosLoadingMore, negocio?.id, profissionais]);

  const reloadGaleria = useCallback(async (negocioId) => {
    const id = negocioId || negocio?.id;
    if (!id) return;
    const { data } = await fetchGaleria(id);
    setGaleriaItems(data || []);
    return data || [];
  }, [negocio?.id]);

  const loadData = useCallback(async (dataRef) => {
    if (!userId) {
      setError('Sessao invalida. Faca login novamente.');
      setBootstrapState('error');
      return;
    }

    const runId = ++loadDataRunRef.current;
    const isCurrentRun = () => loadDataRunRef.current === runId;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    setBootstrapState('loading');
    setError(null);
    setParceiroProfissional(null);
    setNegocio(null);
    setProfissionais([]);
    setEntregas([]);
    setAgendamentos([]);
    setAgendamentosHasMore(false);
    setGaleriaItems([]);

    try {
      const totalOwnerBusinesses = await fetchOwnerBusinessCount(userId);
      if (!isCurrentRun()) return;
      setOwnerBusinessCount(totalOwnerBusinesses);

      const resolveNegocioData = async () => {
        if (locationNegocioId) return fetchNegocioById(locationNegocioId);

        if (totalOwnerBusinesses > 0) {
          if (totalOwnerBusinesses > 1) {
            navigate('/selecionar-negocio', { replace: true });
            return '__redirect__';
          }
          return fetchOwnerNegocio(userId);
        }

        const negocioIds = await fetchPartnerNegocioIds(userId);
        if (negocioIds.length >= 1) return fetchNegocioById(negocioIds[0]);
        return null;
      };

      let negocioData = null;
      for (const delay of [0, 120, 320]) {
        if (delay) await wait(delay);
        negocioData = await resolveNegocioData();
        if (negocioData === '__redirect__') return;
        if (negocioData) break;
      }

      if (!isCurrentRun()) return;
      if (!negocioData) {
        setError('Nenhum negocio cadastrado.');
        setBootstrapState('error');
        return;
      }

      setNegocio(negocioData);
      const [galeriaResult, allProfissionais] = await Promise.all([
        fetchGaleria(negocioData.id),
        fetchProfissionaisComStatus(negocioData.id),
      ]);

      if (!isCurrentRun()) return;
      if (galeriaResult.error) {
        await uiAlert('dashboard.gallery_load_warning', 'warning');
      }
      setGaleriaItems(galeriaResult.data || []);

      const { scoped: scopedProfs, parceiro: meuProfissional } = scopeProfissionais(allProfissionais, negocioData.owner_id);
      const souDonoDoNegocio = negocioData.owner_id === userId;
      if (!souDonoDoNegocio && !meuProfissional) {
        setNegocio(null);
        setParceiroProfissional(null);
        setProfissionais([]);
        setEntregas([]);
        setAgendamentos([]);
        setAgendamentosHasMore(false);
        setGaleriaItems([]);
        setError('Você não tem acesso a este negócio.');
        setBootstrapState('error');
        return;
      }

      setParceiroProfissional(meuProfissional);
      setProfissionais(scopedProfs);
      if (!scopedProfs.length) {
        setEntregas([]);
        setAgendamentos([]);
        setAgendamentosHasMore(false);
        setBootstrapState('ready');
        return;
      }

      const ids = scopedProfs.map((item) => item.id);
      const dataHoje = (typeof dataRef === 'string' && dataRef) ? dataRef : hojeRef.current;
      const [entregasRows, agendamentoRows] = await Promise.all([
        fetchEntregas(negocioData.id, ids),
        dataHoje ? fetchAgendamentosNegocio({
          negocioId: negocioData.id,
          profissionalIds: ids,
          dataInicio: dataHoje,
          limit: AGENDAMENTOS_PAGE_SIZE + 1,
          offset: 0,
        }) : Promise.resolve([]),
      ]);

      if (!isCurrentRun()) return;
      setEntregas(entregasRows);
      setAgendamentos(agendamentoRows.slice(0, AGENDAMENTOS_PAGE_SIZE));
      setAgendamentosHasMore(agendamentoRows.length > AGENDAMENTOS_PAGE_SIZE);
      setBootstrapState('ready');
    } catch (e) {
      if (!isCurrentRun()) return;
      setError(e?.message || 'Erro inesperado.');
      setBootstrapState('error');
    }
  }, [locationNegocioId, navigate, scopeProfissionais, uiAlert, userId]);

  const reloadFull = useCallback(async () => {
    try {
      const data = await fetchNowFromDb();
      await loadData(data);
    } catch {
      await loadData('');
    }
  }, [fetchNowFromDb, loadData]);

  useEffect(() => {
    let active = true;
    if (!userId) return () => { active = false; };

    (async () => {
      try {
        const data = await fetchNowFromDb();
        if (active) await loadData(data);
      } catch {
        if (active) await loadData('');
      }
    })();

    return () => {
      active = false;
    };
  }, [userId, fetchNowFromDb, loadData]);

  return {
    parceiroProfissional,
    setParceiroProfissional,
    negocio,
    setNegocio,
    profissionais,
    setProfissionais,
    entregas,
    setEntregas,
    agendamentos,
    setAgendamentos,
    agendamentosHasMore,
    agendamentosLoadingMore,
    galeriaItems,
    setGaleriaItems,
    ownerBusinessCount,
    bootstrapState,
    error,
    serverNow,
    setServerNow,
    hoje,
    setHoje,
    fetchNowFromDb,
    reloadNegocio,
    reloadProfissionais,
    reloadEntregas,
    reloadAgendamentos,
    loadMoreAgendamentos,
    reloadGaleria,
    loadData,
    reloadFull,
  };
}
