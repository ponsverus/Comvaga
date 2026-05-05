import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UsersIcon, CheckIcon } from '../../../components/icons';
import { formatDateBRFromISO } from '../utils';
import { getPublicUrl } from '../api/dashboardApi';

const CLIENTES_PER_PAGE = 6;

function moneyBR(value) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return '0,00';
  return number.toFixed(2).replace('.', ',');
}

function ClienteCard({ cliente, itemLabelText, onAgendarCliente }) {
  const avatarUrl = getPublicUrl('avatars', cliente.cliente_avatar_path);
  const nome = String(cliente.cliente_nome || 'Cliente').trim();
  const inicial = nome?.[0]?.toUpperCase() || '?';

  return (
    <div className="bg-dark-200 border border-gray-800 rounded-custom p-4 h-full flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-dark-100 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={nome} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary text-lg font-normal">{inicial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-normal text-white truncate uppercase">{nome}</h3>
          <p className="text-xs text-gray-500 uppercase">{Number(cliente.total_agendamentos || 0)} agendamentos</p>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="text-xs text-gray-500 uppercase mb-3">ULTIMO AGENDAMENTO</div>
        <div className="min-w-0">
          <div className="text-primary text-sm leading-snug break-words">{cliente.ultimo_entrega_nome || itemLabelText}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="min-w-0">
            <div className="text-xs text-gray-500 mb-1">DATA</div>
            <div className="text-white truncate">{formatDateBRFromISO(cliente.ultimo_data)}</div>
          </div>
          <div className="min-w-0">
            <div className="text-xs text-gray-500 mb-1">VALOR</div>
            <div className="text-white truncate">R$ {moneyBR(cliente.ultimo_valor)}</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAgendarCliente(cliente)}
        className="mt-auto w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm font-normal uppercase transition-all flex items-center justify-center gap-2"
      >
        <CheckIcon className="w-4 h-4" />
        AGENDAR CLIENTE
      </button>
    </div>
  );
}

export default function ClientesSection({
  clientes,
  clientesLoading,
  clientesError,
  clientesHasMore,
  clientesLoadingMore,
  loadMoreClientes,
  onAgendarCliente,
  itemLabel = 'SERV',
}) {
  const itemLabelText = String(itemLabel || 'SERV').toUpperCase();
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(CLIENTES_PER_PAGE);

  const desktopPageCount = Math.max(1, Math.ceil(clientes.length / CLIENTES_PER_PAGE));
  const currentDesktopPage = Math.min(desktopPage, desktopPageCount - 1);
  const canGoDesktopNext = currentDesktopPage < desktopPageCount - 1 || clientesHasMore;

  useEffect(() => {
    setDesktopPage((prev) => Math.min(prev, desktopPageCount - 1));
  }, [desktopPageCount]);

  useEffect(() => {
    setMobileVisibleCount((prev) => Math.max(CLIENTES_PER_PAGE, Math.min(prev, Math.max(clientes.length, CLIENTES_PER_PAGE))));
  }, [clientes.length]);

  const desktopClientes = useMemo(() => {
    const start = currentDesktopPage * CLIENTES_PER_PAGE;
    return clientes.slice(start, start + CLIENTES_PER_PAGE);
  }, [clientes, currentDesktopPage]);

  const mobileClientes = useMemo(() => (
    clientes.slice(0, mobileVisibleCount)
  ), [clientes, mobileVisibleCount]);

  const goDesktopPrev = () => setDesktopPage((prev) => Math.max(prev - 1, 0));

  const goDesktopNext = async () => {
    if (currentDesktopPage < desktopPageCount - 1) {
      setDesktopPage((prev) => prev + 1);
      return;
    }
    if (!clientesHasMore || clientesLoadingMore) return;
    await loadMoreClientes();
    setDesktopPage((prev) => prev + 1);
  };

  const loadMoreMobile = async () => {
    if (mobileVisibleCount < clientes.length) {
      setMobileVisibleCount((prev) => prev + CLIENTES_PER_PAGE);
      return;
    }
    if (!clientesHasMore || clientesLoadingMore) return;
    await loadMoreClientes();
    setMobileVisibleCount((prev) => prev + CLIENTES_PER_PAGE);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal">Clientes</h2>
      </div>

      {clientesLoading ? (
        <div className="text-gray-500 text-center py-12">CARREGANDO CLIENTES...</div>
      ) : clientesError ? (
        <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-custom p-4 text-sm">
          {clientesError}
        </div>
      ) : clientes.length > 0 ? (
        <>
          <div className="md:hidden space-y-4">
            {mobileClientes.map((cliente) => (
              <ClienteCard key={cliente.cliente_id} cliente={cliente} itemLabelText={itemLabelText} onAgendarCliente={onAgendarCliente} />
            ))}
          </div>

          {(mobileVisibleCount < clientes.length || clientesHasMore) ? (
            <button
              type="button"
              onClick={loadMoreMobile}
              disabled={clientesLoadingMore}
              className="mt-2 w-full py-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm transition-all uppercase disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {clientesLoadingMore ? 'CARREGANDO...' : 'CARREGAR MAIS'}
            </button>
          ) : null}

          <div className="hidden md:block">
            <div className="relative md:px-16">
              {(desktopPageCount > 1 || clientesHasMore) ? (
                <>
                  <button
                    type="button"
                    onClick={goDesktopPrev}
                    disabled={currentDesktopPage === 0}
                    className="hidden md:inline-flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-dark-100 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goDesktopNext}
                    disabled={!canGoDesktopNext || clientesLoadingMore}
                    className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-dark-100 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              ) : null}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {desktopClientes.map((cliente) => (
                  <ClienteCard key={cliente.cliente_id} cliente={cliente} itemLabelText={itemLabelText} onAgendarCliente={onAgendarCliente} />
                ))}
              </div>
            </div>

            {(desktopPageCount > 1 || clientesHasMore) ? (
              <div className="flex items-center justify-center gap-2 mt-4">
                {Array.from({ length: desktopPageCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setDesktopPage(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentDesktopPage ? 'bg-primary' : 'bg-gray-600 hover:bg-gray-400'}`}
                    aria-label={`Ir para pagina ${index + 1}`}
                  />
                ))}
                {clientesHasMore ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-800" aria-hidden="true" />
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-40" />
          <p className="text-gray-500 text-sm font-medium">NENHUM CLIENTE ENCONTRADO</p>
        </div>
      )}
    </div>
  );
}
