import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import Heart from './Heart';

export default function FavoritesSection({
  favoritos,
  removingFavoritoId,
  hasMore,
  loadingMore,
  onRemove,
  onLoadMore,
}) {
  return (
    <div>
      {favoritos.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {favoritos.map((fav) => {
            const isNegocio = fav.tipo === 'negocio';
            const nomeFav = isNegocio ? (fav.negocios?.nome || '\u2014') : (fav.profissionais?.nome || '\u2014');
            const slug = isNegocio ? fav.negocios?.slug : fav.profissionais?.negocios?.slug;
            const tipoNegocio = isNegocio ? (String(fav.negocios?.tipo_negocio || '').trim() || '\u2014') : 'PROFISSIONAL';

            return (
              <div key={fav.id} className="bg-dark-200 border border-gray-800 rounded-custom p-4 relative group hover:border-primary/50 transition-all">
                <button
                  type="button"
                  aria-label="Remover favorito"
                  onClick={() => onRemove(fav.id)}
                  disabled={removingFavoritoId === fav.id}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 opacity-100 transition-all hover:bg-red-500/30 focus:outline-none sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 disabled:opacity-60"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
                <div className="mb-3">
                  <Heart filled size={24} className="text-red-500 mb-3" />
                  <h3 className="text-lg font-normal text-white mb-1">{nomeFav}</h3>
                  <p className="text-xs text-gray-500 uppercase">{tipoNegocio}</p>
                </div>
                {slug && (
                  <Link to={`/v/${slug}`} className="block w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm text-center transition-all">
                    VER VITRINE
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart filled size={64} className="text-red-500/30 mx-auto mb-4" />
          <Link to="/" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-yellow-600 text-black rounded-button hover:shadow-lg transition-all">
            EXPLORAR
          </Link>
        </div>
      )}
      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loadingMore}
          className="mt-4 w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-button text-sm font-normal uppercase disabled:opacity-60"
        >
          {loadingMore ? 'CARREGANDO...' : 'CARREGAR MAIS'}
        </button>
      )}
    </div>
  );
}
