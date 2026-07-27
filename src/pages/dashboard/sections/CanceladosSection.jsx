import { compareAgendamentoDateTimeDesc, formatDateBRFromISO, getAgDate, getAgInicio, getValorAgendamento } from '../utils';

export default function CanceladosSection({
  hojeCancelados,
  loading = false,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}) {
  return (
    <div>
      <h2 className="text-2xl font-normal mb-6">CANCELADOS</h2>
      {loading ? (
        <p className="text-primary text-center py-12">CARREGANDO...</p>
      ) : hojeCancelados.length > 0 ? (
        <div className="space-y-4">
          {hojeCancelados.slice().sort(compareAgendamentoDateTimeDesc).map(a => {
            const valorReal = getValorAgendamento(a);
            return (
              <div key={a.id} className="bg-dark-200 border border-red-500/30 rounded-custom p-4">
                <div className="flex items-start justify-between gap-2 mb-1"><p className="text-sm font-normal text-white truncate uppercase">{a.cliente?.nome || '—'}</p><div className="px-3 py-1 rounded-button text-xs bg-red-500/20 border border-red-500/50 text-red-400 shrink-0">CANCELADO</div></div>
                <p className="text-xs text-gray-500 truncate mb-0.5 uppercase">PROF: {a.profissionais?.nome || '—'}</p>
                <p className="text-xs text-primary truncate mb-3">{a.entregas?.nome || '—'}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><div className="text-xs text-gray-500">DATA</div><div className="text-white">{formatDateBRFromISO(getAgDate(a))}</div></div>
                  <div><div className="text-xs text-gray-500">HORÁRIO</div><div className="text-white">{getAgInicio(a)}</div></div>
                  <div><div className="text-xs text-gray-500">VALOR</div><div className="text-white">R$ {Number(valorReal).toFixed(2)}</div></div>
                </div>
              </div>
            );
          })}
          {hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={loadingMore}
              className="mt-2 w-full py-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm transition-all uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'CARREGANDO...' : 'CARREGAR MAIS'}
            </button>
          ) : null}
        </div>
      ) : <p className="text-green-500 text-center py-12">:)</p>}
    </div>
  );
}
