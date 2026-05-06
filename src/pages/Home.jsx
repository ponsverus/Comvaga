import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useFeedback } from '../feedback/useFeedback';
import { ZapIcon, SearchIcon } from '../components/icons';

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
      <div className="flex items-center rounded-full bg-black/40">
        <button
          onClick={() => setSearchOpen(true)}
          className="h-11 w-11 flex items-center justify-center"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-white outline-none"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);

  const { showMessage } = useFeedback();

  useEffect(() => {
    const buscar = async () => {
      if (searchTerm.length < 3) return;
      try {
        const { data } = await supabase.rpc('search_home', {
          p_term: searchTerm,
          p_limit: 10,
        });
        setResultadosBusca(data || []);
      } catch {
        showMessage('Erro na busca');
      }
    };

    const t = setTimeout(buscar, 300);
    return () => clearTimeout(t);
  }, [searchTerm, showMessage]);

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="absolute top-0 w-full z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4">
          <Link to="/" className="text-2xl font-black">COMVAGA</Link>
          <SearchBox
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            resultadosBusca={resultadosBusca}
            setResultadosBusca={setResultadosBusca}
          />
        </div>
      </header>

      <section className="pt-40 pb-24 text-center px-4">
        <h1 className="text-5xl font-black mb-6">
          SUA AGENDA<br />
          <span className="text-primary">TRABALHANDO NO LIMITE MÁXIMO</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Sem conflitos, sem buracos, sem desperdício.
        </p>
        <Link to="/cadastro" className="px-10 py-5 bg-primary text-black font-bold">
          MAXIMIZAR MEUS GANHOS
        </Link>
      </section>

      <section className="py-24 text-center bg-dark-100">
        <h2 className="text-4xl font-black mb-4">
          O PROBLEMA NÃO É FALTA DE CLIENTE
        </h2>
        <p className="text-gray-400">
          Você perde dinheiro por falhas invisíveis na agenda.
        </p>
      </section>

      <section className="py-24 text-center bg-dark-200">
        <h2 className="text-4xl font-black mb-4">
          UMA AGENDA QUE PENSA POR VOCÊ
        </h2>
        <p className="text-gray-400">
          Tudo se organiza automaticamente.
        </p>
      </section>

      <section className="py-24 text-center bg-dark-100">
        <h2 className="text-4xl font-black mb-4">
          CANCELAMENTOS NÃO SÃO MAIS PREJUÍZO
        </h2>
        <p className="text-gray-400">
          Horários são reaproveitados automaticamente.
        </p>
      </section>

      <section className="py-24 text-center bg-primary">
        <h2 className="text-4xl font-black text-black mb-6">
          PARE DE PERDER HORÁRIOS
        </h2>
        <Link to="/cadastro" className="px-10 py-5 bg-black text-primary font-bold">
          COMEÇAR AGORA
        </Link>
      </section>

      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white mb-4">COMVAGA</h4>
            <p className="text-gray-500 text-sm">
              Sua agenda no máximo desempenho.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">ACESSO</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-gray-400">Entrar</Link></li>
              <li><Link to="/cadastro" className="text-gray-400">Cadastrar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">EMPRESA</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400">Sobre</a></li>
              <li><a href="#" className="text-gray-400">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">SUPORTE</h4>
            <a href={SUPORTE_HREF} className="text-gray-400 text-sm">
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          © 2026 COMVAGA. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}
