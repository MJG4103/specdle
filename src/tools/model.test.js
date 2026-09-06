import { describe, it, expect } from "vitest";
import { buildSlugs, pathFor, hasPage, adjust, scoreRank, lineage, similar, seo, fmtDate, fmtMem } from "./model.js";
import dataset from "../../data/items.json";
import perf from "../../data/perf.json";
import cpi from "../../data/cpi.json";

const ITEMS = dataset.items;
const byName = (n) => ITEMS.find((i) => i.name === n);

describe("slugs and paths", () => {
  const slugs = buildSlugs(ITEMS);
  it("drops the vendor prefix and stays unique", () => {
    expect(slugs.get("nvidia-geforce-rtx-3070")).toBe("geforce-rtx-3070");
    expect(new Set(slugs.values()).size).toBe(ITEMS.length);
  });
  it("builds /type/slug/ paths", () => {
    expect(pathFor(byName("GeForce RTX 3070"), slugs)).toBe("/gpu/geforce-rtx-3070/");
    expect(pathFor(byName("Ryzen 7 5800X3D"), slugs)).toBe("/cpu/ryzen-7-5800x3d/");
  });
  it("gives a page only to parts with a price or a score", () => {
    const withPage = ITEMS.filter((i) => hasPage(i, perf)).length;
    expect(withPage).toBeGreaterThan(800);
    expect(withPage).toBeLessThan(ITEMS.length);
  });
});

describe("inflation", () => {
  it("scales by the calendar-year CPI ratio", () => {
    const c = { latest_year: 2026, latest_months: 7, years: { 2014: 236.7, 2026: 330.9 } };
    expect(adjust(329, 2014, c)).toBe(460);
    expect(adjust(null, 2014, c)).toBeNull();
    expect(adjust(100, 1999, c)).toBeNull();
  });
  it("covers every launch year in the dataset", () => {
    for (const i of ITEMS) expect(cpi.years[String(i.year)]).toBeDefined();
  });
});

describe("blender rank", () => {
  it("ranks the 5090 first among Nvidia-era GPUs and gives $ per 1,000 points", () => {
    const r = scoreRank(byName("GeForce RTX 5090"), ITEMS, perf);
    expect(r.rank).toBe(1);
    expect(r.pointsPer100).toBeGreaterThan(100);
  });
  it("returns null without a score", () => {
    expect(scoreRank(byName("GeForce 8800 GTX"), ITEMS, perf)).toBeNull();
  });
});

describe("lineage and neighbours", () => {
  it("caps long lineages around the part", () => {
    const l = lineage(byName("Core i5 12600K"), ITEMS);
    expect(l.length).toBe(16);
    expect(l.some((i) => i.name === "Core i5 12600K")).toBe(true);
  });
  it("drops re-release variants", () => {
    const l = lineage(byName("GeForce RTX 3070"), ITEMS);
    expect(l.some((i) => /GDDR5X|PhysX|Rev\./.test(i.name))).toBe(false);
  });
  it("lists the 70-class oldest first and includes the part itself", () => {
    const l = lineage(byName("GeForce RTX 3070"), ITEMS);
    expect(l[0].year).toBeLessThanOrEqual(l[l.length - 1].year);
    expect(l.some((i) => i.name === "GeForce GTX 1070")).toBe(true);
    expect(l.some((i) => i.name === "GeForce RTX 3070")).toBe(true);
    expect(l.every((i) => i.vendor === "Nvidia" && i.tier === 7)).toBe(true);
  });
  it("finds same-era neighbours with pages", () => {
    const s = similar(byName("GeForce RTX 3070"), ITEMS, perf);
    expect(s.length).toBeGreaterThan(0);
    expect(s.every((i) => hasPage(i, perf) && Math.abs(i.year - 2020) <= 1)).toBe(true);
  });
});

describe("formatting and seo", () => {
  it("formats dates and memory", () => {
    expect(fmtDate({ year: 2020, month: 10, date_precision: "month" })).toBe("October 2020");
    expect(fmtDate({ year: 2010, quarter: 3, date_precision: "quarter" })).toBe("Q3 2010");
    expect(fmtMem(8192)).toBe("8 GB");
    expect(fmtMem(320)).toBe("320 MB");
  });
  it("writes a title and a description that mention the price and score", () => {
    const s = seo(byName("GeForce RTX 3070"), perf, cpi);
    expect(s.title).toMatch(/GeForce RTX 3070/);
    expect(s.description).toMatch(/\$499/);
    expect(s.description).toMatch(/Blender/);
  });
});
