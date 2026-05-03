import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const ENTREGAS_PER_PAGE = 6;

function ProfissionalEntregasBlock({
  profissional,
  lista,
  counterSingular,
  counterPlural,
  emptyListMsg,
  checarPermissao,
  deleteEntrega,
  setEditingEntregaId,
  setFormEntrega,
  setShowNovaEntrega,
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(lista.length / ENTREGAS_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);

  useEffect(() => {
    setPage((prev) => Math.min(prev, pageCount - 1));
  }, [pageCount]);

  const visibleEntregas = useMemo(() => {
    const start = currentPage * ENTREGAS_PER_PAGE;
    return lista.slice(start, start + ENTREGAS_PER_PAGE);
  }, [currentPage, lista]);

  const goPrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const goNext = () => setPage((prev) => Math.min(prev + 1, pageCount - 1));

  return (
    <div className="bg-dark-200 border border-gray-800 rounded-custom p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-normal text-lg">{profissional.nome}</div>
        <div className="text-xs text-gray-500">{lista.length} {lista.length === 1 ? counterSingular : counterPlural}</div>
      </div>

      {lista.length ? (
        <div className="relative md:px-12">
          {pageCount > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={currentPage === 0}
                className="hidden md:inline-flex absolute left-1 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-dark-100 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentPage === pageCount - 1}
                className="hidden md:inline-flex absolute right-1 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-dark-100 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          ) : null}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {visibleEntregas.map(s => {
              const preco = Number(s.preco ?? 0);
              const promo = s.preco_promocional == null ? null : Number(s.preco_promocional);
              return (
                <div key={s.id} className="bg-dark-100 border border-gray-800 rounded-custom p-5">
                  <div className="flex justify-between items-start mb-3">
                    {promo != null && promo > 0 && promo < preco ? (<div className="text-xl font-normal text-green-400">R$ {promo.toFixed(2)}</div>) : (<div className="text-xl font-normal text-primary">R$ {preco.toFixed(2)}</div>)}
                    <span className="inline-flex items-center rounded-full border border-gray-700 bg-transparent px-3 py-1 text-xs text-gray-500">{s.duracao_minutos} MIN</span>
                  </div>
                  <h3 className="text-sm font-normal text-white mb-0.5">{s.nome}</h3>
                  <p className="text-xs text-gray-500 mb-4">PROF: {profissional.nome}</p>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      if (!await checarPermissao(s.profissional_id)) return;
                      setEditingEntregaId(s.id);
                      setFormEntrega({ nome: s.nome || '', duracao_minutos: String(s.duracao_minutos ?? ''), preco: String(s.preco ?? ''), preco_promocional: String(s.preco_promocional ?? ''), profissional_id: s.profissional_id || '' });
                      setShowNovaEntrega(true);
                    }} className="flex-1 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-button text-sm font-normal uppercase">EDITAR</button>
                    <button onClick={() => deleteEntrega(s)} className="flex-1 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-button text-sm font-normal uppercase">EXCLUIR</button>
                  </div>
                </div>
              );
            })}
          </div>

          {pageCount > 1 ? (
            <div className="flex items-center justify-between md:justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentPage === 0}
                className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPage(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentPage ? 'bg-primary' : 'bg-gray-600 hover:bg-gray-400'}`}
                    aria-label={`Ir para pagina ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={currentPage === pageCount - 1}
                className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-gray-700 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>
      ) : <p className="text-gray-500">{emptyListMsg}</p>}
    </div>
  );
}

export default function EntregasSection({
  sectionTitle,
  parceiroProfissional,
  setShowNovaEntrega,
  setEditingEntregaId,
  setFormEntrega,
  btnAddLabel,
  profissionais,
  entregasPorProf,
  counterSingular,
  counterPlural,
  emptyListMsg,
  checarPermissao,
  deleteEntrega,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-normal">{sectionTitle}</h2>
        <button
          onClick={() => { const profId = parceiroProfissional ? parceiroProfissional.id : ''; setShowNovaEntrega(true); setEditingEntregaId(null); setFormEntrega({ nome: '', duracao_minutos: '', preco: '', preco_promocional: '', profissional_id: profId }); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-button font-normal uppercase border bg-gradient-to-r from-primary to-yellow-600 text-black border-transparent">
          <Plus className="w-5 h-5" />{btnAddLabel}
        </button>
      </div>
      {profissionais.length === 0 ? <div className="text-gray-500">Nenhum profissional cadastrado.</div> : (
        <div className="space-y-4">
          {profissionais.map(p => {
            const lista = (entregasPorProf.get(p.id) || []).slice().sort((a, b) => Number(b.preco || 0) - Number(a.preco || 0));
            return (
              <ProfissionalEntregasBlock
                key={p.id}
                profissional={p}
                lista={lista}
                counterSingular={counterSingular}
                counterPlural={counterPlural}
                emptyListMsg={emptyListMsg}
                checarPermissao={checarPermissao}
                deleteEntrega={deleteEntrega}
                setEditingEntregaId={setEditingEntregaId}
                setFormEntrega={setFormEntrega}
                setShowNovaEntrega={setShowNovaEntrega}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
