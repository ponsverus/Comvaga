import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import {
  CheckDoubleIcon,
  ZapIcon,
  SearchIcon,
  ProfessionalIcon,
  CheckIcon,
} from '../components/icons';
import { getSupportHref, getCustomPlanHref } from '../support';
import { saveSelectedPlanIntent } from '../utils/plans';
import { searchHome } from '../utils/searchHome';

const planSignupTo = (planCode) => `/cadastro/profissional?plano=${planCode}`;

function getBusinessLogoUrl(path) {
  if (!path) return null;

  try {
    if (/^https?:\/\//i.test(path)) return path;

    const stripped = path.replace(/^logos\//, '');
    const { data } = supabase.storage.from('logos').getPublicUrl(stripped);

    return data?.publicUrl || null;
  } catch {
    return null;
  }
}

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

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [searchOpen, setResultadosBusca, setSearchOpen, setSearchTerm]);

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
          <SearchIcon strokeWidth={1.6} className="h-[18px] w-[18px]" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="BUSQUE UM PROFISSIONAL OU NEGÓCIO :)"
          className={[
            'bg-transparent pr-4 text-sm uppercase text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300',
            searchOpen ? 'w-full opacity-100' : 'w-0 opacity-0',
          ].join(' ')}
        />

        {buscando && searchTerm.trim().length >= 3 && (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {searchOpen && resultadosBusca.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[3px] border border-white/10 bg-dark-100/95 shadow-2xl backdrop-blur-xl">
          {resultadosBusca.map((r, i) => {
            const isNegocio =
              String(r?.tipo || '').toLowerCase() === 'negocio';

            const businessLogoUrl = isNegocio
              ? getBusinessLogoUrl(r.logo_path)
              : null;

            return (
              <Link
                key={`${r.tipo}-${r.id}-${i}`}
                to={`/v/${r.slug}`}
                onClick={() => {
                  setSearchOpen(false);
                  setSearchTerm('');
                  setResultadosBusca([]);
                }}
                className="block border-b border-white/5 px-5 py-4 transition-colors last:border-b-0 hover:bg-dark-200/90"
              >
                {isNegocio ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-dark-200">
                      {businessLogoUrl ? (
                        <img
                          src={businessLogoUrl}
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-yellow-600">
                          <ProfessionalIcon className="h-5 w-5 text-black" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate uppercase text-white">
                        {r.nome}
                      </div>

                      {r.subtitulo && (
                        <div className="mt-1 truncate text-sm text-gray-400">
                          {r.subtitulo}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="uppercase text-white">{r.nome}</div>

                    {r.subtitulo && (
                      <div className="mt-1 text-sm text-gray-400">
                        {r.subtitulo}
                      </div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
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

function StarGlyph({
  className = '',
  sizeClass = 'h-8 w-8 text-[32px]',
}) {
  return (
    <span
      className={`inline-flex items-center justify-center font-normal leading-none text-primary ${sizeClass} ${className}`}
    >
      {'\u2606'}
    </span>
  );
}

function MoneyGlyph({
  className = '',
  sizeClass = 'h-8 w-8 text-[32px]',
}) {
  return (
    <span
      style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
      className={`inline-flex items-center justify-center font-normal leading-none text-primary ${sizeClass} ${className}`}
    >
      $
    </span>
  );
}

function SmileGlyph({
  className = '',
  sizeClass = 'h-8 w-8 text-[32px]',
}) {
  return (
    <span
      style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
      className={`inline-flex items-center justify-center font-normal leading-none text-primary ${sizeClass} ${className}`}
    >
      :)
    </span>
  );
}

function AgendaBlock({ occupied = false, highlighted = false }) {
  return (
    <div
      className={[
        'h-8 rounded-sm border transition-all',
        occupied
          ? 'border-primary/30 bg-primary/20'
          : highlighted
            ? 'border-primary bg-primary/10'
            : 'border-white/5 bg-white/[0.025]',
      ].join(' ')}
    />
  );
}

export default function Home({
  user,
  userType,
  professionalRole = null,
  onLogout,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const { showMessage } = useFeedback();

  const isLogged = !!user && !!userType;

  const isPartner =
    userType === 'professional' && professionalRole === 'partner';

  const loggedAreaLink =
    userType === 'professional'
      ? isPartner
        ? '/selecionar-negocio-parceiro'
        : '/dashboard'
      : '/minha-area';

  const loggedAreaLabel =
    userType === 'professional'
      ? isPartner
        ? 'SELECIONAR NEGÓCIO'
        : 'DASHBOARD'
      : 'MINHA ÁREA';

  const supportHref = getSupportHref(userType);

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

      if (!cancelled) {
        setBuscando(true);
      }

      try {
        const rows = await searchHome(term, { limit: 10 });

        if (cancelled) return;

        setResultadosBusca(rows);
      } catch (error) {
        if (cancelled) return;

        console.error('Erro na busca:', error);
        showMessage('home.search_failed_support');
        setResultadosBusca([]);
      } finally {
        if (!cancelled) {
          setBuscando(false);
        }
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* OFERTA */}

      <div className="relative z-50 flex h-10 w-full items-center overflow-hidden border-b border-yellow-300/50 bg-yellow-400">
        <div className="announcement-bar-wrapper flex">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="announcement-bar-track flex shrink-0 items-center whitespace-nowrap"
              aria-hidden={i === 2}
            >
              {[...Array(14)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <span className="mx-4 text-sm font-normal uppercase text-black">
                    TESTE 30 DIAS GRÁTIS
                  </span>

                  <span className="mx-4 text-black">●</span>

                  <span className="mx-4 text-sm font-normal uppercase text-black">
                    TESTE 30 DIAS GRÁTIS
                  </span>

                  <span className="mx-4 text-black">●</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <style>{`
          @keyframes announcement-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .announcement-bar-wrapper {
            display: flex;
            width: max-content;
            animation: announcement-scroll 50s linear infinite;
          }

          .announcement-bar-wrapper:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .announcement-bar-wrapper {
              animation: none;
            }
          }
        `}</style>
      </div>

      {/* HEADER */}

      <header className="absolute left-0 top-20 z-40 w-full border-none bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-center sm:h-20">
            <Link
              to="/"
              className="flex flex-col items-center justify-center gap-1"
            >
              <img
                src="/Comvaga Logo.png"
                alt="Comvaga"
                className="h-15 w-auto object-contain sm:h-17"
              />

              <span className="text-2xl font-black sm:text-3xl">
                COMVAGA
              </span>
            </Link>

            <div className="absolute right-0 top-[40%] -translate-y-1/2">
              <SearchBox
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                resultadosBusca={resultadosBusca}
                setResultadosBusca={setResultadosBusca}
                buscando={buscando}
              />
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:pt-40 lg:pt-48">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-yellow-600/10" />

        <div className="absolute right-10 top-20 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-button border border-primary/30 bg-primary/20 px-4 py-2 backdrop-blur-sm">
            <ZapIcon className="h-4 w-4 text-primary" />

            <span className="text-sm font-bold text-primary">
              O FIM DA AGENDA ESBURACADA
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-black leading-tight drop-shadow-lg sm:text-5xl md:text-7xl">
            SUA AGENDA,
            <br />

            <span className="bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
              MATEMATICAMENTE PERFEITA
            </span>
          </h1>

          <p className="mx-auto mb-5 max-w-3xl text-lg text-gray-300 drop-shadow-md md:text-xl">
            Menos espaços vazios. Mais atendimentos dentro do mesmo dia.
            A Comvaga organiza agenda, vitrine, equipe e clientes em uma
            única experiência.
          </p>

          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-500">
            O sistema considera o tempo real de cada trabalho, antecipa
            conflitos e reaproveita horários que seriam perdidos.
          </p>

          <div className="mb-5 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/cadastro"
              className="flex items-center justify-center gap-3 rounded-button bg-gradient-to-r from-primary to-yellow-600 px-10 py-5 text-lg font-black text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
            >
              COMEÇAR MEU TESTE GRÁTIS
              <ZapIcon className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => scrollTo('como-funciona')}
              className="rounded-button border border-white/20 bg-white/10 px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              VER COMO FUNCIONA
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest text-gray-600">
            30 dias grátis · sem compromisso
          </p>
        </div>
      </section>

      {/* PROVA VISUAL */}

      <section className="border-y border-gray-800 bg-dark-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:px-16 lg:px-24">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
              O problema que a Comvaga resolve
            </span>

            <h2 className="text-4xl font-black sm:text-5xl">
              SEU DIA NÃO PRECISA
              <br />
              <span className="text-primary">TER BURACOS.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
              A agenda não deveria apenas mostrar horários. Ela deveria
              ajudar você a aproveitar melhor o tempo que já tem.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-gray-800 bg-gray-800 md:grid-cols-2">
            <div className="bg-black p-6 sm:p-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-600">
                    Agenda tradicional
                  </span>

                  <h3 className="mt-2 text-2xl font-normal text-white">
                    HORÁRIOS VAZIOS
                  </h3>
                </div>

                <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-widest text-red-400">
                  perda
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <AgendaBlock occupied />
                <AgendaBlock />
                <AgendaBlock occupied />
                <AgendaBlock />
                <AgendaBlock occupied />
                <AgendaBlock />
                <AgendaBlock occupied />
                <AgendaBlock />
                <AgendaBlock occupied />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-gray-500">
                O horário está livre, mas simplesmente fica esperando alguém
                aparecer.
              </p>
            </div>

            <div className="bg-dark-200 p-6 sm:p-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-primary">
                    Comvaga
                  </span>

                  <h3 className="mt-2 text-2xl font-normal text-white">
                    AGENDA COMPACTADA
                  </h3>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
                  otimização
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <AgendaBlock occupied />
                <AgendaBlock highlighted />
                <AgendaBlock occupied />
                <AgendaBlock highlighted />
                <AgendaBlock occupied />
                <AgendaBlock highlighted />
                <AgendaBlock occupied />
                <AgendaBlock highlighted />
                <AgendaBlock occupied />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-gray-400">
                Novos atendimentos são direcionados para os espaços que
                ajudam a compactar o dia e reduzir intervalos.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => scrollTo('planos')}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary transition-colors hover:text-white"
            >
              Quero aproveitar melhor minha agenda
              <ZapIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}

      <section id="como-funciona" className="w-full bg-dark-100 py-0">
        <div className="mx-auto mb-16 max-w-7xl px-4 pt-24 text-center">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-widest text-primary">
            Como isso acontece
          </span>

          <h2 className="mb-4 text-4xl font-black sm:text-5xl">
            A CIÊNCIA <span className="text-primary">POR TRÁS</span>
          </h2>

          <p className="text-lg text-gray-400 sm:text-xl">
            Três decisões simples fazem a agenda trabalhar melhor.
          </p>
        </div>

        <div className="grid w-full gap-px border-y border-gray-800 bg-gray-800 md:grid-cols-3">
          {[
            {
              num: 1,
              title: 'ROTINA REAL',
              text: 'Cada profissional trabalha com seus próprios dias, horários e pausas. A agenda respeita a rotina individual antes de oferecer qualquer horário ao cliente.',
            },
            {
              num: 2,
              title: 'ENCAIXE INTELIGENTE',
              text: 'Novos eventos fazem o sistema recalcular a disponibilidade. Cancelamentos, trocas e novas reservas são considerados imediatamente.',
            },
            {
              num: 3,
              title: 'ACESSO SIMPLIFICADO',
              text: 'Seu cliente recebe um link exclusivo, encontra os horários realmente disponíveis e agenda sem precisar baixar aplicativo.',
            },
          ].map(({ num, title, text }) => (
            <div
              key={num}
              className="flex flex-col bg-dark-100 p-8 px-4 sm:px-8 md:p-12 md:px-16 lg:px-24"
            >
              <div className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-yellow-600 text-2xl font-black text-black shadow-lg shadow-primary/50">
                {num}
              </div>

              <h3 className="mb-3 text-2xl font-normal text-white">
                {title}
              </h3>

              <p className="leading-relaxed text-gray-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-px border-b border-gray-800 bg-gray-800">
          {[
            {
              title: 'REAPROVEITAMENTO AUTOMÁTICO DE HORÁRIOS',
              lead: 'Cancelou?',
              text: 'O horário não precisa ficar parado. A Comvaga recalcula a janela disponível e transforma o espaço liberado em novas oportunidades de atendimento.',
            },
            {
              title: 'ZONA DE CALOR: AGENDA SEM BURACOS',
              lead: 'O horário mais inteligente nem sempre é o primeiro horário livre.',
              text: 'O sistema identifica espaços próximos dos atendimentos já confirmados e prioriza esses encaixes, ajudando a compactar o dia e reduzir intervalos.',
            },
            {
              title: 'AGENDAMENTO MÚLTIPLO SEQUENCIAL',
              lead: 'O cliente pode resolver mais de uma coisa de uma vez.',
              text: 'O sistema calcula a duração dos trabalhos, considera as margens operacionais e verifica se tudo cabe no turno antes de confirmar a reserva.',
            },
          ].map(({ title, lead, text }) => (
            <div
              key={title}
              className="bg-dark-100 p-8 transition-colors hover:bg-dark-200/50 sm:p-12 md:px-16 lg:px-24"
            >
              <div className="flex flex-col items-start gap-6 md:flex-row">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <ZapIcon className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <h3 className="mb-3 text-2xl font-normal text-white">
                    {title}
                  </h3>

                  <p className="leading-relaxed text-gray-300">
                    <span className="text-primary">{lead}</span>{' '}
                    {text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VITRINE */}

      <section className="border-b border-gray-800 bg-black py-0">
        <div className="w-full overflow-hidden bg-dark-200">
          <div className="bg-gray-800">
            <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-8 sm:py-20 md:px-16 lg:px-24">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>

                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  VEJA AO VIVO
                </span>
              </div>

              <h2 className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                NÃO APENAS UMA AGENDA,
                <br />
                <span className="text-primary">
                  UMA VITRINE PROFISSIONAL.
                </span>
              </h2>

              <p className="mb-10 max-w-3xl text-lg leading-relaxed text-gray-400">
                Seu cliente não precisa começar uma conversa no WhatsApp
                para descobrir quem você é, o que oferece ou quando pode
                atender. Ele pode conhecer seu trabalho e agendar no mesmo
                lugar.
              </p>

              <a
                href="https://comvaga.com.br/v/vikings"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center gap-3 rounded-button bg-primary px-8 py-4 font-black text-black transition-all hover:shadow-[0_0_30px_rgba(255,209,26,0.3)]"
              >
                VER VITRINE EXEMPLO
                <ZapIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}

      <section className="w-full bg-dark-200 py-0">
        <div className="mx-auto mb-16 max-w-7xl px-4 pt-24 text-center">
          <span className="mb-4 inline-block text-[10px] uppercase tracking-widest text-primary">
            O resultado na prática
          </span>

          <h2 className="mb-4 text-4xl font-black sm:text-5xl">
            VANTAGEM <span className="text-primary">MÚTUA</span>
          </h2>

          <p className="text-lg text-gray-400 sm:text-xl">
            Mais eficiência para quem trabalha. Mais facilidade para quem
            agenda.
          </p>
        </div>

        <div className="grid w-full gap-px border-y border-gray-800 bg-gray-800 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: StarGlyph,
              title: 'VITRINE PROFISSIONAL',
              text: 'Um link profissional para apresentar seu negócio, seus trabalhos, sua equipe e seus horários.',
            },
            {
              icon: ZapIcon,
              title: 'AGENDA INTELIGENTE',
              text: 'Os horários exibidos já consideram a realidade da agenda e os próximos atendimentos.',
            },
            {
              icon: ZapIcon,
              title: 'RESGATE IMEDIATO',
              text: 'Cancelamentos deixam de ser simplesmente um horário perdido. O espaço volta para a vitrine.',
            },
            {
              icon: MoneyGlyph,
              title: 'MAIS APROVEITAMENTO',
              text: 'A agenda trabalha para reduzir tempo ocioso e aproveitar melhor a capacidade disponível.',
            },
            {
              icon: SmileGlyph,
              title: 'CLIENTE SATISFEITO',
              text: 'O cliente escolhe um horário que realmente cabe no dia do profissional, reduzindo conflitos.',
            },
            {
              icon: CheckDoubleIcon,
              title: 'FLUXO COMPLETO',
              text: 'Da descoberta ao agendamento e ao pós-atendimento, profissional e cliente continuam no mesmo sistema.',
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div
              key={i}
              className="flex flex-col bg-dark-200 p-8 px-4 transition-colors hover:bg-dark-100 sm:p-10 sm:px-8 md:px-16 lg:px-24"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="mb-3 text-2xl font-normal text-white">
                {title}
              </h3>

              <p className="leading-relaxed text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}

      <section id="planos" className="w-full bg-dark-100 py-0">
        <div className="mx-auto mb-16 max-w-7xl px-4 pt-24 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
            30 dias grátis
          </span>

          <h2 className="mb-4 text-4xl font-black sm:text-5xl">
            ESCOLHA O TAMANHO
            <br />
            <span className="text-primary">DA SUA EQUIPE.</span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
            Todos os planos usam a mesma inteligência. Você escolhe apenas
            a capacidade que precisa.
          </p>
        </div>

        <div className="flex w-full snap-x snap-mandatory gap-px overflow-x-auto border-y border-gray-800 bg-gray-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:snap-none">
          {/* RECURSOS */}

          <div className="w-[85vw] shrink-0 snap-start bg-dark-100 px-4 py-12 sm:px-8 md:w-auto md:px-12 md:py-16 lg:px-16">
            <span className="mb-4 inline-block rounded-full bg-gray-800 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-400">
              Todos os planos incluem
            </span>

            <h3 className="mb-2 text-3xl font-black text-white md:text-4xl">
              TODOS OS RECURSOS
            </h3>

            <p className="mb-8 text-gray-400">
              A mesma inteligência em todos os planos. Nenhum recurso
              essencial fica escondido atrás de um preço maior.
            </p>

            <div className="flex flex-col gap-5">
              {[
                {
                  title: 'Reabertura automática de horários cancelados na agenda',
                  text: 'Horários liberados por cancelamentos voltam automaticamente à disponibilidade.',
                },
                {
                  title: 'Reserva em lote de múltiplos trabalhos',
                  text: 'Vários atendimentos podem ser organizados em sequência dentro do mesmo período.',
                },
                {
                  title: 'Direcionamento inteligente de novos agendamentos',
                  text: 'Novas reservas seguem para zonas de calor e ajudam a compactar a agenda.',
                },
                {
                  title: 'Comprometimento da agenda e receita futura projetada',
                  text: 'Acompanhe o preenchimento da agenda e a receita já projetada.',
                },
                {
                  title: 'Agendamento assistido pelo profissional',
                  text: 'Registre um agendamento pela agenda quando o cliente precisar de ajuda.',
                },
                {
                  title: 'Reagendamento inteligente pela área exclusiva do cliente',
                  text: 'O cliente escolhe um novo horário sem repetir todo o processo.',
                },
                {
                  title: 'Alertas por e-mail em tempo real',
                  text: 'Você e seu cliente recebem avisos sobre novos agendamentos e cancelamentos.',
                },
                {
                  title: 'Lembrete automático + WhatsApp',
                  text: 'O sistema lembra o cliente e você pode complementar pelo WhatsApp.',
                },
                {
                  title: 'Sincronia com o Google Agenda',
                  text: 'O cliente pode manter o compromisso sincronizado com seu calendário.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-2.5"
                >
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-medium leading-snug text-gray-200">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-sm leading-snug text-gray-500">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PLANOS */}

          <div className="w-[85vw] shrink-0 snap-start bg-dark-200 md:w-auto">
            <div className="px-4 pb-6 pt-12 sm:px-8 md:px-12 md:pt-16 lg:px-16">
              <span className="mb-4 inline-block rounded-full bg-primary/15 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
                Escolha a capacidade
              </span>

              <h3 className="mb-2 text-3xl font-black text-white md:text-4xl">
                QUANTOS PROFISSIONAIS?
              </h3>

              <p className="text-gray-400">
                Comece sozinho ou coloque toda a equipe dentro da mesma
                operação.
              </p>
            </div>

            {/* ESSENCIAL */}

            <div className="flex flex-col gap-6 divide-y divide-gray-800 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Essencial
                  </span>
                </div>

                <p className="mb-2 text-lg font-normal uppercase text-primary md:text-xl">
                  1 profissional
                </p>

                <span className="text-xl font-normal text-white">
                  R$ 69,99
                  <span className="text-sm text-gray-500">/mês</span>
                </span>
              </div>

              <Link
                to={planSignupTo('essencial')}
                onClick={() => saveSelectedPlanIntent('essencial')}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-white transition-all hover:bg-white/20"
              >
                Testar Essencial
                <ZapIcon className="h-3.5 w-3.5 text-primary" />
              </Link>
            </div>

            {/* PROFISSIONAL */}

            <div className="relative flex flex-col gap-6 border-y border-primary/20 bg-primary/5 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
              <div className="absolute right-4 top-4 rounded-full bg-green-400 px-2.5 py-0.5 text-[9px] font-normal uppercase tracking-widest text-white sm:right-8 md:right-12">
                MELHOR OFERTA
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-primary">
                    Profissional
                  </span>
                </div>

                <p className="mb-2 text-lg font-normal uppercase text-primary md:text-xl">
                  Até 3 profissionais
                </p>

                <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="text-base font-normal text-red-500 line-through decoration-red-500 decoration-2">
                    R$ 99,99
                  </span>

                  <span className="text-xl font-normal text-green-400">
                    R$ 69,99
                    <span className="text-sm text-gray-500">/mês</span>
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Mais capacidade pelo mesmo valor promocional.
                </p>
              </div>

              <Link
                to={planSignupTo('profissional')}
                onClick={() => saveSelectedPlanIntent('profissional')}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-yellow-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Testar Profissional
                <ZapIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* PREMIUM */}

            <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    Premium
                  </span>
                </div>

                <p className="mb-2 text-lg font-normal uppercase text-primary md:text-xl">
                  Até 9 profissionais
                </p>

                <span className="text-xl font-normal text-white">
                  R$ 129,99
                  <span className="text-sm text-gray-500">/mês</span>
                </span>
              </div>

              <Link
                to={planSignupTo('premium')}
                onClick={() => saveSelectedPlanIntent('premium')}
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-white transition-all hover:bg-white/20"
              >
                Testar Premium
                <ZapIcon className="h-3.5 w-3.5 text-primary" />
              </Link>
            </div>

            {/* PERSONALIZADO */}

            <div className="flex flex-col items-start justify-center gap-3 bg-primary/5 px-4 py-10 text-left sm:px-8 md:px-12 lg:px-16">
              <span className="text-[10px] uppercase tracking-widest text-primary">
                Personalizado
              </span>

              <p className="text-xl font-normal text-white md:text-2xl">
                Passou de 9 profissionais?
              </p>

              <p className="max-w-sm text-sm text-gray-400">
                Monte um plano sob medida para a estrutura do seu negócio.
              </p>

              <a
                href={getCustomPlanHref()}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-yellow-600 px-5 py-2.5 text-xs font-normal uppercase tracking-wider text-black transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Falar com suporte
                <ZapIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-sm text-gray-500">
            Todos os planos começam com 30 dias grátis. Você pode escolher
            a capacidade que faz sentido para sua operação.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}

      <section className="bg-gradient-to-r from-primary via-yellow-500 to-yellow-600 px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-block rounded-full bg-black/10 px-3 py-1 text-[10px] uppercase tracking-widest text-black/60">
            Sua próxima agenda começa aqui
          </span>

          <h2 className="mb-6 text-4xl font-black text-black sm:text-5xl">
            PARE DE ADMINISTRAR
            <br />
            HORÁRIOS VAZIOS.
          </h2>

          <p className="mb-8 text-xl text-black/80 sm:text-2xl">
            Uma vitrine para vender, um painel para operar e uma agenda que
            pensa antes de confirmar.
          </p>

          <Link
            to="/cadastro"
            className="inline-flex items-center gap-3 rounded-button bg-black px-10 py-5 text-lg font-black text-primary transition-all hover:scale-105 hover:shadow-2xl"
          >
            COMEÇAR MEU TESTE GRÁTIS
            <ZapIcon className="h-5 w-5" />
          </Link>

          <p className="mt-6 text-sm text-black/60">
            30 dias grátis · sem compromisso
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-black px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col justify-start">
              <Link
                to="/"
                className="inline-block transition-opacity hover:opacity-75"
              >
                <img
                  src="/Comvaga Logo.png"
                  alt="Comvaga"
                  className="h-16 w-auto object-contain"
                />
              </Link>

              <p className="mt-3 text-xs uppercase leading-relaxed text-gray-600">
                Sua agenda,
                <br />
                matematicamente perfeita.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-normal text-white">PARA VOCÊ</h3>

              <ul className="space-y-2">
                {isLogged ? (
                  <>
                    <li>
                      <Link
                        to={loggedAreaLink}
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        {loggedAreaLabel}
                      </Link>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        SAIR
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        LOGIN
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/cadastro"
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        CADASTRAR GRÁTIS
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/login/parceiro"
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        LOGIN PARCEIRO
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/cadastro/parceiro"
                        className="text-sm text-gray-500 transition-colors hover:text-primary"
                      >
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <a
                    href={supportHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-500 transition-colors hover:text-primary"
                  >
                    SUPORTE
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-normal text-white">EMPRESA</h3>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/sobre"
                    className="text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    SOBRE
                  </Link>
                </li>

                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    BLOG
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-normal text-white">LEGAL</h3>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacidade"
                    className="text-sm text-gray-500 transition-colors hover:text-primary"
                  >
                    PRIVACIDADE
                  </Link>
                </li>

                <li>
                  <Link
                    to="/termos"
                    className="text-sm text-gray-500 transition-colors hover:text-primary"
                  >
                    TERMOS
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-sm text-gray-600">
              © 2026 COMVAGA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
