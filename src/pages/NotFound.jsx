import React from 'react';
import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-9 h-9 text-primary" />
        </div>

        <p className="text-primary text-sm font-normal uppercase tracking-[0.22em] mb-3">Erro 404</p>
        <h1 className="text-3xl font-normal uppercase mb-4">Página perdida</h1>
        <p className="text-gray-400 mb-8">
          O link acessado é inexistente ou foi removido.
        </p>

        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-button bg-gradient-to-r from-primary to-yellow-600 py-3 text-sm font-normal uppercase text-black transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          <Home className="w-4 h-4" />
          Voltar para home
        </Link>
      </div>
    </div>
  );
}
