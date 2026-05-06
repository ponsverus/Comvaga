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
            O Comvaga organiza agenda, vitrine, equipe e cliente em uma experiência só. O sistema <span className="text-primary font-bold">ANTECIPA CONFLITOS</span>, respeita a duração real de cada serviço e transforma horários livres em oportunidades reais de atendimento.
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

      <section id="como-funciona" className="py-24 px-4 bg-dark-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              A CIÊNCIA <span className="text-primary">POR TRÁS</span>
            </h2>
            <p className="text-xl text-gray-400">Como o sistema protege seu faturamento e respeita o cliente</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {[
              { num: 1, title: 'ROTINA REAL', text: 'Cada profissional trabalha com seus próprios dias, horários, pausas e serviços. O sistema não força uma agenda genérica para todo mundo.' },
              { num: 2, title: 'VAGAS POSSÍVEIS', text: 'O cliente vê somente horários que cabem de verdade no expediente e na duração do serviço escolhido.' },
              { num: 3, title: 'DECISÃO SEGURA', text: 'Antes de confirmar, o sistema verifica conflito, horário vencido e encaixe com os próximos atendimentos.' },
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
                <h3 className="text-2xl font-normal mb-2 text-white">REAPROVEITAMENTO AUTOMÁTICO DE HORÁRIOS</h3>
                <p className="text-gray-300 leading-relaxed">
                  <span className="text-primary">CANCELOU?</span> O espaço volta para a vitrine como nova oportunidade de agenda, respeitando o tempo dos serviços disponíveis. Um intervalo que antes virava prejuízo pode voltar a ser vendido sem o profissional reorganizar tudo manualmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-dark-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              VANTAGEM <span className="text-primary">MÚTUA</span>
            </h2>
            <p className="text-xl text-gray-400">Por que Profissionais e Clientes preferem Comvaga</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUpIcon, title: 'MENOS TEMPO PERDIDO', text: 'A agenda deixa de depender de blocos fixos e passa a trabalhar com a duração real de cada atendimento.' },
              { icon: UsersIcon, title: 'CLIENTE COM CLAREZA', text: 'Quem agenda entende profissional, serviço, horário e status sem precisar chamar no WhatsApp para confirmar tudo.' },
              { icon: ProtectionIcon, title: 'MENOS ERRO MANUAL', text: 'O sistema barra reservas que não fazem sentido antes que elas virem atraso, remarcação ou desgaste.' },
              { icon: TimeIcon, title: 'CANCELAMENTO ÚTIL', text: 'Quando uma vaga abre, ela pode voltar para a vitrine e ser aproveitada por outro cliente.' },
              { icon: StarGlyph, title: 'CONFIANÇA PÚBLICA', text: 'Galeria, depoimentos e profissionais dão contexto para o cliente decidir antes do agendamento.' },
              { icon: CheckDoubleIcon, title: 'FLUXO COMPLETO', text: 'Da descoberta ao pós-atendimento, profissional e cliente continuam dentro do mesmo sistema.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-primary/10 to-yellow-600/10 border border-primary/20 rounded-custom p-8 hover:border-primary/50 transition-all hover:scale-105"
              >
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

      <section className="py-24 px-4 bg-dark-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              CONTROLE <span className="text-primary">DO NEGÓCIO</span>
            </h2>
            <p className="text-xl text-gray-400">O painel existe para operar o dia, não apenas cadastrar dados</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUpIcon, title: 'LEITURA DO DIA', text: 'Faturamento, agenda, utilização e próximos atendimentos aparecem sem o dono precisar juntar informação em vários lugares.' },
              { icon: UsersIcon, title: 'PARCERIAS SOB CONTROLE', text: 'Profissionais solicitam acesso ao negócio; o admin aprova, acompanha e mantém a equipe organizada.' },
              { icon: TimeIcon, title: 'ROTINA INDIVIDUAL', text: 'Cada profissional pode ter expediente e pausa próprios, dia por dia, sem afetar a agenda dos demais.' },
              { icon: CheckDoubleIcon, title: 'OPERAÇÃO ASSISTIDA', text: 'O painel permite acompanhar clientes, histórico, cancelados e criar agendamentos quando o atendimento acontece por fora.' },
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
              <h3 className="text-2xl font-normal mb-3 text-white">VITRINE QUE AJUDA A DECIDIR</h3>
              <p className="text-gray-300 leading-relaxed">
                A vitrine não é só uma página bonita: ela mostra prova, equipe, serviços e disponibilidade para reduzir dúvida antes do cliente escolher um horário.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/15 to-yellow-600/10 border border-primary/25 rounded-custom p-8">
              <h3 className="text-2xl font-normal mb-3 text-white">SERVIÇO NO TEMPO CERTO</h3>
              <p className="text-gray-300 leading-relaxed">
                O tempo de cada serviço vira regra de agenda. Isso evita encaixe falso, reduz atraso e melhora a ocupação do expediente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              CLIENTE <span className="text-primary">NO CONTROLE</span>
            </h2>
            <p className="text-xl text-gray-400">O cliente não precisa aprender sistema; ele só precisa conseguir resolver</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: SearchIcon, title: 'ENCONTRAR', text: 'A busca leva o cliente direto ao negócio ou profissional certo, sem depender de link perdido em conversa.' },
              { icon: StarGlyph, title: 'VOLTAR', text: 'Favoritos e marcação recorrente encurtam o caminho para quem já conhece e quer repetir.' },
              { icon: TimeIcon, title: 'ACOMPANHAR', text: 'Agendamentos em aberto, concluídos e cancelados ficam organizados na área do cliente.' },
              { icon: CheckDoubleIcon, title: 'REPETIR', text: 'Depois do atendimento, o cliente consegue marcar novamente com menos passos e menos dúvida.' },
              { icon: UsersIcon, title: 'AVALIAR', text: 'Depoimentos alimentam a confiança da vitrine e ajudam o bom profissional a provar qualidade.' },
              { icon: ProtectionIcon, title: 'EVITAR SURPRESA', text: 'Horários expirados, conflitos e encaixes impossíveis são bloqueados antes da confirmação.' },
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

      <section className="py-24 px-4 bg-gradient-to-r from-primary via-yellow-500 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-black mb-6">ELEVE SEU NÍVEL PROFISSIONAL</h2>
          <p className="text-2xl text-black/80 mb-8">Uma vitrine para vender, um painel para operar e uma agenda que pensa antes de confirmar.</p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-3 px-12 py-6 bg-black text-primary rounded-button font-black text-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            COMEÇAR AGORA GRÁTIS <ZapIcon className="w-6 h-6" />
          </Link>
          <p className="text-black/60 text-sm mt-6">Eficiência comprovada em barbearias, estúdios e clínicas.</p>
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
