import React, { useEffect, useRef } from 'react';

export default function VitrineGallerySection({ items, hasMore = false, loadingMore = false, onLoadMore }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loadingMore || typeof onLoadMore !== 'function') return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
    }, { rootMargin: '600px 0px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  if (!items.length) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-px">
          {items.map((item) => (
            <div key={item.id} className="mb-px w-full break-inside-avoid overflow-hidden rounded-custom border border-vborder bg-vcard">
              <img src={item.url} alt="Galeria" className="w-full h-auto object-contain bg-vbg" loading="lazy" />
            </div>
          ))}
        </div>
        {hasMore && (
          <div ref={sentinelRef} className="flex h-12 items-center justify-center" aria-hidden="true">
            {loadingMore && <div className="h-5 w-5 rounded-full border-2 border-vborder border-t-vtext animate-spin" />}
          </div>
        )}
      </div>
    </section>
  );
}
