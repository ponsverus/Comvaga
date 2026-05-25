import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const PROFISSIONAIS_POR_PAGINA = 3;

function StarChar({ size = 16, className = '' }) {
  return (
    <span 
      className={className || 'text-primary'} 
      style={{ fontSize: size, lineHeight: 1 }} 
      aria-hidden="true"
    >
      ★
    </span>
  );
}

export default function VitrineProfessionalsSection({
  cards,
  counterSingular,
  counterPlural,
  profissaoTag,
  mediaColor,
  almocoBadge,
}) {
  const [pagina, setPagina] = useState(0);
  const totalPaginas = Math.ceil(cards.length / PROFISSIONAIS_POR_PAGINA);
  const inicio = pagina * PROFISSIONAIS_POR_PAGINA;
  const itens = cards.slice(inicio, inicio + PROFISSIONAIS_POR_PAGINA);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const ultimaPaginaValida = Math.max(0, totalPaginas - 1);
    setPagina((prev) => Math.min(prev, ultimaPaginaValida));
  }, [totalPaginas]);

  const goPrev = () => setPagina((p) => Math.max(0, p - 1));
  const goNext = () => setPagina((p) => Math.min(totalPaginas - 1, p + 1));
  
  const handleTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches?.[0];
    touchStartRef.current = null;
    if (!start || !touch || totalPaginas <= 1) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <section className="py-24 bg-black w-full border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-5xl font-black uppercase tracking-tight text-white">
          NOSSA <span className="text-primary">EQUIPE</span>
        </h2>
        <p className="text-xl text-gray-400 mt-2">Profissionais especialistas disponíveis para atendimento</p>
      </div>

      {/* Grid contínuo cortado milimetricamente por gap-px de ponta a ponta */}
      <div 
        className="w-full bg-gray-800 border-y border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px items-stretch" 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        {itens.map((prof) => (
          <div 
            key={prof.id} 
            className="bg-dark-100 p-8 sm:p-12 flex flex-col justify-between transition-colors hover:bg-dark-200/50 px-4 sm:px-8 md:px-12 lg:px-16"
          >
            <div>
              <div className="flex items-start gap-5 mb-6">
                {prof.avatarUrl ? (
                  <div className="w-16 h-16 rounded-[3px] overflow-hidden border border-white/10 bg-dark-200 shrink-0 shadow-lg">
                    <img src={prof.avatarUrl} alt={prof.nome} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 rounded-[3px] flex items-center justify-center text-2xl font-black text-black shrink-0 shadow-lg">
                    {prof.nome?.[0] || 'P'}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5 mb-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight truncate">
                      {prof.nome}
                    </h3>
                    {prof.profissaoLabel && (
                      <div className="self-start">
                        <span className={`inline-block px-2.5 py-1 rounded-[3px] text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-300 ${profissaoTag}`}>
                          {prof.profissaoLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  {prof.status?.label && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 relative flex`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${prof.status.color || 'bg-emerald-500'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${prof.status.color || 'bg-emerald-500'}`}></span>
                      </span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{prof.status.label}</span>
                    </div>
                  )}

                  {prof.depInfo?.media && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarChar size={14} className="text-primary" />
                      <span className={`text-sm font-bold text-white ${mediaColor}`}>{prof.depInfo.media}</span>
                      <span className="text-xs text-gray-500">({prof.depInfo.count} avaliações)</span>
                    </div>
                  )}

                  {prof.anos_experiencia != null && (
                    <p className="text-xs text-gray-500 font-normal uppercase tracking-wider">
                      {prof.anos_experiencia} {prof.anos_experiencia === 1 ? 'ano' : 'anos'} de experiência
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Metadados e badges no rodapé do bloco */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                {prof.horarioIni} - {prof.horarioFim}
              </span>
              
              {prof.almoco?.ini && prof.almoco?.fim && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                  <span className={almocoBadge || 'text-yellow-500/90'}>
                    PAUSA {String(prof.almoco.ini).slice(0, 5)} - {String(prof.almoco.fim).slice(0, 5)}
                  </span>
                </span>
              )}
              
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium uppercase tracking-wider">
                {prof.totalEntregas} {prof.totalEntregas === 1 ? counterSingular : counterPlural}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação Técnica Rígida */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-6 mt-12">
          <button 
            type="button" 
            onClick={goPrev} 
            disabled={pagina === 0} 
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent border border-white/10 text-gray-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed hover:border-primary hover:text-primary"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPagina(i)}
                className={[
                  'transition-all duration-300 rounded-full', 
                  i === pagina ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                ].join(' ')}
                aria-label={`Ir para página ${i + 1}`}
              />
            ))}
          </div>
          
          <button 
            type="button" 
            onClick={goNext} 
            disabled={pagina === totalPaginas - 1} 
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent border border-white/10 text-gray-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed hover:border-primary hover:text-primary"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
