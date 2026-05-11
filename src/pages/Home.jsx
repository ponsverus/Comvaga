import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import {
  ProtectionIcon,
  UserIcon,
  TimeIcon,
  TrendingUpIcon,
  CheckDoubleIcon,
  ZapIcon,
  SearchIcon
} from '../components/icons';

const SUPORTE_PHONE_E164 = '5533999037979';

const SUPORTE_MSG =
  'Olá, preciso de ajuda. Pode me orientar?';

const SUPORTE_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent(SUPORTE_MSG)}`;

const PLANO_ESSENCIAL_MSG =
  'Olá! Sou um profissional e tenho interesse em assinar o plano Essencial.';

const PLANO_PROFISSIONAL_MSG =
  'Olá! Sou um profissional e tenho interesse em assinar o plano Profissional.';

const PLANO_PREMIUM_MSG =
  'Olá! Sou um profissional e tenho interesse em assinar o plano Premium Real.';

const PLANO_ESSENCIAL_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent(PLANO_ESSENCIAL_MSG)}`;

const PLANO_PROFISSIONAL_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent(PLANO_PROFISSIONAL_MSG)}`;

const PLANO_PREMIUM_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent(PLANO_PREMIUM_MSG)}`;

function SearchBox({
  searchOpen,
  setSearchOpen,
  searchTerm,
  setSearchTerm,
  resultadosBusca,
  setResultadosBusca,
  buscando,
}) {
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handlePointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setSearchOpen(false);
        setSearchTerm('');
        setResultadosBusca([]);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () =>
      document.removeEventListener('mousedown', handlePointerDown);
  }, [
    searchOpen,
    setResultadosBusca,
    setSearchOpen,
    setSearchTerm,
  ]);

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={[
          'relative flex items-center overflow-hidden rounded-full bg-black/40 backdrop-blur-md transition-all duration-300 ease-out',
          searchOpen
            ? 'w-[min(24rem,calc(100vw-2rem))] border border-white/10 shadow-[0_0_0_1px_rgba(255,209,26,0.18)]'
            : 'w-11 border border-transparent bg-transparent backdrop-blur-0',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => {
            if (searchOpen && !searchTerm) {
              setSearchOpen(false);
              return;
            }

            setSearchOpen(true);
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-300 transition-colors hover:text-primary"
          aria-label="Pesquisar"
        >
          <SearchIcon
            strokeWidth={1.6}
            className="h-[18px] w-[18px]"
          />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="BUSQUE UM PROFISSIONAL OU NEGÓCIO :)"
          className={[
            'bg-transparent pr-4 text-sm text-white uppercase placeholder:text-gray-500 focus:outline-none transition-all duration-300',
            searchOpen
              ? 'w-full opacity-100'
              : 'w-0 opacity-0',
          ].join(' ')}
        />

        {buscando && searchTerm.trim().length >= 3 && (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 rounded-full border border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {searchOpen && resultadosBusca.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[3px] border border-white/10 bg-dark-100/95 shadow-2xl backdrop-blur-xl">
          {resultadosBusca.map((r, i) => (
            <Link
              key={`${r.tipo}-${r.id}-${i}`}
              to={`/v/${r.slug}`}
              onClick={() => {
                setSearchOpen(false);
                setSearchTerm('');
                setResultadosBusca([]);
              }}
              className="block border-b border-white/5 px-5 py-4 transition-colors hover:bg-dark-200/90 last:border-b-0"
            >
              <div className="font-normal text-white uppercase">
                {r.nome}
              </div>

              {r.subtitulo && (
                <div className="mt-1 text-sm text-gray-400">
                  {r.subtitulo}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {searchOpen &&
        !buscando &&
        searchTerm.trim().length >= 3 &&
        resultadosBusca.length === 0 && (
          <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[3px] border border-white/10 bg-dark-100/95 px-5 py-4 text-sm text-gray-400 shadow-2xl backdrop-blur-xl">
            :(
          </div>
        )}
    </div>
  );
}

function StarGlyph({ className = '' }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center text-[32px] font-normal leading-none text-primary ${className}`}
    >
      {'\u2606'}
    </span>
  );
}

export default function Home({
  user,
  userType,
  onLogout,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const { showMessage } = useFeedback();

  const isLogged = !!user && !!userType;

  useEffect(() => {
    let cancelled = false;

    const buscar = async () => {
      const term = String(searchTerm || '').trim();

      if (term.length < 3) {
        if (!cancelled) {
          setResultadosBusca([]);
          setBuscando(false);
        }

        return;
      }

      if (!cancelled) setBuscando(true);

      try {
        const { data, error } = await supabase.rpc(
          'search_home',
          {
            p_term: term,
            p_limit: 10,
          }
        );

        if (error) throw error;

        if (cancelled) return;

        setResultadosBusca(
          (data || []).filter((item) => item.slug)
        );
      } catch (error) {
        if (cancelled) return;

        console.error('Erro na busca:', error);

        showMessage('home.search_failed_support');

        setResultadosBusca([]);
      } finally {
        if (!cancelled) setBuscando(false);
      }
    };

    const timer = setTimeout(buscar, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      setBuscando(false);
    };
  }, [searchTerm, showMessage]);

  const handleLogoutClick = () => onLogout?.();

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* restante do arquivo permanece igual */}

      {/* ─── SEÇÃO DE PLANOS ─── */}
      <section className="py-24 px-4 bg-dark-100">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              PLANOS E <span className="text-primary">PREÇOS</span>
            </h2>

            <p className="text-xl text-gray-400">
              Simples assim: um único plano ativo com acesso completo
            </p>
          </div>

          <div
            className="
              flex gap-5 overflow-x-auto scroll-snap-x-mandatory
              sm:grid sm:grid-cols-3 sm:overflow-visible sm:items-start
              pb-4 sm:pb-0
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            "
          >

            {/* ── CARD 1 ── */}
            <div
              className="
                flex-shrink-0 w-[78vw] max-w-xs scroll-snap-align-center
                sm:w-auto sm:max-w-none sm:scroll-snap-align-none
                bg-dark-200 border border-gray-800 rounded-[3px]
                p-7 opacity-70
                flex flex-col
              "
            >
              <div className="mb-5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-500 border border-gray-700 rounded-full px-3 py-1 mb-4">
                  Essencial
                </span>

                <p className="text-2xl font-black text-white mb-1">
                  R$ 29
                  <span className="text-base font-normal text-gray-500">
                    ,99/mês
                  </span>
                </p>

                <p className="text-sm text-gray-500 leading-relaxed">
                  Para autônomos que estão começando a organizar sua agenda.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-5 flex flex-col gap-3">
                {[
                  'Agendamento assistido pelo profissional',
                  'Agenda individual (dias, horários e pausas)',
                  'Vitrine digital com galeria e serviços',
                  'Links para redes sociais',
                  'Área do cliente com histórico',
                  'Notificações por e-mail em tempo real',
                  'Lembrete automático 30 min antes',
                  'Integração com Google Agenda',
                  'Cobrança via Pix ou dinheiro (sem cartão)',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 shrink-0 mt-0.5"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="text-sm text-gray-500 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={PLANO_ESSENCIAL_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center px-5 py-3 rounded-full border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider hover:border-primary/40 hover:text-white transition-all"
              >
                QUERO O PLANO ESSENCIAL
              </a>
            </div>

            {/* ── CARD 2 ── */}
            <div
              className="
                flex-shrink-0 w-[78vw] max-w-xs scroll-snap-align-center
                sm:w-auto sm:max-w-none sm:scroll-snap-align-none
                bg-dark-200 border border-primary/60 rounded-[3px]
                p-7 relative flex flex-col
              "
            >
              <div className="mb-5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 rounded-full px-3 py-1 mb-4">
                  Profissional
                </span>

                <p className="text-2xl font-black text-white mb-1">
                  R$ 39
                  <span className="text-base font-normal text-gray-400">
                    ,99/mês
                  </span>
                </p>

                <p className="text-sm text-gray-400 leading-relaxed">
                  Gestão completa para negócios em crescimento, com métricas e equipe ilimitada.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-5 flex flex-col gap-3">
                {[
                  'Tudo do plano Essencial',
                  'Painel admin — gestão de múltiplos profissionais',
                  'Painel individual para cada profissional parceiro',
                  'Profissionais ilimitados (sem custo extra por membro)',
                  'Métricas do dia com comparativo do dia anterior',
                  'Utilização da agenda e receita futura projetada',
                  'Faturamento por data e por período',
                  'Taxa de fechamento de agendamentos por período',
                  'Criação de ofertas e promoções nos serviços',
                  'Avaliações independentes por profissional e por negócio',
                  'Reagendamento rápido pela área do cliente',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-primary shrink-0 mt-0.5"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="text-sm text-gray-300 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-[3px] px-4 py-3">
                <svg
                  className="w-4 h-4 text-primary shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5 8 2z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Inclui todos os benefícios do plano Premium Real
                </span>
              </div>

              <a
                href={PLANO_PROFISSIONAL_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-yellow-600 text-black font-black text-xs uppercase tracking-wide rounded-full hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all"
              >
                ASSINAR PLANO PROFISSIONAL
              </a>
            </div>

            {/* ── CARD 3 ── */}
            <div
              className="
                flex-shrink-0 w-[78vw] max-w-xs scroll-snap-align-center
                sm:w-auto sm:max-w-none sm:scroll-snap-align-none
                bg-dark-200 border border-gray-800 rounded-[3px]
                p-7 opacity-70
                flex flex-col
              "
            >
              <div className="mb-5">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-500 border border-gray-700 rounded-full px-3 py-1 mb-4">
                  Premium Real
                </span>

                <p className="text-2xl font-black text-white mb-1">
                  R$ 87
                  <span className="text-base font-normal text-gray-500">
                    ,39/mês
                  </span>
                </p>

                <p className="text-sm text-gray-500 leading-relaxed">
                  Versão com acesso total a todos os recursos avançados da plataforma.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-5 flex flex-col gap-3">
                {[
                  'Tudo do plano Profissional',
                  'Painel admin — gestão de múltiplos profissionais',
                  'Painel individual para cada profissional parceiro',
                  'Profissionais ilimitados',
                  'Métricas avançadas',
                  'Utilização da agenda e receita futura projetada',
                  'Faturamento completo por período',
                  'Taxa de fechamento de agendamentos',
                  'Promoções nos serviços',
                  'Avaliações independentes',
                  'Reagendamento rápido',
                  'Acesso antecipado a novos recursos',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 shrink-0 mt-0.5"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="text-sm text-gray-500 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={PLANO_PREMIUM_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center px-5 py-3 rounded-full border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider hover:border-primary/40 hover:text-white transition-all"
              >
                QUERO O PREMIUM REAL
              </a>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
