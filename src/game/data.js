// Dataset and schedule, bundled at build time. items.json is the CC BY-SA derived dataset
// (see data/LICENSE.md); schedule.json maps each date to the answer's id.
import dataset from "../../data/items.json";
import schedule from "../../data/schedule.json";

export const ITEMS = dataset.items;
export const SOURCES = dataset.sources;
export const DATASET_GENERATED = dataset.generated;
export const BY_ID = new Map(ITEMS.map((i) => [i.id, i]));
export const START_DATE = schedule.start; // "YYYY-MM-DD", puzzle #1

/** Local calendar date as YYYY-MM-DD. Wordle-style: the puzzle changes at local midnight. */
export function todayKey(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Days between two YYYY-MM-DD strings, DST-safe (UTC arithmetic on calendar dates). */
export function dayDiff(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

export function puzzleNumber(dateKey) {
  return dayDiff(START_DATE, dateKey) + 1;
}

export function dateFromNumber(n) {
  const [y, m, d] = START_DATE.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n - 1));
  return t.toISOString().slice(0, 10);
}

/** The puzzle for a date, or null if the schedule has nothing for it. */
export function puzzleFor(dateKey) {
  const id = schedule.days[dateKey];
  const answer = id ? BY_ID.get(id) : null;
  if (!answer) return null;
  return { dateKey, number: puzzleNumber(dateKey), answer, type: answer.type };
}

/** All dates from the start through `untilKey`, newest first, for the archive. */
export function archiveDates(untilKey) {
  const n = puzzleNumber(untilKey);
  const out = [];
  for (let i = n; i >= 1; i--) out.push(dateFromNumber(i));
  return out;
}

export function formatMemory(mb) {
  if (mb == null) return "—";
  return mb % 1024 === 0 && mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`;
}

export function formatPrice(usd) {
  return usd == null ? "—" : `$${usd.toLocaleString("en-US")}`;
}

export function formatTier(item) {
  if (item.tier == null) return "—";
  return item.type === "gpu" ? `${item.tier}0-class` : `${item.tier}-series`;
}
