// The hint logic. compareGuess() turns one guess into a row of cells; every cell says how
// the guess relates to the answer on one spec. Pure functions, unit-tested in compare.test.js.
import { formatMemory, formatPrice, formatTier } from "./data.js";

// Column definitions per board type. `close` returns true when a numeric miss is near
// enough to colour yellow; exact matches are green; everything else grey with an arrow.
const COLUMNS = {
  gpu: [
    { key: "vendor", label: "Vendor", kind: "cat", get: (i) => i.vendor, fmt: (i) => i.vendor },
    { key: "year", label: "Year", kind: "num", get: (i) => i.year, fmt: (i) => String(i.year), close: (a, b) => Math.abs(a - b) <= 1 },
    { key: "msrp_usd", label: "Launch price", kind: "num", get: (i) => i.msrp_usd, fmt: (i) => formatPrice(i.msrp_usd), close: within(0.1) },
    { key: "memory_mb", label: "VRAM", kind: "num", get: (i) => i.memory_mb, fmt: (i) => formatMemory(i.memory_mb) },
    { key: "power_w", label: "Rated power", kind: "num", get: (i) => i.power_w, fmt: (i) => `${i.power_w} W`, close: within(0.1) },
    { key: "tier", label: "Tier", kind: "num", get: (i) => i.tier, fmt: formatTier },
    { key: "arch", label: "Arch", kind: "cat", get: (i) => i.arch, fmt: (i) => i.arch },
  ],
  cpu: [
    { key: "vendor", label: "Vendor", kind: "cat", get: (i) => i.vendor, fmt: (i) => i.vendor },
    { key: "year", label: "Year", kind: "num", get: (i) => i.year, fmt: (i) => String(i.year), close: (a, b) => Math.abs(a - b) <= 1 },
    { key: "msrp_usd", label: "Launch price", kind: "num", get: (i) => i.msrp_usd, fmt: (i) => formatPrice(i.msrp_usd), close: within(0.1) },
    { key: "cores", label: "Cores", kind: "num", get: (i) => i.cores, fmt: (i) => `${i.cores}` + (i.threads ? ` (${i.threads}T)` : "") },
    { key: "power_w", label: "Rated power", kind: "num", get: (i) => i.power_w, fmt: (i) => `${i.power_w} W`, close: within(0.1) },
    { key: "tier", label: "Tier", kind: "num", get: (i) => i.tier, fmt: formatTier },
    { key: "arch", label: "Socket", kind: "cat", get: (i) => i.arch, fmt: (i) => i.arch },
  ],
};

function within(frac) {
  return (guess, answer) => Math.abs(guess - answer) <= Math.abs(answer) * frac;
}

/** Columns shown for a given answer: a column whose answer value is missing is hidden
 *  for the whole day rather than shown as a blank (Core 2 chips have no tier, for example). */
export function columnsFor(answer) {
  return COLUMNS[answer.type].filter((c) => c.get(answer) != null);
}

/**
 * One row of hints. Each cell: { key, label, text, state, dir }
 *   state: "exact" | "close" | "far" | "unknown"
 *   dir:   "up" (answer is higher than the guess) | "down" | null
 */
export function compareGuess(guess, answer) {
  return columnsFor(answer).map((col) => {
    const g = col.get(guess);
    const a = col.get(answer);
    const cell = { key: col.key, label: col.label, text: col.fmt(guess), state: "far", dir: null };
    if (g == null) {
      cell.state = "unknown";
      cell.text = "?";
      return cell;
    }
    if (col.kind === "cat") {
      cell.state = g === a ? "exact" : "far";
      return cell;
    }
    if (g === a) {
      cell.state = "exact";
    } else {
      cell.dir = a > g ? "up" : "down";
      cell.state = col.close && col.close(g, a) ? "close" : "far";
    }
    return cell;
  });
}

export function isWin(guess, answer) {
  return guess.id === answer.id;
}
