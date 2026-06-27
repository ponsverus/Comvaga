import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, RefreshCw, Search, Send } from 'lucide-react';
import { ProfessionalIcon } from '../components/icons';
import { supabase } from '../supabase';

function getPublicUrl(bucket, path) {
  if (!bucket || !path) return null;
  try {
    const stripped = path.replace(new RegExp(`^${bucket}/`), '');
    const { data } = supabase.storage.from(bucket).getPublicUrl(stripped);
    return data?.publicUrl || null;
  } catch {
    return null;
  }
}

function formatBusinessAddress(negocio) {
  const rua = String(negocio?.endereco_rua || '').trim();
  const numero = String(negocio?.endereco_numero || '').trim();
  const bairro = String(negocio?.endereco_bairro || '').trim();
  const cidade = String(negocio?.endereco_cidade || '').trim();
  const estado = String(negocio?.endereco_estado || '').trim().toUpperCase();

  return [
    rua && numero ? `${rua}, ${numero}` : rua,
    bairro,
    estado || (!bairro ? cidade : ''),
  ].filter(Boolean).join(' - ');
}

function normalizeTag(row) {
  const status = String(row?.status || '').toLowerCase();
  const motivo = String(row?.motivo_inativo || '').toLowerCase();
  if (status === 'ativo') return 'ATIVO';
  if (status === 'pendente') return 'AGUARDANDO';
  if (status === 'inativo' && motivo === 'excluido_admin') return 'EXCLUÍDO';
  if (status === 'inativo') return 'INATIVO';
  return row?.tag === 'DISPONIVEL' ? 'DISPONÍVEL' : String(row?.tag || 'DISPONÍVEL');
}

function tagClass(row) {
  const tag = normalizeTag(row);
  if (tag === 'ATIVO') return 'border-green-500/30 bg-green-500/10 text-green-300';
  if (tag === 'AGUARDANDO') return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
  if (tag === 'EXCLUÍDO') return 'border-red-500/30 bg-red-500/10 text-red-300';
  if (tag === 'INATIVO') return 'border-gray-500/30 bg-gray-500/10 text-gray-300';
  return 'border-primary/30 bg-primary/10 text-primary';
}

function BusinessAvatar({ negocio }) {
  const logoUrl = getPublicUrl('logos', negocio?.logo_path);
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-dark-200 shrink-0 flex items-center justify-center">
      {logoUrl ? (
        <img src={logoUrl} alt={negocio?.nome || 'Negócio'} className="w-full h-full rounded-full object-cover" />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center">
          <ProfessionalIcon className="w-6 h-6 text-black" />
        </div>
      )}
    </div>
  );
}

function BusinessInfo({ negocio }) {
  const endereco = formatBusinessAddress(negocio);
  return (
    <div className="flex-1 min-w-0">
      <div className="font-normal text-white truncate">{negocio?.nome}</div>
      {negocio?.tipo_negocio && (
        <div className="text-xs text-gray-500 uppercase mt-0.5">{negocio.tipo_negocio}</div>
      )}
      {endereco && (
        <div className="text-xs text-gray-600 uppercase mt-0.5">{endereco}</div>
      )}
    </div>
  );
}

function AlertBox({ alert }) {
  if (!alert?.message) return null;
  const styles = {
    success: 'border-green-500/30 bg-green-500/10 text-green-300',
    warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300',
  };
  return (
    <div className={`rounded-custom border px-4 py-3 text-sm ${styles[alert.type] || styles.error}`}>
      {alert.message}
    </div>
  );
}

const emptyGroups = {
  ativos: [],
  aguardando: [],
  inativos: [],
  excluidos: [],
};

