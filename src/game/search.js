// Guess-box search. No library: normalise both sides, require every query token to appear,
// rank by where the match starts. Handles "3070ti" vs "RTX 3070 Ti" by also comparing
// with spaces removed.
export function normalise(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function buildIndex(items) {
  return items.map((item) => {
    const n = normalise(item.name);
    return { item, n, squashed: n.replace(/ /g, "") };
  });
}

export function search(index, query, { type, exclude = new Set(), limit = 8 } = {}) {
  const q = normalise(query);
  if (!q) return [];
  const tokens = q.split(" ");
  const qs = q.replace(/ /g, "");
  const scored = [];
  for (const e of index) {
    if (type && e.item.type !== type) continue;
    if (exclude.has(e.item.id)) continue;
    let pos = -1;
    if (tokens.every((t) => e.n.includes(t))) pos = e.n.indexOf(tokens[0]);
    else if (e.squashed.includes(qs)) pos = e.squashed.indexOf(qs);
    if (pos < 0) continue;
    // Exact-ish names first, then earliest match, then shorter names (RTX 3070 before RTX 3070 Ti).
    const score = (e.n === q ? 0 : 1) * 1000 + pos * 10 + Math.min(e.n.length, 99) / 100;
    scored.push({ item: e.item, score });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((s) => s.item);
}
