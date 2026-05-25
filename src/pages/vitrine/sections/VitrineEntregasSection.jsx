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
    <section className="py-12 bg-vcard2 w-full border-t border-vborder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-normal text-left">{sectionTitle}</h2>
      </div>

      {cards.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-vmuted font-normal">{emptyListMsg}</p>
        </div>
      ) : (
        <div className="w-full bg-vborder border-t border-vborder columns-1 md:columns-2 gap-px p-0">
          {cards.map((card) => {
            return (
              <div 
                key={card.id} 
                className="bg-vcard p-6 hover:border-vprimary/50 transition-all mb-px break-inside-avoid inline-block w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-normal text-lg uppercase">{card.nome}</div>
                  <div className="text-xs text-vmuted font-normal">
                    {card.lista.length} {card.lista.length === 1 ? counterSingular : counterPlural}
                  </div>
                </div>
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
            );
          })}
        </div>
      )}
    </section>
  );
}
