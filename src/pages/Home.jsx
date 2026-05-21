import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import { ProtectionIcon, UserIcon, TimeIcon, TrendingUpIcon, CheckDoubleIcon, ZapIcon, SearchIcon, SelectIcon, CalendarIcon, CheckedIcon } from '../components/icons';

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
          'relative flex items-center overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-300 ease-out rounded-[3px]',
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
            'bg-transparent pr-4 text-sm text-white uppercase placeholder:text-gray-500 focus:outline-none transition-all duration-300',
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
              <div className="font-normal text-white uppercase">{r.nome}</div>
              {r.subtitulo && (
                <div className="mt-1 text-sm text-gray-400">{r.subtitulo}</div>
              )}
            </Link>
          ))}
        </div>
      )}

      {searchOpen && !buscando && searchTerm.trim().length >= 3 && resultadosBusca.length === 0 && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[3px] border border-white/10 bg-dark-100/95 px-5 py-4 text-sm text-gray-400 shadow-2xl backdrop-blur-xl">
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
    <div className="min-h-screen bg-black text-white relative font-sans">
      <div className="relative z-50 w-full bg-yellow-400 overflow-hidden h-10 flex items-center">
        <div className="announcement-bar-wrapper flex">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="announcement-bar-track flex items-center shrink-0 whitespace-nowrap"
              aria-hidden={i === 2}
            >
              {[...Array(14)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-black font-bold text-sm uppercase mx-4">CLIQUE PARA IR</span>
                  <span className="text-black mx-4">●</span>
                  <a
                    href={SUPORTE_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black font-normal text-sm uppercase hover:underline underline-offset-4 transition-all mx-4"
                  >
                    SUPORTE
                  </a>
                  <span className="text-black mx-4">●</span>
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
        `}</style>
      </div>

      <header className="absolute top-16 left-0 w-full z-40 bg-transparent border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            <Link to="/" className="flex flex-col items-start justify-center gap-1">
              <img
                src="/Comvaga Logo.png"
                alt="Comvaga"
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>
            <div className="relative">
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

      <section className="relative pt-40 pb-20 sm:pt-48 sm:pb-32 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-black to-black"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-white/10 rounded-[3px] mb-8 backdrop-blur-sm">
            <ZapIcon className="w-4 h-4 text-primary" />
            <span className="text-white font-normal tracking-wide text-xs uppercase">O FIM DA AGENDA ESBURACADA</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            SUA AGENDA,<br />
            <span className="text-primary">
              MATEMATICAMENTE PERFEITA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Comvaga organiza agenda, vitrine, equipe e cliente em uma experiência só. O sistema <span className="text-white font-bold">ANTECIPA CONFLITOS</span>, respeita o tempo real de cada trabalho e transforma horários livres em oportunidades reais de atendimento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full sm:w-auto">
            <Link
              to="/cadastro"
              className="px-10 py-4 bg-primary text-black rounded-[3px] font-bold text-sm tracking-wide hover:bg-yellow-400 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              MAXIMIZAR MEUS GANHOS <ZapIcon className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-transparent border border-white/10 text-white rounded-[3px] font-bold text-sm tracking-wide hover:bg-white/5 transition-colors w-full sm:w-auto"
            >
              ENTENDER A LÓGICA
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/10 p-px rounded-[3px] max-w-2xl mx-auto w-full">
            {['100%', '0%'].map((stat, i) => (
              <div key={i} className="bg-black p-8 text-center">
                <div className="text-3xl sm:text-4xl font-light text-white mb-2">{stat}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">
                  {['Aproveitamento de Tempo', 'Conflito de Horários'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-32 px-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">
              A CIÊNCIA <span className="text-primary">POR TRÁS</span>
            </h2>
            <p className="text-lg text-gray-400 font-light">Como o sistema protege seu faturamento e respeita o cliente</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            {[
              { num: '01', title: 'ROTINA REAL', text: 'Cada profissional trabalha com seus próprios dias, horários e pausas. A agenda se adapta à rotina individual de cada um, permitindo fluxos de trabalho independentes.' },          
              { num: '02', title: 'ENCAIXE AUTOMÁTICO', text: 'O algoritmo recalcula sua agenda a cada mudança: novos horários marcados, desistências ou trocas. Tudo se reorganiza no ato para manter seu trabalho com o máximo de eficiência.' },
              { num: '03', title: 'ACESSO SIMPLIFICADO', text: 'Seu cliente recebe um link exclusivo. Ele visualiza apenas os horários livres reais, sem precisar baixar nada.' },
            ].map(({ num, title, text }) => (
              <div key={num} className="bg-black border border-white/5 rounded-[3px] p-10 flex flex-col items-start transition-colors hover:border-white/10">
                <div className="text-primary font-mono text-sm mb-6 pb-4 border-b border-white/10 w-full">{num}</div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-wide">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { 
                title: 'REAPROVEITAMENTO INTELIGENTE E AUTOMÁTICO DE HORÁRIOS',
                highlight: 'CANCELOU?',
                desc: 'O sistema reage em milissegundos, recalculando toda a janela disponível por meio de particionamento dinâmico e controle de concorrência, a mesma lógica de integridade de bancos de dados relacionais de alta performance. O horário vago é redistribuído imediatamente na vitrine como novas oportunidades: assim, a vaga original de 60 minutos pode ser reservada inteira ou, de forma inteligente, se transformar em três horários de 20 minutos ou dois de 30 minutos. Os clientes visualizam essas oportunidades identificadas com um ícone discreto, garantindo total transparência.'
              },
              { 
                title: 'ZONA DE CALOR: AGENDA SEM BURACOS',
                highlight: 'A MAIORIA DOS SISTEMAS EXIBE TODOS OS HORÁRIOS LIVRES.',
                desc: 'A Comvaga vai além. No modo inteligente, o algoritmo identifica e prioriza os slots que encostam diretamente em agendamentos já confirmados, as chamadas zonas de calor. Ao invés de distribuir clientes aleatoriamente pela agenda, o sistema empurra os novos atendimentos para as bordas dos blocos já ocupados, compactando o dia e eliminando os intervalos vazios que consomem tempo e reduzem o faturamento.'
              },
              { 
                title: 'AGENDAMENTO MÚLTIPLO SEQUENCIAL',
                highlight: 'O CLIENTE SELECIONA MAIS DE UM TRABALHO.',
                desc: 'O motor calcula o tempo acumulado de cada um, adiciona a margem operacional entre atendimentos e verifica se o bloco inteiro cabe no turno do profissional, antes de confirmar qualquer coisa. Se couber, o sistema grava todos os trabalhos em sequência, sem conflitos, sem brechas. O profissional recebe um único bloco contínuo. O cliente sai com tudo resolvido em uma única reserva.'
              }
            ].map((block, i) => (
              <div key={i} className="bg-black border border-white/5 rounded-[3px] p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-12 h-12 bg-[#111] border border-white/10 rounded-[3px] flex items-center justify-center flex-shrink-0">
                  <ZapIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 text-white tracking-wide">{block.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    <span className="text-white font-semibold mr-1">{block.highlight}</span>
                    {block.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-dark-200 rounded-custom border border-gray-800 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />

            <div className="grid lg:grid-cols-2 gap-12 items-center p-6 sm:p-16">
              <div className="relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">VEJA AO VIVO</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                  NÃO APENAS UMA AGENDA, <br/>
                  <span className="text-primary">UMA VITRINE PROFISSIONAL.</span>
                </h2>
                
                <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Seu negócio merece mais do que um link cinza. Veja como seus clientes enxergam seus trabalhos, depoimentos, equipe e horários em uma interface projetada para converter curiosos em agendamentos confirmados.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 lg:mb-0">
                  <a
                    href="https://comvaga.com.br/v/vikings"
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-4 bg-primary text-black font-black rounded-button hover:shadow-[0_0_30px_rgba(255,209,26,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-3 group"
                  >
                    VER VITRINE EXEMPLO 
                    <ZapIcon className="w-5 h-5 group-hover:animate-bounce" />
                  </a>
                </div>
              </div>

              <div className="relative z-10 w-full max-w-[380px] mx-auto lg:max-w-none">
                <div className="relative bg-dark-100 border border-gray-700 rounded-[3px] overflow-hidden shadow-2xl transform rotate-2 lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                  <div className="h-24 sm:h-32 bg-gradient-to-br from-primary/20 to-yellow-600/30 relative">
                    <div className="absolute -bottom-10 left-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-dark-100 border-4 border-dark-100 overflow-hidden shadow-xl">
                       <div className="w-full h-full bg-gray-800 flex items-center justify-center font-black text-primary text-2xl">V</div>
                    </div>
                  </div>

                  <div className="pt-12 pb-6 px-4 sm:px-6">
                    <div className="mb-6 px-2">
                      <div className="flex items-center gap-1">
                        <div className="text-lg font-normal text-white uppercase tracking-tight">VIKINGS</div>
                        <CheckedIcon className="w-[13px] h-[13px] text-primary shrink-0" />
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <StarGlyph sizeClass="h-3 w-3 text-[12px]" /> 4.9
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-[22px] h-[22px] rounded-full border border-white/15 flex items-center justify-center text-gray-400">
                          <PreviewInstagramIcon />
                        </div>
                        <div className="w-[22px] h-[22px] rounded-full border border-white/15 flex items-center justify-center text-gray-400">
                          <PreviewFacebookIcon />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6 px-2">
                      <div className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-2">Servs Disponíveis</div>
                      
                      {[
                        { n: 'CORTE', p: 'R$ 45,00', d: '30 min' },
                        { n: 'BARBA TERAPIA', p: 'R$ 35,00', d: '20 min' }
                      ].map((s, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-[3px] p-4 flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-normal text-white uppercase">{s.n}</div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <TimeIcon className="w-3 h-3 text-gray-500" />
                                <span className="text-[10px] text-gray-500 font-normal uppercase">{s.d}</span>
                              </div>
                            </div>
                            <div className="text-primary font-normal text-sm">{s.p}</div>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex-1 h-8 rounded-full border border-white/15 flex items-center justify-center gap-2 px-3 hover:bg-white/5 transition-colors cursor-pointer">
                              <CalendarIcon className="w-3.5 h-3.5 text-white/40" />
                              <span className="text-[10px] font-normal text-white/70 uppercase">Agendar</span>
                            </div>
                            <div className="flex-1 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 px-3 hover:bg-primary/20 transition-colors cursor-pointer">
                              <SelectIcon className="w-3.5 h-3.5 text-white/40" />
                              <span className="text-[10px] font-normal text-primary uppercase">Selecionar</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-24 bg-gray-800/40 rounded-[3px] border border-dashed border-white/10 flex items-center justify-center relative group overflow-hidden mx-2">
                       <div className="text-white/20 font-normal text-xs uppercase tracking-widest group-hover:text-primary/40 transition-colors">GALERIA DE TRABALHOS</div>
                       <div className="absolute bottom-2 right-2 flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                     <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-primary"><StarGlyph sizeClass="h-4 w-4 text-[16px]" /></div>
                     <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/40"><PreviewHeartIcon /></div>
                  </div>
                </div>
                <div className="absolute -inset-10 bg-primary/10 blur-[80px] -z-10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">
              VANTAGEM <span className="text-primary">MÚTUA</span>
            </h2>
            <p className="text-lg text-gray-400 font-light">Por que Profissionais e Clientes preferem Comvaga</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-[3px] overflow-hidden">
            {[
              { icon: TrendingUpIcon, title: 'LUCRO BLINDADO', text: 'Eliminamos o tempo ocioso. A agenda se ajusta sozinha para caber o máximo de clientes sem sobrecarga.' },
              { icon: UserIcon, title: 'CLIENTE SATISFEITO', text: 'Para quem agenda: a certeza de ser atendido na hora. Nosso sistema impede que o profissional atrase por erro de cálculo.' },
              { icon: ProtectionIcon, title: 'AGENDA INTELIGENTE', text: 'Cada horário exibido já considera os próximos encaixes da agenda, evitando conflitos antes mesmo da reserva acontecer.' },
              { icon: TimeIcon, title: 'RESGATE IMEDIATO', text: 'Cancelamentos deixam de ser prejuízo. O horário volta automaticamente para a vitrine e pode ser preenchido por outro cliente em segundos.' },
              { icon: StarGlyph, title: 'VITRINE PROFISSIONAL', text: 'Tenha um link bio personalizado. O cliente vê profissionalismo desde o primeiro clique.' },
              { icon: CheckDoubleIcon, title: 'FLUXO COMPLETO', text: 'Da descoberta ao pós-atendimento, profissional e cliente continuam dentro do mesmo sistema.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <div
                key={i}
                className="bg-black p-10 flex flex-col group hover:bg-[#111] transition-colors"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-[3px] flex items-center justify-center mb-8 group-hover:border-primary/30 transition-colors">
                  <Icon className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white tracking-wide">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">
              SEM <span className="text-primary">BUROCRACIA</span>
            </h2>
            <p className="text-lg text-gray-400 font-light">Acesso liberado sem necessidade de dados bancários. Simples assim :)</p>
          </div>
         
          <div className="grid lg:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">

            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3px] p-8 sm:p-10 flex flex-col h-full hover:border-white/20 transition-colors">
              <div className="mb-8">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 rounded-[3px] px-3 py-1 mb-6">
                  Essencial
                </span>
                <p className="text-4xl font-light text-white mb-2 tracking-tight">
                  R$ 29<span className="text-xl font-normal text-gray-500">,99/mês</span>
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Para autônomos que buscam organizar sua agenda.
                </p>
              </div>

              <div className="border-t border-white/5 pt-8 flex flex-col gap-4 flex-grow">
                {[
                  'Reabertura automática de horários cancelados na agenda',
                  'Agendamento assistido pelo profissional',
                  'Vitrine profissional',
                  'Alertas por e-mail em tempo real',
                  'Lembrete automático 30 min antes',
                  'Sincronia total com o Google Agenda.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-gray-400 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={WHATSAPP_ESSENCIAL_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-center w-full px-6 py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-[3px] hover:bg-white/5 transition-all"
              >
                Tenho interesse
              </a>
            </div>

            <div className="bg-[#111] border border-primary/30 rounded-[3px] p-8 sm:p-10 relative flex flex-col h-full shadow-[0_0_30px_rgba(255,209,26,0.05)] transform lg:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-[3px]"></div>
              <div className="mb-8">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-[3px] px-3 py-1 mb-6">
                  Profissional
                </span>
                <p className="text-4xl font-light text-white mb-2 tracking-tight">
                  R$ <span className="text-green-400">39</span><span className="text-xl font-normal text-green-400">,99</span><span className="text-xl font-normal text-gray-400">/mês</span>
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Controle total para negócios em crescimento, com métricas e equipe ILIMITADA.
                </p>
              </div>

              <div className="border-t border-white/5 pt-8 flex flex-col gap-4 flex-grow">
                {[
                  'Tudo do plano ESSENCIAL',
                  'Tudo do plano PREMIUM REAL',
                  'Painel admin: controle de múltiplos profissionais',
                  'Painel individual para cada profissional parceiro',
                  'Profissionais ilimitados e sem custo extra por parceiro',
                  'Métricas em tempo real com contraste de desempenho diário',
                  'Comprometimento da agenda e receita futura projetada',
                  'Análise evolutiva de faturamento com filtros temporais estratégicos',
                  'Taxa de fechamento de agendamentos por período',
                  'Montagem de ofertas nos trabalhos oferecidos',
                  'Sistema segmentado: Notas e depoimentos separados por profissional e por negócio',
                  'Reagendamento inteligente em um clique pela área exclusiva do cliente',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-gray-300 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 bg-black border border-white/5 rounded-[3px] p-4">
                <StarGlyph sizeClass="h-4 w-4 text-[18px]" className="shrink-0" />
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
                  Vantagens do <span className="text-primary">Premium Real</span> inclusas
                </span>
              </div>

              <Link
                to="/cadastro"
                className="mt-6 flex items-center justify-center w-full gap-2 px-6 py-4 bg-primary text-black text-xs font-bold uppercase tracking-wider rounded-[3px] hover:bg-yellow-400 transition-colors"
              >
                ASSINAR AGORA <ZapIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-[3px] p-8 sm:p-10 flex flex-col h-full hover:border-white/20 transition-colors">
              <div className="mb-8">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 rounded-[3px] px-3 py-1 mb-6">
                  Premium Real
                </span>
                <p className="text-4xl font-light text-white mb-2 tracking-tight">
                  R$ 69<span className="text-xl font-normal text-gray-500">,99/mês</span>
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Experiência completa com acesso ilimitado a todos os recursos.
                </p>
              </div>

              <div className="border-t border-white/5 pt-8 flex flex-col gap-4 flex-grow">
                {[
                  'Tudo do plano PROFISSIONAL',
                  'Painel admin: controle de múltiplos profissionais',
                  'Painel individual para cada profissional parceiro',
                  'Profissionais ilimitados e sem custo extra por parceiro',
                  'Métricas em tempo real com contraste de desempenho diário',
                  'Comprometimento da agenda e receita futura projetada',
                  'Análise evolutiva de faturamento com filtros temporais estratégicos.',
                  'Taxa de fechamento de agendamentos por período',
                  'Montagem de ofertas nos trabalhos oferecidos',
                  'Sistema segmentado: Notas e depoimentos separados por profissional e por negócio',
                  'Reagendamento inteligente em um clique pela área exclusiva do cliente',
                  'Acesso antecipado a novos recursos',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-gray-400 leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={WHATSAPP_PREMIUM_HREF}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center justify-center w-full px-6 py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-[3px] hover:bg-white/5 transition-all"
              >
                Tenho interesse
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-primary flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-black mb-6 tracking-tight">ELEVE SEU NÍVEL PROFISSIONAL</h2>
          <p className="text-lg sm:text-xl text-black/80 mb-10 font-medium">Uma vitrine para vender, um painel para operar e uma agenda que pensa antes de confirmar.</p>
          <Link
            to="/cadastro"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-black text-primary rounded-[3px] font-bold text-sm tracking-widest hover:bg-[#111] transition-colors uppercase w-full sm:w-auto"
          >
            ACESSAR AGORA SEM CUSTO <ZapIcon className="w-4 h-4" />
          </Link>
          <p className="text-black/60 text-sm mt-8 font-medium">Eficiência comprovada em barbearias, estúdios e clínicas.</p>
        </div>
      </section>

      <footer className="bg-black py-16 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col justify-start col-span-2 md:col-span-1">
              <Link to="/" className="inline-block mb-6">
                <img
                  src="/Comvaga Logo.png"
                  alt="Comvaga"
                  className="h-10 w-auto object-contain opacity-50 grayscale"
                />
              </Link>
              <p className="text-gray-500 text-xs uppercase tracking-widest leading-relaxed">
                Sua agenda,<br />matematicamente perfeita.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-6">PARA VOCÊ</h4>
              <ul className="space-y-4">
                {isLogged ? (
                  <>
                    <li>
                      <Link
                        to={userType === 'professional' ? '/dashboard' : '/minha-area'}
                        className="text-gray-400 hover:text-white transition-colors text-xs font-medium"
                      >
                        {userType === 'professional' ? 'DASHBOARD' : 'MINHA ÁREA'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/login/parceiro" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                        LOGIN PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro/parceiro" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="text-gray-400 hover:text-white transition-colors text-xs font-medium"
                      >
                        SAIR
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                        ENTRAR
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                        CADASTRAR GRÁTIS
                      </Link>
                    </li>
                    <li>
                      <Link to="/login/parceiro" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                        LOGIN PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro/parceiro" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-6">EMPRESA</h4>
              <ul className="space-y-4">
                {['SOBRE', 'BLOG'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-6">LEGAL</h4>
              <ul className="space-y-4">
                {['PRIVACIDADE', 'TERMOS'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
            <p className="text-gray-600 text-xs font-medium">© 2026 COMVAGA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
