import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchOfficialDate,
  fetchVitrineDepoimentos,
  fetchVitrineEntregas,
  fetchVitrineGaleria,
  fetchVitrineNegocioBySlug,
  fetchVitrineProfissionais,
} from '../api/vitrineApi';

const EMPTY_NOW = { ts: null, dow: 0, date: '', source: 'db', minutes: 0 };
const GALERIA_PAGE_SIZE = 12;

export function useVitrineBootstrap({ slug, rpcSequence, getMsg }) {
  const [negocio, setNegocio] = useState(null);
  const [profissionais, setProfissionais] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [depoimentos, setDepoimentos] = useState([]);
  const [galeriaItems, setGaleriaItems] = useState([]);
  const [galeriaHasMore, setGaleriaHasMore] = useState(false);
  const [galeriaLoadingMore, setGaleriaLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverNow, setServerNow] = useState(EMPTY_NOW);
  const loadRunRef = useRef(0);

  const fetchNowFromDb = useCallback(async () => {
    const payload = await fetchOfficialDate(rpcSequence);
    setServerNow(payload);
    return payload;
  }, [rpcSequence]);

  const refreshDepoimentos = useCallback(async (negocioId) => {
    const deps = await fetchVitrineDepoimentos(negocioId);
    setDepoimentos(deps);
    return deps;
  }, []);

  const applyGaleriaPage = useCallback((rows, mode = 'replace') => {
    const safeRows = rows || [];
    const visibleRows = safeRows.slice(0, GALERIA_PAGE_SIZE);
    setGaleriaHasMore(safeRows.length > GALERIA_PAGE_SIZE);

    if (mode === 'append') {
      setGaleriaItems((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...visibleRows.filter((item) => !existingIds.has(item.id))];
      });
      return;
    }

    setGaleriaItems(visibleRows);
  }, []);

  const loadMoreGaleria = useCallback(async () => {
    if (!negocio?.id || galeriaLoadingMore || !galeriaHasMore) return;

    try {
      setGaleriaLoadingMore(true);
      const rows = await fetchVitrineGaleria(negocio.id, {
        limit: GALERIA_PAGE_SIZE + 1,
        offset: galeriaItems.length,
      });
      applyGaleriaPage(rows, 'append');
    } finally {
      setGaleriaLoadingMore(false);
    }
  }, [applyGaleriaPage, galeriaHasMore, galeriaItems.length, galeriaLoadingMore, negocio?.id]);

  const loadVitrine = useCallback(async () => {
    const runId = loadRunRef.current + 1;
    loadRunRef.current = runId;
    setLoading(true);
    setError(null);

    const watchdog = setTimeout(() => {
      if (loadRunRef.current !== runId) return;
      setLoading(false);
      setError(getMsg('load_timeout', 'Demorou demais para carregar. Tente novamente.'));
    }, 12000);

    try {
      fetchNowFromDb().catch(() => null);

      const negocioData = await fetchVitrineNegocioBySlug(slug);
      if (loadRunRef.current !== runId) return;
      if (!negocioData) {
        setNegocio(null);
        setProfissionais([]);
        setEntregas([]);
        setDepoimentos([]);
        setGaleriaItems([]);
        setGaleriaHasMore(false);
        setGaleriaLoadingMore(false);
        return;
      }

      setNegocio(negocioData);

      const profs = await fetchVitrineProfissionais(negocioData.id);
      if (loadRunRef.current !== runId) return;
      setProfissionais(profs);

      const profissionalIds = profs.map((p) => p.id).filter(Boolean);
      const [entregasData, galeriaData, deps] = await Promise.all([
        fetchVitrineEntregas(profissionalIds),
        fetchVitrineGaleria(negocioData.id, { limit: GALERIA_PAGE_SIZE + 1, offset: 0 }),
        fetchVitrineDepoimentos(negocioData.id),
      ]);
      if (loadRunRef.current !== runId) return;

      setEntregas(entregasData);
      applyGaleriaPage(galeriaData);
      setDepoimentos(deps);
    } catch (e) {
      if (loadRunRef.current !== runId) return;
      setError(e?.message || getMsg('load_error', 'Erro ao carregar a vitrine.'));
      setNegocio(null);
      setProfissionais([]);
      setEntregas([]);
      setDepoimentos([]);
      setGaleriaItems([]);
      setGaleriaHasMore(false);
      setGaleriaLoadingMore(false);
    } finally {
      clearTimeout(watchdog);
      if (loadRunRef.current === runId) {
        setLoading(false);
      }
    }
  }, [applyGaleriaPage, fetchNowFromDb, getMsg, slug]);

  useEffect(() => {
    loadVitrine();
  }, [loadVitrine]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchNowFromDb().catch(() => {});
    }, 60000);
    return () => clearInterval(timer);
  }, [fetchNowFromDb]);

  return {
    negocio,
    profissionais,
    entregas,
    depoimentos,
    galeriaItems,
    galeriaHasMore,
    galeriaLoadingMore,
    loading,
    error,
    serverNow,
    fetchNowFromDb,
    refreshDepoimentos,
    loadMoreGaleria,
    loadVitrine,
  };
}
