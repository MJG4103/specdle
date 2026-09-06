// Pure helpers for the tools pages (part pages, index pages). No DOM, no hooks: they run at
// build time in Node (scripts/prerender.mjs) and are unit-tested in model.test.js.
import { AMAZON_TAG } from "../config.js";

/** URL slug: the id without the vendor prefix ("nvidia-geforce-rtx-3070" -> "geforce-rtx-3070").
 *  buildSlugs() falls back to the full id where two parts would collide. */
export function slugFor(item) {
  return item.id.replace(/^(nvidia|amd|intel)-/, "");
}

export function buildSlugs(items) {
  const counts = new Map();
  for (const it of items) counts.set(slugFor(it), (counts.get(slugFor(it)) || 0) + 1);
  const out = new Map();
  for (const it of items) out.set(it.id, counts.get(slugFor(it)) > 1 ? it.id : slugFor(it));
  return out;
}

export function pathFor(item, slugs) {
  return `/${item.type}/${slugs.get(item.id)}/`;
}

/** A part gets its own page only when it has something a spec table alone can't give:
 *  a launch price (so an inflation figure) or a Blender score. */
export function hasPage(item, perf) {
  return item.msrp_usd != null || perf.items[item.id] != null;
}

/** Launch price in the latest CPI year's dollars, using calendar-year averages. */
export function adjust(msrp, year, cpi) {
  const from = cpi.years[String(year)];
  const to = cpi.years[String(cpi.latest_year)];
  if (msrp == null || !from || !to) return null;
  return Math.round(msrp * to / from);
}

export function cpiLabel(cpi) {
  const months = cpi.latest_months;
  return months >= 12 ? `${cpi.latest_year} dollars` : `${cpi.latest_year} dollars (${months}-month average)`;
}

const SINCE = { gpu: 2016, cpu: 2017 };
const round1 = (n) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10);

/** Parts of the same type that carry a score, newest era first by score. */
export function scored(type, items, perf) {
  return items.filter((i) => i.type === type && perf.items[i.id]).sort((a, b) => perf.items[b.id].median - perf.items[a.id].median);
}

/** Rank among all scored parts of the type, and among scored parts of the same series. */
export function scoreRank(item, items, perf) {
  const p = perf.items[item.id];
  if (!p) return null;
  const all = scored(item.type, items, perf);
  const modern = all.filter((i) => i.year >= SINCE[item.type] && !i.oem);
  const series = all.filter((i) => i.series === item.series);
  const pos = (list) => list.findIndex((i) => i.id === item.id) + 1;
  return {
    rank: pos(all), of: all.length,
    modernRank: modern.some((i) => i.id === item.id) ? pos(modern) : null, modernOf: modern.length,
    seriesRank: pos(series), seriesOf: series.length,
    // Value at launch, in points per $100 so it reads the same for a 200-point CPU and a 6,000-point GPU.
    pointsPer100: item.msrp_usd ? round1(p.median / item.msrp_usd * 100) : null,
  };
}

// Re-releases and memory variants of another row (same rule as build.py's NOT_DAILY, plus
// memory-type suffixes): they clutter a lineage table without adding a generation.
const VARIANT = /Rev\. ?\d|Mac Edition|\bOEM\b|\bPCI\b|Green Edition|Core 216|\b\d{4} D\b|\bLHR\b|PhysX|\bG?DDR\d[A-Z]?\b|\bV2\b/i;

/** The same vendor's parts in the same tier, oldest first: the "70-class over time" table.
 *  Capped to `window` rows around the part so i5-class pages don't list fifteen generations. */
export function lineage(item, items, window = 16) {
  if (item.tier == null) return [];
  const all = items
    .filter((i) => i.type === item.type && i.vendor === item.vendor && i.tier === item.tier && !i.oem && (i.id === item.id || !VARIANT.test(i.name)))
    .sort((a, b) => a.year - b.year || (a.month || 0) - (b.month || 0) || a.name.localeCompare(b.name));
  if (all.length <= window) return all;
  const at = all.findIndex((i) => i.id === item.id);
  const start = Math.min(Math.max(0, at - Math.floor(window / 2)), all.length - window);
  return all.slice(start, start + window);
}

/** Nearby parts for internal links: same type, within a year, price within 25% or score within 25%. */
export function similar(item, items, perf, limit = 8) {
  const p = perf.items[item.id];
  const close = (a, b, frac) => a != null && b != null && Math.abs(a - b) <= Math.max(a, b) * frac;
  return items
    .filter((i) => i.id !== item.id && i.type === item.type && !i.oem && Math.abs(i.year - item.year) <= 1
      && hasPage(i, perf)
      && (close(i.msrp_usd, item.msrp_usd, 0.25) || (p && perf.items[i.id] && close(perf.items[i.id].median, p.median, 0.25))))
    .sort((a, b) => (a.vendor === item.vendor ? 0 : 1) - (b.vendor === item.vendor ? 0 : 1) || Math.abs(a.year - item.year) - Math.abs(b.year - item.year) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function amazonUrl(name) {
  return AMAZON_TAG ? `https://www.amazon.com/s?k=${encodeURIComponent(name)}&tag=${AMAZON_TAG}` : null;
}

export const fmtUsd = (n) => (n == null ? null : `$${Math.round(n).toLocaleString("en-US")}`);
export const fmtNum = (n, d = 0) => (n == null ? null : Number(n).toLocaleString("en-US", { maximumFractionDigits: d }));
export const fmtMem = (mb) => (mb == null ? null : mb % 1024 === 0 && mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function fmtDate(item) {
  if (item.date_precision === "month" && item.month) return `${MONTHS[item.month - 1]} ${item.year}`;
  if (item.date_precision === "quarter" && item.quarter) return `Q${item.quarter} ${item.year}`;
  return String(item.year);
}
export const isoDate = (item) => (item.month ? `${item.year}-${String(item.month).padStart(2, "0")}` : String(item.year));
export const typeLabel = (type, plural = false) => (type === "gpu" ? (plural ? "graphics cards" : "graphics card") : (plural ? "desktop processors" : "desktop processor"));
export const tierLabel = (item) => (item.tier == null ? null : item.type === "gpu" ? `${item.tier}0-class` : `${item.type === "gpu" ? "" : ""}${item.tier}-series`);

/** Title and description for a part page. Titles stay under ~60 characters where the name allows. */
export function seo(item, perf, cpi) {
  const adj = adjust(item.msrp_usd, item.year, cpi);
  const p = perf.items[item.id];
  const bits = [`${item.name} (${item.year})`];
  if (item.msrp_usd != null) bits.push(`launched at ${fmtUsd(item.msrp_usd)}, about ${fmtUsd(adj)} in ${cpi.latest_year} dollars`);
  if (p) bits.push(`Blender ${p.blender_major}.x render score ${fmtNum(p.median)}`);
  const specs = item.type === "gpu"
    ? [item.memory_mb && `${fmtMem(item.memory_mb)} ${item.memory_type || "VRAM"}`, item.power_w && `${item.power_w} W`, item.arch].filter(Boolean).join(", ")
    : [item.cores && `${item.cores} cores / ${item.threads} threads`, item.power_w && `${item.power_w} W`, item.arch].filter(Boolean).join(", ");
  return {
    title: `${item.name}: specs, launch price in today's dollars${p ? ", Blender score" : ""} | Specdle`,
    description: `${bits.join("; ")}. ${specs}. Full specs, the ${tierLabel(item) || "same-tier"} lineage, and what to compare it with.`,
  };
}
