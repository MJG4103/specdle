// Build-time entry: Vite bundles this for Node (`vite build --ssr`), and scripts/prerender.mjs
// calls pages() to get every static page as an HTML string with its metadata.
import { renderToStaticMarkup } from "react-dom/server";
import dataset from "../../data/items.json";
import perf from "../../data/perf.json";
import cpi from "../../data/cpi.json";
import PartPage from "./PartPage.jsx";
import IndexPage from "./IndexPage.jsx";
import { buildSlugs, pathFor, hasPage, seo, isoDate, fmtUsd, adjust } from "./model.js";

const ITEMS = dataset.items;
const slugs = buildSlugs(ITEMS);

function jsonLd(item) {
  const props = [];
  const add = (name, value, unit) => value != null && props.push({ "@type": "PropertyValue", name, value, ...(unit ? { unitText: unit } : {}) });
  add("Launch price", item.msrp_usd, "USD");
  add(`Launch price in ${cpi.latest_year} dollars`, adjust(item.msrp_usd, item.year, cpi), "USD");
  add("Rated power", item.power_w, "W");
  if (item.type === "gpu") {
    add("Memory", item.memory_mb != null ? item.memory_mb / 1024 : null, "GB");
    add("Memory type", item.memory_type);
    add("Memory bus width", item.bus_width_bit, "bit");
    add("FP32 compute", item.fp32_tflops, "TFLOPS");
    add("Architecture", item.arch);
  } else {
    add("Cores", item.cores);
    add("Threads", item.threads);
    add("Base clock", item.clock_ghz, "GHz");
    add("Boost clock", item.boost_ghz, "GHz");
    add("Socket", item.arch);
  }
  const p = perf.items[item.id];
  if (p) add(`Blender ${p.blender_major}.x rendering score (median, Blender Open Data)`, p.median);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    brand: { "@type": "Brand", name: item.vendor },
    category: item.type === "gpu" ? "Graphics card" : "Desktop processor",
    releaseDate: isoDate(item),
    description: seo(item, perf, cpi).description,
    additionalProperty: props,
  };
}

export function pages() {
  const out = [];
  for (const type of ["gpu", "cpu"]) {
    const label = type === "gpu" ? "Graphics cards" : "Desktop processors";
    out.push({
      path: `/${type}/`,
      title: `${label}: specs, launch prices in today's dollars, Blender scores | Specdle`,
      description: `Every desktop ${type === "gpu" ? "graphics card" : "processor"} since 2006 with its launch price, that price in ${cpi.latest_year} dollars, and a Blender rendering score where the community has benchmarked it.`,
      html: renderToStaticMarkup(<IndexPage type={type} items={ITEMS} perf={perf} cpi={cpi} slugs={slugs} />),
      jsonld: null,
      changefreq: "monthly",
    });
  }
  for (const item of ITEMS) {
    if (!hasPage(item, perf)) continue;
    const s = seo(item, perf, cpi);
    out.push({
      path: pathFor(item, slugs),
      title: s.title,
      description: s.description,
      html: renderToStaticMarkup(<PartPage item={item} items={ITEMS} perf={perf} cpi={cpi} slugs={slugs} />),
      jsonld: jsonLd(item),
      changefreq: "monthly",
    });
  }
  return out;
}

export const meta = { generated: dataset.generated, perfSnapshot: perf.snapshot_date, cpiYear: cpi.latest_year, count: ITEMS.length };
