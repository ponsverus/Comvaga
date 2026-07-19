export function flattenEntregaPages(pagesByProf) {
  const seen = new Set();
  const rows = [];

  Object.values(pagesByProf || {}).forEach((entry) => {
    Object.keys(entry?.pages || {})
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((page) => {
        (entry.pages[page] || []).forEach((item) => {
          if (!item?.id || seen.has(item.id)) return;
          seen.add(item.id);
          rows.push(item);
        });
      });
  });

  return rows;
}
