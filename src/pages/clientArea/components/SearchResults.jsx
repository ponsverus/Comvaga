import { Link } from 'react-router-dom';
import { ProfessionalIcon } from '../../../components/icons';

function SearchResult({ row, onSelect }) {
  const tipo = String(row?.tipo || '').toLowerCase();
  const isNegocio = tipo === 'negocio';
  const typeLabel = isNegocio ? 'NEG\u00d3CIO' : 'PROFISSIONAL';
  const subtitle = String(row?.subtitulo || '').trim();

  if (!isNegocio) {
    return (
      <Link
        key={`${row?.tipo || 'item'}-${row?.id || row?.slug}`}
        to={`/v/${row?.slug}`}
        onClick={onSelect}
        className="block border-b border-white/5 px-5 py-4 text-left transition-colors hover:bg-dark-200/90 last:border-b-0"
      >
        <div className="font-normal text-white uppercase">{row?.nome || '\u2014'}</div>
        {subtitle && (
          <div className="mt-1 text-sm text-gray-400">{subtitle}</div>
        )}
      </Link>
    );
  }

  return (
    <Link
      key={`${row?.tipo || 'item'}-${row?.id || row?.slug}`}
      to={`/v/${row?.slug}`}
      onClick={onSelect}
      className="block border-b border-white/5 px-4 py-4 text-left transition-colors hover:bg-dark-200/90 last:border-b-0"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-800 bg-dark-200">
          <ProfessionalIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-normal uppercase text-white">{row?.nome || '\u2014'}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] uppercase text-primary">
              {typeLabel}
            </span>
            {subtitle && (
              <span className="truncate text-xs uppercase text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchResults({
  mobile = false,
  searchTerm,
  searching,
  searchError,
  searchRows,
  onSelectResult,
}) {
  const hasQuery = String(searchTerm || '').trim().length >= 3;
  if (!hasQuery) return null;

  const wrapClass = mobile
    ? 'mt-3 overflow-hidden rounded-[3px] border border-white/10 bg-dark-100/95 shadow-2xl backdrop-blur-xl'
    : 'absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[3px] border border-white/10 bg-dark-100/95 shadow-2xl backdrop-blur-xl';

  return (
    <div className={wrapClass}>
      {searching && (
        <div className="px-4 py-4 text-sm text-gray-400">
          BUSCANDO...
        </div>
      )}
      {!searching && searchError && (
        <div className="px-4 py-4 text-sm text-red-300">
          {searchError}
        </div>
      )}
      {!searching && !searchError && searchRows.length > 0 && (
        <div>
          {searchRows.map((row) => (
            <SearchResult key={`${row?.tipo || 'item'}-${row?.id || row?.slug}`} row={row} onSelect={onSelectResult} />
          ))}
        </div>
      )}
      {!searching && !searchError && searchRows.length === 0 && (
        <div className="px-4 py-4 text-sm text-gray-400">
          Nenhum resultado encontrado.
        </div>
      )}
    </div>
  );
}
