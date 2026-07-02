export function getRequestErrorKey(error, options = {}) {
  const raw = `${error?.code || ''} ${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`.toLowerCase();

  if (
    raw.includes('rate_limit_exceeded')
    || raw.includes('too many requests')
    || raw.includes('muitas tentativas')
    || raw.includes('limite diário')
  ) {
    return 'alerts.rate_limit_exceeded';
  }

  if (
    raw.includes('timeout')
    || raw.includes('57014')
    || raw.includes('statement timeout')
    || raw.includes('canceling statement due to statement timeout')
    || raw.includes('demorou demais')
  ) {
    return 'alerts.request_timeout';
  }

  if (raw.includes('entrega_agendamentos_futuros_bloqueados')) {
    return options.entregaFutureBookingsKey || null;
  }

  return null;
}
