import { Link } from 'react-router-dom';
import { CalendarIcon } from '../../../components/icons';
import ReviewStar from './ReviewStar';
import {
  formatDateBRFromISO,
  getStatusColor,
  getStatusText,
  getValorAgendamento,
  moneyBR,
} from '../utils';

function BookingGroup({
  title,
  items,
  reviewsByBooking,
  reviewTarget,
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  reviewLoading,
  onCancel,
  onRebook,
  onOpenReview,
  onSubmitReview,
}) {
  if (!items.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">{title}</div>
        <div className="text-xs text-gray-500">{items.length}</div>
      </div>
      <div className="space-y-4">
        {items.map((booking) => {
          const nomeProfissionalDepoimento = String(booking.profissionais?.nome || '').trim();
          const podeMarcarNovamente =
            ['concluido', 'cancelado_cliente', 'cancelado_profissional'].includes(String(booking.status || '')) &&
            !!booking.negocio_slug &&
            !!booking.profissional_id &&
            !!booking.entrega_id;
          const podeAvaliar =
            String(booking.status || '') === 'concluido' &&
            !reviewsByBooking[booking.id];
          const depoimentoAberto = podeAvaliar && reviewTarget?.id === booking.id;

          return (
            <div key={booking.id} className="overflow-hidden bg-dark-200 border border-gray-800 rounded-custom">
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-normal text-white mb-1">{booking.profissionais?.negocios?.nome || '\u2014'}</h3>
                    <p className="text-sm text-gray-400 mb-2 uppercase">PROF: {booking.profissionais?.nome || '\u2014'}</p>
                    <p className="text-sm text-primary">{booking.entregas?.nome || '\u2014'}</p>
                  </div>
                  <div className={`shrink-0 inline-flex px-3 py-1 rounded-button text-xs border ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">DATA</div>
                    <div className="text-sm text-white">{formatDateBRFromISO(booking.data)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{'HOR\u00c1RIO'}</div>
                    <div className="text-sm text-white">{booking.hora_inicio || '\u2014'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">VALOR</div>
                    <div className="text-sm text-white">R$ {moneyBR(getValorAgendamento(booking))}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {booking.status === 'agendado' && (
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-button text-sm transition-all"
                    >
                      CANCELAR
                    </button>
                  )}
                  {podeMarcarNovamente && (
                    <button
                      onClick={() => onRebook(booking)}
                      className="w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm transition-all uppercase"
                    >
                      AGENDAR NOVAMENTE
                    </button>
                  )}
                  {podeAvaliar && (
                    <button
                      onClick={() => onOpenReview(booking)}
                      className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-button text-sm transition-all uppercase"
                    >
                      DAR DEPOIMENTO
                    </button>
                  )}
                </div>
              </div>
              {depoimentoAberto && (
                <div className="border-t border-gray-800 px-3 py-3 sm:px-5">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex shrink-0 items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((nota) => (
                        <ReviewStar
                          key={nota}
                          active={reviewRating >= nota}
                          onClick={() => setReviewRating(nota)}
                          label={`${nota} estrela${nota > 1 ? 's' : ''}`}
                        />
                      ))}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <label className="shrink-0 whitespace-nowrap text-sm font-normal uppercase text-gray-500 sm:text-sm sm:tracking-wide">
                          {'Coment\u00e1rio:'}
                        </label>

                        <input
                          type="text"
                          value={reviewText}
                          onChange={(event) => setReviewText(event.target.value)}
                          placeholder="OPCIONAL"
                          className="min-w-[42px] flex-1 bg-transparent px-0 py-2 text-sm text-white placeholder-gray-600 outline-none focus:text-white"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={onSubmitReview}
                        disabled={reviewLoading}
                        className="w-full shrink-0 rounded-button border border-primary/50 bg-primary/20 px-4 py-2 text-sm font-normal uppercase text-primary transition-colors hover:bg-primary/30 hover:border-primary disabled:opacity-60 sm:w-auto sm:bg-transparent sm:px-4 sm:text-xs"
                      >
                        {reviewLoading
                          ? 'ENVIANDO...'
                          : `ENVIAR${nomeProfissionalDepoimento ? ` PARA ${nomeProfissionalDepoimento}` : ''}`}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingsSection({
  groups,
  hasMore,
  loadingMore,
  onLoadMore,
  onCancel,
  onRebook,
  onOpenReview,
  reviewsByBooking,
  reviewTarget,
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  reviewLoading,
  onSubmitReview,
}) {
  const hasBookings = groups.abertos.length || groups.cancelados.length || groups.concluidos.length;

  return (
    <div>
      {hasBookings ? (
        <>
          <BookingGroup
            title="EM ABERTO"
            items={groups.abertos}
            reviewsByBooking={reviewsByBooking}
            reviewTarget={reviewTarget}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            reviewLoading={reviewLoading}
            onCancel={onCancel}
            onRebook={onRebook}
            onOpenReview={onOpenReview}
            onSubmitReview={onSubmitReview}
          />
          <BookingGroup
            title={'CONCLU\u00cdDOS'}
            items={groups.concluidos}
            reviewsByBooking={reviewsByBooking}
            reviewTarget={reviewTarget}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            reviewLoading={reviewLoading}
            onCancel={onCancel}
            onRebook={onRebook}
            onOpenReview={onOpenReview}
            onSubmitReview={onSubmitReview}
          />
          <BookingGroup
            title="CANCELADOS"
            items={groups.cancelados}
            reviewsByBooking={reviewsByBooking}
            reviewTarget={reviewTarget}
            reviewRating={reviewRating}
            setReviewRating={setReviewRating}
            reviewText={reviewText}
            setReviewText={setReviewText}
            reviewLoading={reviewLoading}
            onCancel={onCancel}
            onRebook={onRebook}
            onOpenReview={onOpenReview}
            onSubmitReview={onSubmitReview}
          />
        </>
      ) : (
        <div className="flex flex-col items-center py-12 gap-4">
          <CalendarIcon className="block w-16 h-16 text-gray-500 opacity-40" />
          <Link to="/" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button hover:shadow-lg transition-all">
            AGENDAR
          </Link>
        </div>
      )}
      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loadingMore}
          className="mt-2 w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm font-normal uppercase disabled:opacity-60"
        >
          {loadingMore ? 'CARREGANDO...' : 'CARREGAR MAIS'}
        </button>
      )}
    </div>
  );
}
