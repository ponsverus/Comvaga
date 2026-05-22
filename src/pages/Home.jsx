import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import { UserIcon, TimeIcon, TrendingUpIcon, CheckDoubleIcon, ZapIcon, SearchIcon, SelectIcon, CalendarIcon, CheckedIcon } from '../components/icons';

const SUPORTE_PHONE_E164 = '5533999037979';
const SUPORTE_MSG = 'Olá, preciso de ajuda. Pode me orientar?';
const SUPORTE_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent(SUPORTE_MSG)}`;

const WHATSAPP_ESSENCIAL_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent('Olá! Sou um profissional e tenho interesse em assinar o plano Essencial por R$ 29,99/mês. Pode me orientar?')}`;

const WHATSAPP_PREMIUM_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent('Olá! Sou um profissional e tenho interesse em assinar o plano Premium Real por R$ 87,39/mês. Pode me orientar?')}`;

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
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [searchOpen, setResultadosBusca, setSearchOpen, setSearchTerm]);

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={[
          'relative flex items-center overflow-hidden transition-all duration-300 ease-out',
          searchOpen
            ? 'w-[min(24rem,calc(100vw-2rem))] border border-primary/40 bg-black shadow-[0_0_0_1px_rgba(255,209,26,0.12)] rounded-none'
            : 'w-11 border border-transparent bg-transparent rounded-none',
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
          className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-primary"
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
            'bg-transparent pr-4 text-xs text-white uppercase placeholder:text-gray-600 focus:outline-none transition-all duration-300 tracking-widest',
            searchOpen ? 'w-full opacity-100' : 'w-0 opacity-0',
          ].join(' ')}
        />

        {buscando && searchTerm.trim().length >= 3 && (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 rounded-full border border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {searchOpen && resultadosBusca.length > 0 && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden border border-primary/20 bg-black shadow-[0_8px_40px_rgba(0,0,0,0.9)] border-t-2 border-t-primary">
          {resultadosBusca.map((r, i) => (
            <Link
              key={`${r.tipo}-${r.id}-${i}`}
              to={`/v/${r.slug}`}
              onClick={() => {
                setSearchOpen(false);
                setSearchTerm('');
                setResultadosBusca([]);
              }}
              className="block border-b border-white/5 px-5 py-4 transition-colors hover:bg-primary/10 last:border-b-0"
            >
              <div className="font-bold text-white uppercase tracking-wide text-sm">{r.nome}</div>
              {r.subtitulo && (
                <div className="mt-1 text-xs text-gray-500 uppercase tracking-widest">{r.subtitulo}</div>
              )}
            </Link>
          ))}
        </div>
      )}

      {searchOpen && !buscando && searchTerm.trim().length >= 3 && resultadosBusca.length === 0 && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] border border-primary/20 bg-black px-5 py-4 text-sm text-gray-500 shadow-[0_8px_40px_rgba(0,0,0,0.9)] border-t-2 border-t-primary">
          :(
        </div>
      )}
    </div>
  );
}

function StarGlyph({ className = '', sizeClass = 'h-8 w-8 text-[32px]' }) {
  return (
    <span className={`inline-flex items-center justify-center font-normal leading-none text-primary ${sizeClass} ${className}`}>
      {'\u2606'}
    </span>
  );
}

function PreviewHeartIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PreviewInstagramIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16.5 7.5h.01" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function PreviewFacebookIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}


export default function Home({ user, userType, onLogout }) {
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
        const { data, error } = await supabase.rpc('search_home', {
          p_term: term,
          p_limit: 10,
        });

        if (error) throw error;
        if (cancelled) return;

        setResultadosBusca((data || []).filter((item) => item.slug));
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
      <style>{`
        @keyframes announcement-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .announcement-bar-wrapper {
          display: flex;
          width: max-content;
          animation: announcement-scroll 40s linear infinite;
        }
        .announcement-bar-wrapper:hover { animation-play-state: paused; }
        .announcement-bar-track a {
          position: relative;
          z-index: 10;
          cursor: pointer;
          display: inline-block;
        }
        @media (prefers-reduced-motion: reduce) {
          .announcement-bar-wrapper { animation: none; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,209,26,0); }
          50% { box-shadow: 0 0 32px 4px rgba(255,209,26,0.18); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(255,209,26,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,209,26,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 8s linear infinite;
        }
        .fade-up-1 { animation: fadeSlideUp 0.7s ease both; }
        .fade-up-2 { animation: fadeSlideUp 0.7s 0.12s ease both; }
        .fade-up-3 { animation: fadeSlideUp 0.7s 0.24s ease both; }
        .fade-up-4 { animation: fadeSlideUp 0.7s 0.36s ease both; }
        .fade-up-5 { animation: fadeSlideUp 0.7s 0.48s ease both; }
        .cta-pulse { animation: pulseGlow 2.4s ease-in-out infinite; }
        .diagonal-cut {
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
        }
        .diagonal-cut-bottom {
          clip-path: polygon(0 6%, 100% 0, 100% 100%, 0 100%);
        }
        .feature-card:hover .feature-num {
          color: rgba(255,209,26,0.14);
          transform: scale(1.08);
        }
        .feature-num {
          transition: color 0.3s, transform 0.3s;
        }
        .plan-card-featured {
          background: linear-gradient(145deg, rgba(255,209,26,0.07) 0%, rgba(0,0,0,0) 60%);
        }
        .slash-divider::before {
          content: '';
          display: block;
          width: 3px;
          height: 100%;
          background: #FFD11A;
          position: absolute;
          left: 0;
          top: 0;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
        }
      `}</style>

      <div className="relative z-50 w-full bg-primary overflow-hidden h-9 flex items-center">
        <div className="announcement-bar-wrapper flex">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="announcement-bar-track flex items-center shrink-0 whitespace-nowrap"
              aria-hidden={i === 2}
            >
              {[...Array(14)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-black font-black text-[11px] uppercase tracking-widest mx-5">CLIQUE PARA IR</span>
                  <span className="text-black/40 mx-4 text-[8px]">◆</span>
                  <a
                    href={SUPORTE_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black font-black text-[11px] uppercase tracking-widest hover:underline underline-offset-4 transition-all mx-5"
                  >
                    SUPORTE
                  </a>
                  <span className="text-black/40 mx-4 text-[8px]">◆</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="absolute top-9 left-0 w-full z-40 bg-transparent border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-center h-16 sm:h-20">
            <Link to="/" className="flex flex-col items-center justify-center gap-0.5">
              <img
                src="/Comvaga Logo.png"
                alt="Comvaga"
                className="h-15 w-auto object-contain sm:h-17"
              />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">COMVAGA</h1>
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

      <section className="relative pt-36 pb-0 sm:pt-44 lg:pt-52 overflow-hidden diagonal-cut bg-black">
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <div className="absolute top-1/3 -left-32 w-[520px] h-[520px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[340px] h-[340px] rounded-full bg-yellow-600/8 blur-[80px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center pb-28 sm:pb-36">
          <div className="fade-up-1 inline-flex items-center gap-2.5 px-4 py-1.5 border border-primary/50 bg-primary/8 mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-primary font-black text-[10px] tracking-[0.25em] uppercase">O FIM DA AGENDA ESBURACADA</span>
          </div>

          <h1 className="fade-up-2 text-[clamp(2.6rem,8vw,6.5rem)] font-black mb-5 leading-[0.92] tracking-tight uppercase">
            SUA AGENDA,<br />
            <span className="text-primary relative inline-block">
              MATEMATICAMENTE
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary/30" />
            </span>
            {' '}PERFEITA
          </h1>

          <p className="fade-up-3 text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Comvaga organiza agenda, vitrine, equipe e cliente em uma experiência só. O sistema <span className="text-primary font-black">ANTECIPA CONFLITOS</span>, respeita o tempo real de cada trabalho e transforma horários livres em oportunidades reais de atendimento.
          </p>

          <div className="fade-up-4 flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              to="/cadastro"
              className="cta-pulse px-10 py-4 bg-primary text-black font-black text-base uppercase tracking-widest hover:bg-yellow-300 transition-all flex items-center justify-center gap-3"
            >
              MAXIMIZAR MEUS GANHOS <ZapIcon className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 border border-white/20 text-white font-bold text-base uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
            >
              ENTENDER A LÓGICA
            </button>
          </div>

          <div className="fade-up-5 grid grid-cols-2 gap-4 max-w-xl mx-auto">
            {[
              { val: '100%', label: 'Aproveitamento de Tempo' },
              { val: '0%', label: 'Conflito de Horários' },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative border border-gray-800 hover:border-primary/60 transition-all p-5 bg-black/60 group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[2.6rem] font-black text-primary leading-none mb-1">{stat.val}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-24 px-4 bg-[#080808] diagonal-cut-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-3">
              <span className="block w-8 h-[2px] bg-primary" />
              <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase">O SISTEMA</span>
            </div>
            <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-black leading-tight uppercase">
              A CIÊNCIA <span className="text-primary">POR TRÁS</span>
            </h2>
            <p className="text-gray-500 mt-3 text-base max-w-lg">Como o sistema protege seu faturamento e respeita o cliente</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { num: '01', title: 'ROTINA REAL', text: 'Cada profissional trabalha com seus próprios dias, horários e pausas. A agenda se adapta à rotina individual de cada um, permitindo fluxos de trabalho independentes.' },
              { num: '02', title: 'ENCAIXE AUTOMÁTICO', text: 'O algoritmo recalcula sua agenda a cada mudança: novos horários marcados, desistências ou trocas. Tudo se reorganiza no ato para manter seu trabalho com o máximo de eficiência.' },
              { num: '03', title: 'ACESSO SIMPLIFICADO', text: 'Seu cliente recebe um link exclusivo. Ele visualiza apenas os horários livres reais, sem precisar baixar nada.' },
            ].map(({ num, title, text }) => (
              <div
                key={num}
                className="feature-card relative border border-gray-800 p-7 hover:border-primary/40 transition-all group overflow-hidden bg-black"
              >
                <div className="feature-num absolute top-4 right-5 text-[5rem] font-black text-white/3 leading-none select-none">{num}</div>
                <div className="absolute top-0 left-0 w-[2px] h-0 bg-primary group-hover:h-full transition-all duration-500" />
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-primary tracking-[0.25em] mb-4 uppercase">{num}</div>
                  <h3 className="text-xl font-black mb-3 text-white uppercase tracking-tight">{title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'REAPROVEITAMENTO INTELIGENTE E AUTOMÁTICO DE HORÁRIOS',
                accent: 'CANCELOU?',
                text: 'O sistema reage em milissegundos, recalculando toda a janela disponível por meio de particionamento dinâmico e controle de concorrência, a mesma lógica de integridade de bancos de dados relacionais de alta performance. O horário vago é redistribuído imediatamente na vitrine como novas oportunidades: assim, a vaga original de 60 minutos pode ser reservada inteira ou, de forma inteligente, se transformar em três horários de 20 minutos ou dois de 30 minutos. Os clientes visualizam essas oportunidades identificadas com um ícone discreto, garantindo total transparência.',
              },
              {
                title: 'ZONA DE CALOR: AGENDA SEM BURACOS',
                accent: 'A MAIORIA DOS SISTEMAS EXIBE TODOS OS HORÁRIOS LIVRES.',
                text: 'A Comvaga vai além. No modo inteligente, o algoritmo identifica e prioriza os slots que encostam diretamente em agendamentos já confirmados, as chamadas zonas de calor. Ao invés de distribuir clientes aleatoriamente pela agenda, o sistema empurra os novos atendimentos para as bordas dos blocos já ocupados, compactando o dia e eliminando os intervalos vazios que consomem tempo e reduzem o faturamento.',
              },
              {
                title: 'AGENDAMENTO MÚLTIPLO SEQUENCIAL',
                accent: 'O CLIENTE SELECIONA MAIS DE UM TRABALHO.',
                text: 'O motor calcula o tempo acumulado de cada um, adiciona a margem operacional entre atendimentos e verifica se o bloco inteiro cabe no turno do profissional, antes de confirmar qualquer coisa. Se couber, o sistema grava todos os trabalhos em sequência, sem conflitos, sem brechas. O profissional recebe um único bloco contínuo. O cliente sai com tudo resolvido em uma única reserva.',
              },
            ].map(({ title, accent, text }, i) => (
              <div
                key={i}
                className="slash-divider relative border border-gray-800 hover:border-primary/30 transition-all p-7 pl-9 bg-black group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/50 group-hover:bg-primary transition-colors duration-300" />
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <ZapIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-black mb-2 text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                      <span className="text-primary font-black">{accent}</span> {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative border border-gray-800 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-yellow-400 to-transparent" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/4 to-transparent pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-0 items-center">
              <div className="relative z-10 p-8 sm:p-14 border-b lg:border-b-0 lg:border-r border-gray-800/60">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/6 mb-6">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">VEJA AO VIVO</span>
                </div>

                <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-black text-white mb-5 leading-tight uppercase">
                  NÃO APENAS UMA AGENDA,{' '}
                  <span className="text-primary">UMA VITRINE PROFISSIONAL.</span>
                </h2>

                <p className="text-sm text-gray-500 mb-10 leading-relaxed max-w-xl">
                  Seu negócio merece mais do que um link cinza. Veja como seus clientes enxergam seus trabalhos, depoimentos, equipe e horários em uma interface projetada para converter curiosos em agendamentos confirmados.
                </p>

                <a
                  href="https://comvaga.com.br/v/vikings"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm hover:bg-yellow-300 transition-all group"
                >
                  VER VITRINE EXEMPLO
                  <ZapIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <div className="relative z-10 p-8 sm:p-14 flex items-center justify-center">
                <div className="relative bg-[#0a0a0a] border border-gray-700 overflow-hidden shadow-2xl w-full max-w-[360px] hover:-translate-y-1 transition-transform duration-500">
                  <div className="h-24 bg-gradient-to-br from-primary/25 to-yellow-600/35 relative">
                    <div className="absolute -bottom-9 left-5 w-18 h-18 bg-[#0a0a0a] border-2 border-[#0a0a0a] overflow-hidden shadow-xl" style={{width:72,height:72}}>
                      <div className="w-full h-full bg-gray-900 border border-gray-700 flex items-center justify-center font-black text-primary text-2xl">V</div>
                    </div>
                  </div>

                  <div className="pt-12 pb-6 px-5">
                    <div className="mb-5">
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-black text-white uppercase tracking-wider">VIKINGS</div>
                        <CheckedIcon className="w-[13px] h-[13px] text-primary shrink-0" />
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <StarGlyph sizeClass="h-3 w-3 text-[12px]" /> 4.9
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-6 h-6 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
                          <PreviewInstagramIcon />
                        </div>
                        <div className="w-6 h-6 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
                          <PreviewFacebookIcon />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-[0.25em] mb-2">SERVIÇOS DISPONÍVEIS</div>

                      {[
                        { n: 'CORTE', p: 'R$ 45,00', d: '30 min' },
                        { n: 'BARBA TERAPIA', p: 'R$ 35,00', d: '20 min' }
                      ].map((s, idx) => (
                        <div key={idx} className="border border-white/8 p-3.5 hover:border-primary/20 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-xs font-black text-white uppercase tracking-wide">{s.n}</div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <TimeIcon className="w-2.5 h-2.5 text-gray-600" />
                                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{s.d}</span>
                              </div>
                            </div>
                            <div className="text-primary font-black text-sm">{s.p}</div>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex-1 h-7 border border-white/10 flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer">
                              <CalendarIcon className="w-3 h-3 text-white/30" />
                              <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Agendar</span>
                            </div>
                            <div className="flex-1 h-7 bg-primary/8 border border-primary/25 flex items-center justify-center gap-1.5 hover:bg-primary/15 transition-colors cursor-pointer">
                              <SelectIcon className="w-3 h-3 text-white/30" />
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest">Selecionar</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-20 bg-gray-900/60 border border-dashed border-white/8 flex items-center justify-center relative group overflow-hidden">
                      <div className="text-white/15 font-black text-[9px] uppercase tracking-widest group-hover:text-primary/30 transition-colors">GALERIA DE TRABALHOS</div>
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <div className="w-1.5 h-1.5 bg-primary/40" />
                        <div className="w-1.5 h-1.5 bg-white/10" />
                        <div className="w-1.5 h-1.5 bg-white/10" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <div className="w-7 h-7 bg-black/60 backdrop-blur-md flex items-center justify-center text-primary border border-primary/20">
                      <StarGlyph sizeClass="h-3 w-3 text-[14px]" />
                    </div>
                    <div className="w-7 h-7 bg-black/60 backdrop-blur-md flex items-center justify-center text-white/30 border border-white/10">
                      <PreviewHeartIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#060606] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-3">
              <span className="block w-8 h-[2px] bg-primary" />
              <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase">BENEFÍCIOS</span>
            </div>
            <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-black leading-tight uppercase">
              VANTAGEM <span className="text-primary">MÚTUA</span>
            </h2>
            <p className="text-gray-500 mt-3 text-base">Por que Profissionais e Clientes preferem Comvaga</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: TrendingUpIcon, title: 'LUCRO BLINDADO', text: 'Eliminamos o tempo ocioso. A agenda se ajusta sozinha para caber o máximo de clientes sem sobrecarga.' },
              { icon: UserIcon, title: 'CLIENTE SATISFEITO', text: 'Para quem agenda: a certeza de ser atendido na hora. Nosso sistema impede que o profissional atrase por erro de cálculo.' },
              { icon: ZapIcon, title: 'AGENDA INTELIGENTE', text: 'Cada horário exibido já considera os próximos encaixes da agenda, evitando conflitos antes mesmo da reserva acontecer.' },
              { icon: TimeIcon, title: 'RESGATE IMEDIATO', text: 'Cancelamentos deixam de ser prejuízo. O horário volta automaticamente para a vitrine e pode ser preenchido por outro cliente em segundos.' },
              { icon: StarGlyph, title: 'VITRINE PROFISSIONAL', text: 'Tenha um link bio personalizado. O cliente vê profissionalismo desde o primeiro clique.' },
              { icon: CheckDoubleIcon, title: 'FLUXO COMPLETO', text: 'Da descoberta ao pós-atendimento, profissional e cliente continuam dentro do mesmo sistema.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <div
                key={i}
                className="relative border border-gray-800 p-7 hover:border-primary/40 transition-all group bg-black overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 border border-primary/25 bg-primary/6 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-black mb-2 text-white uppercase tracking-tight">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="block w-6 h-[2px] bg-primary" />
              <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase">PLANOS</span>
              <span className="block w-6 h-[2px] bg-primary" />
            </div>
            <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-black leading-tight uppercase">
              SEM <span className="text-primary">BUROCRACIA</span>
            </h2>
            <p className="text-gray-500 mt-3 text-base">Acesso liberado sem necessidade de dados bancários. Simples assim :)</p>
          </div>

          <div className="
            flex items-start gap-4 overflow-x-auto scroll-snap-type-x-mandatory
            sm:grid sm:grid-cols-3 sm:items-stretch sm:overflow-visible
            pb-4 sm:pb-0
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          ">
            <div className="
              shrink-0 w-max max-w-[85vw] [scroll-snap-align:center]
              sm:w-auto sm:max-w-none
              border border-gray-800 bg-[#080808]
              p-7 flex flex-col hover:border-gray-600 transition-colors
            ">
              <div className="mb-6">
                <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 border border-gray-700 px-3 py-1 mb-5">
                  Essencial
                </span>
                <p className="text-3xl font-black text-white mb-1">
                  R$ 39<span className="text-base font-black text-gray-600">,99/mês</span>
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Para autônomos que buscam organizar sua agenda.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-5 flex flex-col gap-3 flex-1">
                {[
                  'Reabertura automática de horários cancelados na agenda',
                  'Reserva em lote de múltiplos trabalhos em sequência para o mesmo dia',
                  'Direcionamento inteligente de novos agendamentos para horários colados aos já existentes',
                  'Controle individual para um único profissional com indicadores básicos de agendamentos e receita',
                  'Agendamento assistido pelo profissional',
                  'Vitrine profissional',
                  'Sistema segmentado: Notas e depoimentos separados por profissional e por negócio',
                  'Reagendamento inteligente em um clique pela área exclusiva do cliente',
                  'Alertas por e-mail em tempo real',
                  'Lembrete automático 30 min antes',
                  'Sincronia total com o Google Agenda.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs text-gray-500 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={WHATSAPP_ESSENCIAL_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-7 flex items-center justify-center px-5 py-3 border border-gray-700 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
              >
                Tenho interesse
              </a>
            </div>

            <div className="
              shrink-0 w-max max-w-[85vw] [scroll-snap-align:center]
              sm:w-auto sm:max-w-none
              border-2 border-primary bg-[#080808] plan-card-featured
              p-7 relative flex flex-col
            ">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary px-4 py-1">
                <span className="text-black text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">★ MAIS POPULAR</span>
              </div>

              <div className="mb-6 mt-2">
                <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-primary border border-primary/40 bg-primary/8 px-3 py-1 mb-5">
                  Profissional
                </span>
                <p className="text-3xl font-black text-white mb-1">
                  R$ <span className="text-green-400">39</span><span className="text-base font-black text-green-400">,99</span><span className="text-base font-black text-gray-500">/mês</span>
                </p>
                <p className="text-xs text-gray-400 leading-relaxed mt-2">
                  Para negócios em crescimento, com inteligência de dados e gerenciamento centralizado de equipe.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-5 flex flex-col gap-3 flex-1">
                {[
                  'Tudo do plano ESSENCIAL',
                  'Painel admin: controle de múltiplos profissionais',
                  'Painel individual para cada profissional parceiro',
                  'Até 5 profissionais parceiros sem taxas ou custos adicionais',
                  'Métricas em tempo real com contraste de desempenho diário',
                  'Análise evolutiva de faturamento com filtros temporais estratégicos',
                  'Relatório de faturamento volumétrico agrupado por período selecionado',
                  'Montagem de ofertas nos trabalhos oferecidos',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs text-gray-300 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 border border-primary/25 bg-primary/6 px-4 py-2.5">
                <StarGlyph sizeClass="h-4 w-4 text-[16px]" className="shrink-0" />
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                  MESMO <strong>VALOR</strong> DO ESSENCIAL
                </span>
              </div>

              <Link
                to="/cadastro"
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all cta-pulse"
              >
                ASSINAR AGORA <ZapIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="
              shrink-0 w-max max-w-[85vw] [scroll-snap-align:center]
              sm:w-auto sm:max-w-none
              border border-gray-800 bg-[#080808]
              p-7 flex flex-col hover:border-gray-600 transition-colors
            ">
              <div className="mb-6">
                <span className="inline-block text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 border border-gray-700 px-3 py-1 mb-5">
                  Premium Real
                </span>
                <p className="text-3xl font-black text-white mb-1">
                  R$ 69<span className="text-base font-black text-gray-600">,99/mês</span>
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Experiência completa com acesso ilimitado a todos os recursos.
                </p>
              </div>

              <div className="border-t border-gray-800 pt-5 flex flex-col gap-3 flex-1">
                {[
                  'Tudo do plano PROFISSIONAL',
                  'Profissionais ilimitados e sem custo extra por parceiro',
                  'Comprometimento da agenda e receita futura projetada',
                  'Acesso antecipado a novos recursos',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs text-gray-500 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={WHATSAPP_PREMIUM_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-7 flex items-center justify-center px-5 py-3 border border-gray-700 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
              >
                Tenho interesse
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-4 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 48px)'}} />
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="block w-8 h-[2px] bg-black/30" />
            <span className="text-black/60 font-black text-[10px] tracking-[0.3em] uppercase">PRÓXIMO PASSO</span>
            <span className="block w-8 h-[2px] bg-black/30" />
          </div>
          <h2 className="text-[clamp(2.4rem,7vw,5rem)] font-black text-black leading-none mb-5 uppercase">ELEVE SEU NÍVEL PROFISSIONAL</h2>
          <p className="text-xl text-black/70 mb-10 max-w-xl mx-auto">Uma vitrine para vender, um painel para operar e uma agenda que pensa antes de confirmar.</p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-3 px-14 py-5 bg-black text-primary font-black text-lg uppercase tracking-widest hover:bg-gray-900 transition-all hover:scale-105 shadow-2xl"
          >
            ACESSAR AGORA SEM CUSTO <ZapIcon className="w-5 h-5" />
          </Link>
          <p className="text-black/50 text-xs mt-5 uppercase tracking-widest">Eficiência comprovada em barbearias, estúdios e clínicas.</p>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-900 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div className="flex flex-col justify-start">
              <Link to="/" className="inline-block hover:opacity-75 transition-opacity">
                <img
                  src="/Comvaga Logo.png"
                  alt="Comvaga"
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-700 text-[10px] mt-3 uppercase tracking-widest leading-relaxed">
                Sua agenda,<br />matematicamente perfeita.
              </p>
            </div>

            <div>
              <h4 className="text-white font-black text-[10px] tracking-[0.25em] uppercase mb-5">PARA VOCÊ</h4>
              <ul className="space-y-3">
                {isLogged ? (
                  <>
                    <li>
                      <Link
                        to={userType === 'professional' ? '/dashboard' : '/minha-area'}
                        className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest"
                      >
                        {userType === 'professional' ? 'DASHBOARD' : 'MINHA ÁREA'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/login/parceiro" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                        LOGIN PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro/parceiro" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest"
                      >
                        SAIR
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                        ENTRAR
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                        CADASTRAR GRÁTIS
                      </Link>
                    </li>
                    <li>
                      <Link to="/login/parceiro" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                        LOGIN PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro/parceiro" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-[10px] tracking-[0.25em] uppercase mb-5">EMPRESA</h4>
              <ul className="space-y-3">
                {['SOBRE', 'BLOG'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-[10px] tracking-[0.25em] uppercase mb-5">LEGAL</h4>
              <ul className="space-y-3">
                {['PRIVACIDADE', 'TERMOS'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors text-[11px] uppercase tracking-widest">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-gray-700 text-[10px] uppercase tracking-widest">© 2026 COMVAGA. Todos os direitos reservados.</p>
            <div className="w-12 h-[1px] bg-primary/40" />
          </div>
        </div>
      </footer>
    </div>
  );
}