export default function SelecionarNegocioParceiro({ user, onLogout }) {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [term, setTerm] = useState('');
  const [searchRows, setSearchRows] = useState([]);
  const [searching, setSearching] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [nomeSolicitacao, setNomeSolicitacao] = useState('');
  const [alert, setAlert] = useState(null);

  const loadProfileName = useCallback(async () => {
    const fallback = String(user?.user_metadata?.nome || '').trim();
    if (fallback) {
      setNomeSolicitacao(fallback);
      return;
    }

    if (!user?.id) return;
    const { data } = await supabase
      .from('users')
      .select('nome')
      .eq('id', user.id)
      .maybeSingle();

    const nome = String(data?.nome || '').trim();
    if (nome && nome.toLowerCase() !== 'sem nome') setNomeSolicitacao(nome);
  }, [user?.id, user?.user_metadata?.nome]);

  const loadCenter = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setAlert(null);
    try {
      const { data, error } = await supabase.rpc('get_partner_business_center');
      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error?.message || 'Erro ao carregar seus negócios.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProfileName();
    loadCenter();
  }, [loadCenter, loadProfileName]);

  const groups = useMemo(() => {
    return (links || []).reduce((acc, item) => {
      const key = item?.categoria === 'excluidos'
        ? 'excluidos'
        : item?.categoria === 'inativos'
          ? 'inativos'
          : item?.categoria === 'aguardando'
            ? 'aguardando'
            : 'ativos';
      acc[key].push(item);
      return acc;
    }, { ...emptyGroups, ativos: [], aguardando: [], inativos: [], excluidos: [] });
  }, [links]);

  const selectBusiness = (row) => {
    if (!row?.can_open_dashboard || !row?.negocio_id || !user?.id) return;
    try {
      window.localStorage?.setItem(`comvaga:last-partner-negocio:${user.id}`, row.negocio_id);
    } catch {
      // Sem armazenamento local, o state da rota ainda leva ao dashboard.
    }
    navigate('/dashboard', { state: { negocioId: row.negocio_id } });
  };

  const searchBusinesses = async (e) => {
    e?.preventDefault?.();
    const clean = term.trim();
    setAlert(null);
    if (clean.length < 3) {
      setSearchRows([]);
      setAlert({ type: 'warning', message: 'Digite pelo menos 3 caracteres para pesquisar.' });
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase.rpc('search_partner_businesses', {
        p_term: clean,
        p_limit: 10,
      });
      if (error) throw error;
      setSearchRows(data || []);
      if (!data?.length) setAlert({ type: 'warning', message: 'Nenhum negócio encontrado para essa busca.' });
    } catch (error) {
      setAlert({ type: 'error', message: error?.message || 'Erro ao pesquisar negócios.' });
    } finally {
      setSearching(false);
    }
  };

  const requestAccess = async (row) => {
    const nome = nomeSolicitacao.trim().replace(/\s+/g, ' ');
    if (!nome) {
      setAlert({ type: 'warning', message: 'Informe seu nome profissional antes de solicitar parceria.' });
      return;
    }

    setRequestingId(row.negocio_id);
    setAlert(null);
    try {
      const { data, error } = await supabase.rpc('solicitar_acesso_parceiro', {
        p_negocio_id: row.negocio_id,
        p_nome: nome,
      });
      if (error) throw error;

      const status = String(data?.status || '');
      if (status === 'pending_approval') {
        setAlert({ type: 'success', message: 'Solicitação enviada. Aguarde o aval do responsável pelo negócio.' });
      } else if (status === 'ok') {
        setAlert({ type: 'success', message: 'Parceria ativa. Você já pode acessar o dashboard deste negócio.' });
      } else {
        setAlert({ type: 'warning', message: 'Solicitação processada. Atualize a lista para conferir o status.' });
      }

      await loadCenter({ silent: true });
      if (term.trim().length >= 3) {
        const { data: refreshedRows } = await supabase.rpc('search_partner_businesses', {
          p_term: term.trim(),
          p_limit: 10,
        });
        setSearchRows(refreshedRows || []);
      }
    } catch (error) {
      const raw = String(error?.message || '').toLowerCase();
      if (raw.includes('access_inactive')) {
        setAlert({ type: 'warning', message: 'Este vínculo está inativo ou excluído neste negócio.' });
      } else if (raw.includes('partner_plan_unavailable')) {
        setAlert({ type: 'warning', message: 'Este negócio ainda não recebe parceiros no plano atual.' });
      } else if (raw.includes('owner_cannot_request_partner_access')) {
        setAlert({ type: 'warning', message: 'Conta administradora não pode solicitar parceria.' });
      } else {
        setAlert({ type: 'error', message: error?.message || 'Erro ao solicitar parceria.' });
      }
    } finally {
      setRequestingId(null);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    loadCenter({ silent: true });
  };

  const renderBusinessRow = (row, { searchResult = false } = {}) => {
    const canOpen = !searchResult && row?.can_open_dashboard;
    const canRequest = searchResult && row?.can_request;
    return (
      <div
        key={`${searchResult ? 'search' : 'link'}:${row.negocio_id}:${row.profissional_id || 'none'}`}
        className="w-full flex items-center gap-4 p-4 bg-dark-100 border border-gray-800 rounded-custom transition-all text-left"
      >
        <BusinessAvatar negocio={row} />
        <BusinessInfo negocio={row} />
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded-full border px-3 py-1 text-[11px] font-normal uppercase ${tagClass(row)}`}>
            {normalizeTag(row)}
          </span>
          {canOpen && (
            <button
              type="button"
              onClick={() => selectBusiness(row)}
              className="inline-flex items-center gap-1 text-xs uppercase text-primary hover:text-yellow-500"
            >
              Acessar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          {canRequest && (
            <button
              type="button"
              disabled={requestingId === row.negocio_id}
              onClick={() => requestAccess(row)}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 px-3 py-1 text-xs uppercase text-primary hover:border-primary disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
              {requestingId === row.negocio_id ? 'Enviando' : 'Solicitar'}
            </button>
          )}
          {searchResult && !canRequest && !row.profissional_id && (
            <span className="max-w-[120px] text-right text-[11px] uppercase text-gray-600">
              Plano indisponível
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (title, rows, emptyText) => (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-normal uppercase tracking-wide text-gray-400">{title}</h2>
        <span className="text-xs text-gray-600">{rows.length}</span>
      </div>
      {rows.length ? (
        <div className="space-y-3">{rows.map((row) => renderBusinessRow(row))}</div>
      ) : (
        <div className="rounded-custom border border-gray-900 bg-dark-100/50 px-4 py-5 text-sm text-gray-600">
          {emptyText}
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-primary text-xl">CARREGANDO...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <img src="/Comvaga Logo.png" alt="COMVAGA" className="h-14 w-auto object-contain" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 text-gray-400 hover:border-primary hover:text-primary disabled:opacity-60"
              title="Atualizar"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => onLogout('/login/parceiro')}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 text-xs uppercase text-red-400 hover:border-red-500 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-normal uppercase tracking-wide">NEGÓCIOS PARCEIROS</h1>
          <p className="mt-2 text-sm font-normal uppercase text-gray-500">Selecione um negócio ativo ou solicite uma nova parceria</p>
        </div>

        <div className="mb-8 rounded-custom border border-gray-800 bg-dark-100 p-4">
          <form onSubmit={searchBusinesses} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              type="text"
              value={nomeSolicitacao}
              onChange={(e) => setNomeSolicitacao(e.target.value)}
              placeholder="SEU NOME PROFISSIONAL"
              className="h-11 rounded-button border border-gray-800 bg-black px-4 text-sm uppercase text-white outline-none focus:border-primary"
            />
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="PESQUISAR NEGÓCIO"
                className="h-11 w-full rounded-button border border-gray-800 bg-black pl-10 pr-4 text-sm uppercase text-white outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="h-11 rounded-button bg-primary px-5 text-sm font-normal uppercase text-black disabled:opacity-60"
            >
              {searching ? 'Buscando' : 'Buscar'}
            </button>
          </form>

          <div className="mt-4">
            <AlertBox alert={alert} />
          </div>

          {searchRows.length > 0 && (
            <div className="mt-4 space-y-3">
              <h2 className="text-sm font-normal uppercase tracking-wide text-gray-400">Resultados</h2>
              {searchRows.map((row) => renderBusinessRow(row, { searchResult: true }))}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {renderSection('Ativos', groups.ativos, 'Nenhum negócio ativo no momento.')}
          {renderSection('Aguardando', groups.aguardando, 'Nenhuma solicitação aguardando aval.')}
          {renderSection('Inativos', groups.inativos, 'Nenhum vínculo inativo.')}
          {renderSection('Excluídos', groups.excluidos, 'Nenhum vínculo excluído.')}
        </div>
      </div>
    </div>
  );
}
