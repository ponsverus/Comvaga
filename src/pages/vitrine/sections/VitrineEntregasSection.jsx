import React from 'react';
import EntregasCarousel from '../components/EntregasCarousel';

export default function VitrineEntregasSection({
  cards,
  sectionTitle,
  emptyListMsg,
  counterSingular,
  counterPlural,
  booking,
}) {
  return (
    <section className="py-16 bg-black text-white w-full border-t border-gray-900">
      {/* Título da Seção alinhado ao Grid Master */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-left">
          {sectionTitle}
        </h2>
      </div>

      {cards.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 font-normal uppercase tracking-wider text-sm">
            {emptyListMsg}
          </p>
        </div>
      ) : (
        /* Lista de blocos individuais espaçados entre si */
        <div className="w-full space-y-14">
          {cards.map((card) => {
            return (
              <div 
                key={card.id} 
                className="w-full flex flex-col"
              >
                {/* 1. CARD DO PROFISSIONAL: Linhas cortam a tela de ponta a ponta horizontais */}
                <div className="w-full border-t border-b border-gray-800 bg-dark-100/20 backdrop-blur-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-primary font-bold tracking-widest uppercase block mb-1">
                        PROFISSIONAL AUTORIZADO
                      </span>
                      <div className="font-black text-xl tracking-wide uppercase text-white">
                        {card.nome}
                      </div>
                    </div>
                    
                    <div className="text-xs font-bold tracking-widest text-gray-400 bg-gray-900/50 border border-gray-800 px-3 py-1.5 uppercase shrink-0">
                      {card.lista.length} {card.lista.length === 1 ? counterSingular : counterPlural}
                    </div>
                  </div>
                </div>

                {/* 2. CAROUSEL DE ENTREGAS: Colado imediatamente abaixo do card do profissional */}
                <div className="w-full bg-black border-b border-gray-900/50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <EntregasCarousel
                      lista={card.lista}
                      profissional={card.profissional}
                      selecaoProfId={booking.selecaoProfId}
                      servicosSelecionados={booking.servicosSelecionados}
                      isProfessional={booking.isProfessional}
                      onAgendarAgora={booking.onAgendarAgora}
                      onToggleSelecao={booking.onToggleSelecao}
                      emptyMsg={emptyListMsg}
                      isLight={booking.isLight}
                    />
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
