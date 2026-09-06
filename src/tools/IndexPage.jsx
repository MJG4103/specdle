// /gpu/ and /cpu/: every part with a page, grouped by series, newest series first.
import Layout from "./Layout.jsx";
import { adjust, hasPage, pathFor, fmtUsd, fmtNum, typeLabel } from "./model.js";

export default function IndexPage({ type, items, perf, cpi, slugs }) {
  const parts = items.filter((i) => i.type === type);
  const groups = new Map();
  for (const i of parts) {
    if (!groups.has(i.series)) groups.set(i.series, []);
    groups.get(i.series).push(i);
  }
  const ordered = [...groups.entries()].sort((a, b) => Math.max(...b[1].map((i) => i.year)) - Math.max(...a[1].map((i) => i.year)));
  const withPages = parts.filter((i) => hasPage(i, perf)).length;
  const scoredCount = parts.filter((i) => perf.items[i.id]).length;
  const label = type === "gpu" ? "Graphics cards" : "Desktop processors";
  return (
    <Layout crumbs={[{ label }]}>
      <h1 className="text-3xl font-black tracking-tight">{label}: specs, launch prices in today's dollars, Blender scores</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {parts.length} desktop {typeLabel(type, true)} from 2006 on, from Wikipedia's list tables. {withPages} have a page: every part with a US launch price
        (shown as launched and in {cpi.latest_year} dollars) or a Blender {perf.blender_major}.x rendering score ({scoredCount} parts, from {fmtNum(perf.devices.length)} community-benchmarked devices).
        Scores are rendering scores, not game frame rates.
      </p>
      {ordered.map(([series, list]) => (
        <section key={series} className="mt-6">
          <h2 className="mb-1 text-lg font-bold">{series}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr><th className="py-1 pr-3">Part</th><th className="py-1 pr-3">Year</th><th className="py-1 pr-3">Launch price</th><th className="py-1 pr-3">In {cpi.latest_year} $</th><th className="py-1 pr-3">Blender</th></tr>
              </thead>
              <tbody>
                {list.sort((a, b) => (b.msrp_usd || 0) - (a.msrp_usd || 0) || a.name.localeCompare(b.name)).map((i) => (
                  <tr key={i.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                    <td className="py-1 pr-3">{hasPage(i, perf) ? <a href={pathFor(i, slugs)} className="underline">{i.name}</a> : <span className="text-zinc-500">{i.name}</span>}{i.oem ? <span className="text-xs text-zinc-500"> OEM</span> : null}</td>
                    <td className="py-1 pr-3">{i.year}</td>
                    <td className="py-1 pr-3">{fmtUsd(i.msrp_usd) || "—"}</td>
                    <td className="py-1 pr-3">{fmtUsd(adjust(i.msrp_usd, i.year, cpi)) || "—"}</td>
                    <td className="py-1 pr-3">{perf.items[i.id] ? fmtNum(perf.items[i.id].median) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </Layout>
  );
}
