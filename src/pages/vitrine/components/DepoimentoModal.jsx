import React from 'react';
import { X } from 'lucide-react';

export default function DepoimentoModal({
  open,
  setShowDepoimento,
  depoModalBg,
  depoModalTitle,
  depoModalClose,
  depoModalLabel,
  depoimentoTipo,
  setDepoimentoTipo,
  setDepoimentoProfissionalId,
  depoNegBtn,
  nomeNegocioLabel,
  depoProfBtn,
  profissionais,
  depoProfItem,
  depoimentoProfissionalId,
  depoNotaBtn,
  setDepoimentoNota,
  depoTextarea,
  depoimentoTexto,
  setDepoimentoTexto,
  enviarDepoimento,
  depoimentoLoading,
  depoSendBtn,
  depoHintCl,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`border rounded-custom max-w-md w-full max-h-[90vh] flex flex-col ${depoModalBg}`}>
        <div className="flex justify-between items-center p-6 pb-4 shrink-0">
          <h3 className={`text-2xl font-normal ${depoModalTitle}`}>DEPOIMENTO</h3>
          <button onClick={() => setShowDepoimento(false)} className={depoModalClose}><X className="w-6 h-6" /></button>
        </div>
        <div className="overflow-y-auto px-6 pb-6 flex-1">
          <div className="mb-4">
            <div className={`text-sm font-normal mb-2 ${depoModalLabel}`}>Você está deixando um depoimento sobre</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setDepoimentoTipo('negocio'); setDepoimentoProfissionalId(null); }} className={`px-4 py-3 rounded-custom border transition-all font-normal ${depoNegBtn(depoimentoTipo)}`}>{nomeNegocioLabel}</button>
              <button onClick={() => setDepoimentoTipo('profissional')} className={`px-4 py-3 rounded-custom border transition-all font-normal ${depoProfBtn(depoimentoTipo)}`}>PROFISSIONAL</button>
            </div>
          </div>
          {depoimentoTipo === 'profissional' && (
            <div className="mb-4">
              <div className={`text-sm font-normal mb-2 ${depoModalLabel}`}>Qual profissional?</div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {profissionais.map((prof) => (<button key={prof.id} onClick={() => setDepoimentoProfissionalId(prof.id)} className={`w-full text-left px-4 py-3 rounded-custom border transition-all font-normal ${depoProfItem(depoimentoProfissionalId === prof.id)}`}>{prof.nome}</button>))}
              </div>
            </div>
          )}
          <div className="mb-4">
            <div className={`text-sm font-normal mb-2 ${depoModalLabel}`}>Nota</div>
            <div className="flex gap-2">{[1, 2, 3, 4, 5].map((n) => (<button key={n} onClick={() => setDepoimentoNota(n)} className={`w-12 h-8 rounded-button border transition-all font-normal ${depoNotaBtn(n)}`}>{n}</button>))}</div>
          </div>
          <div className="mb-5">
            <div className={`text-sm font-normal mb-2 ${depoModalLabel}`}>Comentário é opcional</div>
            <textarea value={depoimentoTexto} onChange={(e) => setDepoimentoTexto(e.target.value)} rows={4} className={`w-full px-4 py-3 border rounded-custom focus:outline-none resize-none font-normal ${depoTextarea}`} placeholder="Conte como foi sua experiência..." />
          </div>
          <button onClick={enviarDepoimento} disabled={depoimentoLoading || (depoimentoTipo === 'profissional' && !depoimentoProfissionalId)} className={`w-full py-3 rounded-button disabled:opacity-60 uppercase font-normal transition-colors ${depoSendBtn}`}>
            {depoimentoLoading ? 'ENVIANDO...' : 'ENVIAR DEPOIMENTO'}
          </button>
          <p className={`text-xs mt-3 font-normal ${depoHintCl}`}>{depoimentoTipo === 'profissional' && !depoimentoProfissionalId ? 'Selecione um profissional para continuar' : 'Somente clientes logados podem deixar depoimentos.'}</p>
        </div>
      </div>
    </div>
  );
}
