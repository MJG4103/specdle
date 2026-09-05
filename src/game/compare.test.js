import { describe, it, expect } from "vitest";
import { compareGuess, columnsFor, isWin } from "./compare.js";
import { shareText, cellEmoji } from "./share.js";
import { buildIndex, search } from "./search.js";
import { recordResult, emptyStats, effectiveStreak } from "./storage.js";

const rtx3070 = { id: "nvidia-geforce-rtx-3070", type: "gpu", vendor: "Nvidia", name: "GeForce RTX 3070", year: 2020, msrp_usd: 499, memory_mb: 8192, power_w: 220, tier: 7, arch: "Ampere" };
const rtx3080 = { id: "nvidia-geforce-rtx-3080", type: "gpu", vendor: "Nvidia", name: "GeForce RTX 3080", year: 2020, msrp_usd: 699, memory_mb: 10240, power_w: 320, tier: 8, arch: "Ampere" };
const rx6800 = { id: "amd-radeon-rx-6800", type: "gpu", vendor: "AMD", name: "Radeon RX 6800", year: 2020, msrp_usd: 579, memory_mb: 16384, power_w: 250, tier: 8, arch: "RDNA 2" };
const gtx970 = { id: "nvidia-geforce-gtx-970", type: "gpu", vendor: "Nvidia", name: "GeForce GTX 970", year: 2014, msrp_usd: 329, memory_mb: 4096, power_w: 148, tier: 7, arch: "Maxwell" };
const titan = { id: "nvidia-titan-rtx", type: "gpu", vendor: "Nvidia", name: "Titan RTX", year: 2018, msrp_usd: 2499, memory_mb: 24576, power_w: 280, tier: null, arch: "Turing" };
const q6600 = { id: "intel-core-2-quad-q6600", type: "cpu", vendor: "Intel", name: "Core 2 Quad Q6600", year: 2007, msrp_usd: 851, cores: 4, threads: 4, power_w: 105, tier: null, arch: "LGA 775" };
const i7 = { id: "intel-core-i7-4770k", type: "cpu", vendor: "Intel", name: "Core i7 4770K", year: 2013, msrp_usd: 350, cores: 4, threads: 8, power_w: 84, tier: 7, arch: "LGA 1150" };

const byKey = (row) => Object.fromEntries(row.map((c) => [c.key, c]));

describe("compareGuess", () => {
  it("marks every cell exact for the right answer", () => {
    expect(compareGuess(rtx3070, rtx3070).every((c) => c.state === "exact")).toBe(true);
    expect(isWin(rtx3070, rtx3070)).toBe(true);
  });
  it("gives direction toward the answer and yellow within tolerance", () => {
    const r = byKey(compareGuess(rtx3070, rtx3080));
    expect(r.vendor.state).toBe("exact");
    expect(r.year.state).toBe("exact");
    expect(r.msrp_usd).toMatchObject({ state: "far", dir: "up" });     // 499 -> 699 is >10%
    expect(r.memory_mb).toMatchObject({ state: "far", dir: "up" });
    expect(r.power_w).toMatchObject({ state: "far", dir: "up" });
    expect(r.tier).toMatchObject({ state: "far", dir: "up" });
    expect(r.arch.state).toBe("exact");
  });
  it("yellow for a year within one and a price within ten percent", () => {
    const near = { ...rx6800, year: 2021, msrp_usd: 540 };
    const r = byKey(compareGuess(near, rx6800));
    expect(r.year).toMatchObject({ state: "close", dir: "down" });
    expect(r.msrp_usd).toMatchObject({ state: "close", dir: "up" });
  });
  it("points down when the answer is older and smaller", () => {
    const r = byKey(compareGuess(rtx3080, gtx970));
    expect(r.year).toMatchObject({ state: "far", dir: "down" });
    expect(r.arch.state).toBe("far");
  });
  it("hides a column the answer has no value for, and shows ? when the guess lacks one", () => {
    expect(columnsFor(q6600).map((c) => c.key)).not.toContain("tier");
    expect(columnsFor(titan).map((c) => c.key)).not.toContain("tier");
    const r = byKey(compareGuess(titan, rtx3080));
    expect(r.tier).toMatchObject({ state: "unknown", text: "?" });
  });
  it("uses CPU columns for CPU boards", () => {
    const keys = columnsFor(i7).map((c) => c.key);
    expect(keys).toEqual(["vendor", "year", "msrp_usd", "cores", "power_w", "tier", "arch"]);
    expect(byKey(compareGuess(i7, i7)).cores.text).toBe("4 (8T)");
  });
});

describe("shareText", () => {
  it("renders a Wordle-style grid with the score", () => {
    const rows = [compareGuess(gtx970, rtx3080), compareGuess(rtx3080, rtx3080)];
    const text = shareText({ number: 42, type: "gpu", rows, won: true });
    const lines = text.split("\n");
    expect(lines[0]).toBe("Specdle #42 GPU 2/8");
    expect(lines[1]).toBe("🟩⬆️⬆️⬆️⬆️⬆️🟥");
    expect(lines[2]).toBe("🟩🟩🟩🟩🟩🟩🟩");
    expect(lines[3]).toMatch(/^https:\/\//);
  });
  it("shows X on a loss and a white square for unknown", () => {
    expect(shareText({ number: 1, type: "cpu", rows: [], won: false })).toMatch(/CPU X\/8/);
    expect(cellEmoji({ state: "unknown" })).toBe("⬜");
  });
});

describe("search", () => {
  const index = buildIndex([rtx3070, rtx3080, rx6800, gtx970, titan, q6600, i7]);
  it("matches tokens in any order and ranks the exact name first", () => {
    expect(search(index, "3070 rtx")[0]).toBe(rtx3070);
    expect(search(index, "rtx 30").map((i) => i.id)).toEqual([rtx3070.id, rtx3080.id]);
  });
  it("matches without spaces and filters by board type", () => {
    expect(search(index, "4770k")[0]).toBe(i7);
    expect(search(index, "rtx3080")[0]).toBe(rtx3080);
    expect(search(index, "core", { type: "gpu" })).toEqual([]);
  });
  it("excludes already-guessed items", () => {
    expect(search(index, "3070", { exclude: new Set([rtx3070.id]) })).toEqual([]);
  });
});

describe("stats", () => {
  it("counts wins, builds streaks across consecutive days, and resets on a loss", () => {
    let s = emptyStats();
    s = recordResult(s, { dateKey: "2026-09-05", yesterdayKey: "2026-09-04", won: true, guessCount: 3 });
    s = recordResult(s, { dateKey: "2026-09-06", yesterdayKey: "2026-09-05", won: true, guessCount: 5 });
    expect(s).toMatchObject({ played: 2, won: 2, streak: 2, maxStreak: 2 });
    expect(s.dist[2]).toBe(1);
    expect(s.dist[4]).toBe(1);
    s = recordResult(s, { dateKey: "2026-09-06", yesterdayKey: "2026-09-05", won: true, guessCount: 5 });
    expect(s.played).toBe(2); // idempotent for the same day
    s = recordResult(s, { dateKey: "2026-09-08", yesterdayKey: "2026-09-07", won: true, guessCount: 1 });
    expect(s.streak).toBe(1); // skipped a day
    s = recordResult(s, { dateKey: "2026-09-09", yesterdayKey: "2026-09-08", won: false, guessCount: 8 });
    expect(s.streak).toBe(0);
    expect(effectiveStreak({ ...s, streak: 4, lastPlayed: "2026-09-01" }, "2026-09-09", "2026-09-08")).toBe(0);
  });
});
