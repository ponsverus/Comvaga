import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import { ProtectionIcon, UsersIcon, TimeIcon, TrendingUpIcon, CheckDoubleIcon, ZapIcon, SearchIcon } from '../components/icons';

const SUPORTE_PHONE_E164 = '5533999037979';
const SUPORTE_MSG = 'Olá, preciso de ajuda. Pode me orientar?';
const SUPORTE_HREF =
  `https://wa.me/${SUPORTE_PHONE_E164}?text=${encodeURIComponent(SUPORTE_MSG)}`;

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
            'bg-transparent pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300',
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
              <div className="font-bold text-white uppercase">{r.nome}</div>
              {r.subtitulo && (
                <div className="mt-1 text-sm text-gray-400">{r.subtitulo}</div>
              )}
            </Link>
          ))}
        </div>
      )}

      {searchOpen && !buscando && searchTerm.trim().length >= 3 && resultadosBusca.length === 0 && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[3px] border border-white/10 bg-dark-100/95 px-5 py-4 text-sm text-gray-400 shadow-2xl backdrop-blur-xl">
          Nenhum resultado encontrado.
        </div>
      )}
    </div>
  );
}

function StarGlyph({ className = '' }) {
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center text-[32px] font-normal leading-none text-primary ${className}`}>
      {'\u2606'}
    </span>
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
      <div className="relative z-50 w-full bg-yellow-400 border-b border-yellow-300/50 overflow-hidden h-10 flex items-center">
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
          <div className="relative flex items-center justify-center h-16 sm:h-20">
            <Link to="/" className="flex flex-col items-center justify-center gap-1">
              <img
                src="/Comvaga Logo.png"
                alt="Comvaga"
                className="h-9 w-auto object-contain sm:h-11"
              />
              <h1 className="text-2xl sm:text-3xl font-black">COMVAGA</h1>
            </Link>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
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

      {/* HERO — Problema + Promessa */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-yellow-600/10"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-button mb-8 backdrop-blur-sm">
            <ZapIcon className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold text-sm">O FIM DA AGENDA ESBURACADA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-lg">
            SUA AGENDA,<br />
            <span className="bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
              MATEMATICAMENTE PERFEITA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Toda vez que um cliente cancela, você perde dinheiro. Toda vez que um serviço atrasa, o próximo cliente vai embora insatisfeito. A Comvaga resolve os dois lados: <span className="text-primary font-bold">antecipa conflitos antes que aconteçam</span> e transforma qualquer buraco na agenda em novas oportunidades de atendimento — tudo em tempo real, sem intervenção sua.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/cadastro"
              className="px-10 py-5 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button font-black text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              MAXIMIZAR MEUS GANHOS <ZapIcon className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white/10 border border-white/20 text-white rounded-button font-bold text-lg hover:bg-white/20 backdrop-blur-sm"
            >
              ENTENDER A LÓGICA
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            {['100%', '0%'].map((stat, i) => (
              <div key={i} className="bg-dark-100/50 backdrop-blur-md border border-gray-800 rounded-custom p-6 hover:border-primary/50 transition-all">
                <div className="text-4xl font-normal text-primary mb-2">{stat}</div>
                <div className="text-sm text-gray-500 uppercase">
                  {['Aproveitamento de Tempo', 'Conflito de Horários'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA — O mecanismo único */}
      <section id="como-funciona" className="py-24 px-4 bg-dark-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              A LÓGICA <span className="text-primary">POR TRÁS</span>
            </h2>
            <p className="text-xl text-gray-400">Três movimentos que mudam completamente a forma de trabalhar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {[
              {
                num: 1,
                title: 'VOCÊ DEFINE O TEMPO REAL',
                text: 'Cadastre seus serviços com a duração exata de cada um. O sistema usa esses dados como base de cálculo — não blocos fixos genéricos — para montar uma grade de horários que respeita a realidade do seu trabalho.',
              },
              {
                num: 2,
                title: 'O CLIENTE VÊ SÓ O QUE É POSSÍVEL',
                text: 'Nada de horários que parecem livres mas não são. O algoritmo exibe exclusivamente os slots que cabem o serviço escolhido sem invadir o próximo agendamento. O cliente agenda sozinho, pelo link, sem instalar nada.',
              },
              {
                num: 3,
                title: 'A AGENDA SE REORGANIZA SOZINHA',
                text: 'Cancelamento, troca ou novo agendamento: o sistema recalcula tudo instantaneamente. Não há espaço morto. Cada mudança gera novas oportunidades reais de atendimento que aparecem na vitrine em segundos.',
              },
            ].map(({ num, title, text }) => (
              <div key={num} className="relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 md:-top-10 md:-left-4 w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-full flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-primary/50 z-10">
                  {num}
                </div>
                <div className="bg-dark-200 border border-gray-800 rounded-custom p-8 pt-14 md:pt-10">
                  <h3 className="text-2xl font-normal mb-3 text-white">{title}</h3>
                  <p className="text-gray-400 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-primary/20 to-yellow-600/20 border border-primary/30 rounded-custom p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/30 rounded-custom flex items-center justify-center flex-shrink-0">
                <ZapIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-normal mb-2 text-white">CANCELAMENTO VIROU OPORTUNIDADE</h3>
                <p className="text-gray-300 leading-relaxed">
                  <span className="text-primary">UM CANCELAMENTO DE 60 MINUTOS</span> pode se transformar em três atendimentos de 20 minutos ou dois de 30 — dependendo exatamente dos serviços que você oferece. O sistema fragmenta esse tempo automaticamente e expõe as novas vagas na vitrine com um ícone discreto que sinaliza disponibilidade especial. Você não precisa fazer nada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARA O PROFISSIONAL — Gestão e resultado */}
      <section className="py-24 px-4 bg-dark-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              FEITO PARA QUEM <span className="text-primary">VIVE DISSO</span>
            </h2>
            <p className="text-xl text-gray-400">Controle real do negócio, sem planilha e sem achismo</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUpIcon,
                title: 'PAINEL DO NEGÓCIO',
                text: 'Faturamento, agendamentos, cancelamentos e próximos horários reunidos em um só lugar. Você enxerga o dia, a semana e o mês sem precisar perguntar para ninguém.',
              },
              {
                icon: UsersIcon,
                title: 'GESTÃO DA EQUIPE',
                text: 'Como admin, você aprova parcerias, define permissões e organiza quem atende o quê. Cada profissional tem sua própria rotina — sem que a agenda de um interfira na do outro.',
              },
              {
                icon: TimeIcon,
                title: 'HORÁRIOS INDIVIDUAIS',
                text: 'Entrada, saída, dias ativos e intervalo configurados por profissional. A flexibilidade do time não vira confusão: o sistema respeita cada rotina e bloqueia o que for impossível.',
              },
              {
                icon: CheckDoubleIcon,
                title: 'HISTÓRICO COMPLETO',
                text: 'Todo atendimento, cancelamento e cliente ficam registrados. Você acompanha quem voltou, quem sumiu e quem está prestes a agendar de novo — informação de verdade para tomar decisão.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="bg-dark-200 border border-gray-800 rounded-custom p-7 hover:border-primary/50 transition-all">
                <div className="w-14 h-14 bg-primary/20 rounded-custom flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-normal mb-3 text-white">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/15 to-yellow-600/10 border border-primary/25 rounded-custom p-8">
              <h3 className="text-2xl font-normal mb-3 text-white">SUA VITRINE, SUA IDENTIDADE</h3>
              <p className="text-gray-300 leading-relaxed">
                Um link único que representa seu negócio do jeito certo: galeria, depoimentos reais, redes sociais, mapa e botão de agendamento direto. O cliente chega preparado — já convencido antes de falar com você.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/15 to-yellow-600/10 border border-primary/25 rounded-custom p-8">
              <h3 className="text-2xl font-normal mb-3 text-white">SERVIÇOS E VALORES POR PROFISSIONAL</h3>
              <p className="text-gray-300 leading-relaxed">
                Cada membro da equipe tem seus próprios serviços, preços e duração. O sistema usa esses tempos reais para calcular a agenda — não uma estimativa genérica. Isso é o que garante o encaixe perfeito, sem atraso e sem ociosidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARA O CLIENTE — Experiência e confiança */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              O CLIENTE <span className="text-primary">TAMBÉM GANHA</span>
            </h2>
            <p className="text-xl text-gray-400">Quem agenda pela Comvaga sabe exatamente o que vai acontecer</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ProtectionIcon,
                title: 'HORÁRIO QUE SE CUMPRE',
                text: 'O sistema só permite reservas possíveis. Se o serviço não cabe no slot sem atrasar o próximo, a reserva é bloqueada. O cliente agenda com a certeza de que será atendido na hora marcada.',
              },
              {
                icon: SearchIcon,
                title: 'ENCONTRA SEM ESFORÇO',
                text: 'Pela busca da home, o cliente localiza qualquer negócio ou profissional cadastrado. Entra direto na vitrine, escolhe o serviço, vê os horários disponíveis e agenda — tudo sem baixar aplicativo.',
              },
              {
                icon: StarGlyph,
                title: 'FAVORITOS E FIDELIDADE',
                text: 'Negócios preferidos ficam salvos na área do cliente. Voltar a agendar leva segundos: o profissional, o serviço e os horários já estão ali esperando.',
              },
              {
                icon: CheckDoubleIcon,
                title: 'REPETIR É SIMPLES',
                text: 'Depois de um atendimento concluído, repetir o serviço com o mesmo profissional é questão de cliques. O histórico fica acessível e o cliente nunca perde o contexto.',
              },
              {
                icon: TimeIcon,
                title: 'TUDO EM UM LUGAR',
                text: 'Agendamentos em aberto, concluídos e cancelados ficam organizados na área do cliente. Sem mensagem no WhatsApp para confirmar, sem ligação para saber se ainda tem vaga.',
              },
              {
                icon: UsersIcon,
                title: 'AVALIAÇÕES REAIS',
                text: 'Depoimentos de quem já foi atendido ficam visíveis na vitrine do negócio. O novo cliente decide com base em experiência concreta — não em promessa.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="bg-dark-100/70 border border-gray-800 rounded-custom p-8 hover:border-primary/50 transition-all">
                <div className="w-16 h-16 bg-primary/20 rounded-custom flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-normal mb-3 text-white">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary via-yellow-500 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-black mb-6">CHEGA DE PERDER DINHEIRO COM TEMPO OCIOSO</h2>
          <p className="text-2xl text-black/80 mb-8">Sua agenda trabalha no limite da capacidade ou desperdiça. Não existe meio-termo.</p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-3 px-12 py-6 bg-black text-primary rounded-button font-black text-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            COMEÇAR AGORA GRÁTIS <ZapIcon className="w-6 h-6" />
          </Link>
          <p className="text-black/60 text-sm mt-6">Barbearias, estúdios, clínicas e salões já usam. Você ainda não?</p>
        </div>
      </section>

      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="flex flex-col justify-start">
              <Link to="/" className="inline-block hover:opacity-75 transition-opacity">
                <img
                  src="/Comvaga Logo.png"
                  alt="Comvaga"
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-600 text-xs mt-3 uppercase leading-relaxed">
                Sua agenda,<br />matematicamente perfeita.
              </p>
            </div>

            <div>
              <h4 className="text-white font-normal mb-4">PARA VOCÊ</h4>
              <ul className="space-y-2">
                {isLogged ? (
                  <>
                    <li>
                      <Link
                        to={userType === 'professional' ? '/dashboard' : '/minha-area'}
                        className="text-gray-500 hover:text-primary transition-colors text-sm"
                      >
                        {userType === 'professional' ? 'DASHBOARD' : 'MINHA ÁREA'}
                      </Link>
                    </li>
                    <li>
                      <Link to="/parceiro/login" className="text-gray-500 hover:text-primary transition-colors text-sm">
                        LOGIN PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <Link to="/parceiro/cadastro" className="text-gray-500 hover:text-primary transition-colors text-sm">
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="text-gray-500 hover:text-primary transition-colors text-sm"
                      >
                        SAIR
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-500 hover:text-primary transition-colors text-sm">
                        ENTRAR
                      </Link>
                    </li>
                    <li>
                      <Link to="/cadastro" className="text-gray-500 hover:text-primary transition-colors text-sm">
                        CADASTRAR GRÁTIS
                      </Link>
                    </li>
                    <li>
                      <Link to="/parceiro/login" className="text-gray-500 hover:text-primary transition-colors text-sm">
                        LOGIN PARCEIRO
                      </Link>
                    </li>
                    <li>
                      <Link to="/parceiro/cadastro" className="text-gray-500 hover:text-primary transition-colors text-sm">
                        CADASTRO PARCEIRO
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-normal mb-4">EMPRESA</h4>
              <ul className="space-y-2">
                {['SOBRE', 'BLOG'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-normal mb-4">LEGAL</h4>
              <ul className="space-y-2">
                {['PRIVACIDADE', 'TERMOS'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-gray-600 text-sm">© 2026 COMVAGA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
