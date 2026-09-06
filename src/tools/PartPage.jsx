// One part: the page a search for "rtx 3070 launch price" or "5800x3d specs" should land on.
// Everything here is static; the only script on the page is the analytics click hook added by
// the prerender step. Sections appear only when the data behind them exists.
import Layout from "./Layout.jsx";
import {
  adjust, cpiLabel, scoreRank, lineage, similar, amazonUrl, pathFor, hasPage,
  fmtUsd, fmtNum, fmtMem, fmtDate, typeLabel, tierLabel,
} from "./model.js";

function Row({ label, children }) {
  if (children == null || children === "") return null;
  return (
    <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
      <th scope="row" className="py-1.5 pr-4 text-left font-normal text-zinc-500">{label}</th>
      <td className="py-1.5 font-medium">{children}</td>
    </tr>
  );
}

function Stat({ label, value, sub }) {
  if (value == null) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

export default function PartPage({ item, items, perf, cpi, slugs }) {
  const p = perf.items[item.id];
  const adj = adjust(item.msrp_usd, item.year, cpi);
  const rank = scoreRank(item, items, perf);
  const line = lineage(item, items);
  const near = similar(item, items, perf);
  const amazon = amazonUrl(item.name);
  const kind = typeLabel(item.type);
  const link = (i) => (hasPage(i, perf) ? <a href={pathFor(i, slugs)} className="underline">{i.name}</a> : i.name);
  const yearsOn = cpi.latest_year - item.year;

  return (
    <Layout crumbs={[{ label: item.type === "gpu" ? "Graphics cards" : "Processors", href: `/${item.type}/` }, { label: item.series }, { label: item.name }]}>
      <article className="space-y-8">
        <header>
          <h1 className="text-3xl font-black tracking-tight">{item.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {item.vendor} {kind} · {item.series} · launched {fmtDate(item)}{item.oem ? " · OEM part" : ""}
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Launch price" value={fmtUsd(item.msrp_usd)} sub={adj != null ? `≈ ${fmtUsd(adj)} in ${cpi.latest_year} dollars` : item.price_local ? `launched at ${item.price_local}` : null} />
          <Stat label={`Blender ${p ? p.blender_major : ""}.x render score`} value={p ? fmtNum(p.median) : null} sub={rank ? `#${rank.rank} of ${rank.of} scored ${typeLabel(item.type, true)}` : null} />
          {item.type === "gpu"
            ? <Stat label="Memory" value={fmtMem(item.memory_mb)} sub={[item.memory_type, item.bus_width_bit && `${item.bus_width_bit}-bit`].filter(Boolean).join(" · ") || null} />
            : <Stat label="Cores / threads" value={item.cores != null ? `${item.cores} / ${item.threads}` : null} sub={item.cache_mb != null ? `${fmtNum(item.cache_mb, 1)} MB ${item.cache_column || ""} cache`.trim() : null} />}
          <Stat label="Rated power" value={item.power_w != null ? `${item.power_w} W` : null} sub={item.power_max_w ? `up to ${item.power_max_w} W turbo` : item.power_column && item.power_column !== "TDP" ? item.power_column : null} />
        </div>

        {amazon && (
          <p>
            <a href={amazon} target="_blank" rel="sponsored noopener" data-track={`affiliate/${item.id}`}
               className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Check the price on Amazon
            </a>
            <span className="ml-3 text-xs text-zinc-500">Affiliate link. Street prices move; the figures on this page are launch prices.</span>
          </p>
        )}

        {item.msrp_usd != null && adj != null && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Launch price in today's dollars</h2>
            <p>
              The {item.name} launched at <strong>{fmtUsd(item.msrp_usd)}</strong> in {item.year}. Adjusted with the U.S. Consumer Price Index, that is about{" "}
              <strong>{fmtUsd(adj)}</strong> in {cpiLabel(cpi)}{yearsOn > 0 ? `, a ${Math.round((adj / item.msrp_usd - 1) * 100)}% rise over ${yearsOn} year${yearsOn === 1 ? "" : "s"}` : ""}.
              {rank?.pointsPer100 != null && <> At its launch price that is <strong>{fmtNum(rank.pointsPer100, 1)} Blender points per $100</strong>.</>}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Method: launch price × (CPI {cpi.latest_year} average ÷ CPI {item.year} average), calendar-year averages of BLS series CPIAUCSL. {cpi.latest_months < 12 ? `${cpi.latest_year} covers ${cpi.latest_months} months so far.` : ""}
            </p>
          </section>
        )}

        {p && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Blender rendering score</h2>
            <p>
              Median score <strong>{fmtNum(p.median)}</strong> (middle half of runs {fmtNum(p.p25)}–{fmtNum(p.p75)}) across {fmtNum(p.runs)} community runs on Blender {p.blender_major}.x with the {p.backend} backend.
              {rank && <> That is <strong>#{rank.rank} of {rank.of}</strong> {typeLabel(item.type, true)} in our dataset with a score{rank.seriesOf > 1 ? <>, and #{rank.seriesRank} of {rank.seriesOf} in the {item.series}</> : null}.</>}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              This is a <strong>rendering</strong> benchmark (samples per minute over the monster, junkshop and classroom scenes), not a gaming benchmark. It says how fast the part renders in Blender's Cycles engine and nothing about frame rates. Source: Blender Open Data, CC0, snapshot {perf.snapshot_date}.
            </p>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-xl font-bold">Specifications</h2>
          <table className="w-full text-sm">
            <tbody>
              <Row label="Vendor">{item.vendor}</Row>
              <Row label="Series">{item.series}</Row>
              <Row label="Launched">{fmtDate(item)}</Row>
              <Row label="Launch price">{item.msrp_usd != null ? `${fmtUsd(item.msrp_usd)}${item.vendor === "Intel" ? " (1,000-unit price)" : ""}` : item.price_local}</Row>
              {item.type === "gpu" ? (
                <>
                  <Row label="Architecture">{item.arch}</Row>
                  <Row label="Chip">{item.codename}</Row>
                  <Row label="Memory">{item.memory_mb != null ? `${fmtMem(item.memory_mb)}${item.memory_variants_mb ? ` (also ${item.memory_variants_mb.slice(1).map(fmtMem).join(", ")})` : ""}` : null}</Row>
                  <Row label="Memory type">{item.memory_type}</Row>
                  <Row label="Memory bus">{item.bus_width_bit != null ? `${item.bus_width_bit}-bit` : null}</Row>
                  <Row label="Memory bandwidth">{item.bandwidth_gbs != null ? `${fmtNum(item.bandwidth_gbs, 1)} GB/s` : null}</Row>
                  <Row label="Core clock">{item.clock_mhz != null ? `${fmtNum(item.clock_mhz)} MHz${item.boost_mhz ? ` (boost ${fmtNum(item.boost_mhz)} MHz)` : ""}` : null}</Row>
                  <Row label="FP32 compute">{item.fp32_tflops != null ? `${fmtNum(item.fp32_tflops, 2)} TFLOPS` : null}</Row>
                  <Row label="Rated power">{item.power_w != null ? `${item.power_w} W (${item.power_column || "TDP"})` : null}</Row>
                  <Row label="Transistors">{item.transistors_m != null ? (item.transistors_m >= 1000 ? `${fmtNum(item.transistors_m / 1000, 1)} billion` : `${fmtNum(item.transistors_m)} million`) : null}</Row>
                  <Row label="Die size">{item.die_mm2 != null ? `${fmtNum(item.die_mm2, 1)} mm²` : null}</Row>
                  <Row label="Process">{item.fab_nm != null ? `${item.fab_nm} nm` : null}</Row>
                  <Row label="Bus interface">{item.bus_interface}</Row>
                  <Row label="Tier">{tierLabel(item)}</Row>
                </>
              ) : (
                <>
                  <Row label="Socket">{item.arch}</Row>
                  <Row label="Cores / threads">{item.cores != null ? `${item.cores} / ${item.threads}` : null}</Row>
                  <Row label="Base clock">{item.clock_ghz != null ? `${fmtNum(item.clock_ghz, 2)} GHz` : null}</Row>
                  <Row label="Boost clock">{item.boost_ghz != null ? `${fmtNum(item.boost_ghz, 2)} GHz` : null}</Row>
                  <Row label={`${item.cache_column || "Last-level"} cache`}>{item.cache_mb != null ? `${fmtNum(item.cache_mb, 1)} MB` : null}</Row>
                  <Row label="Rated power">{item.power_w != null ? `${item.power_w} W (${item.power_column || "TDP"})${item.power_max_w ? `, up to ${item.power_max_w} W` : ""}` : null}</Row>
                  <Row label="Integrated graphics">{item.igpu}</Row>
                  <Row label="Tier">{tierLabel(item)}</Row>
                </>
              )}
            </tbody>
          </table>
          {item.verified && <p className="mt-1 text-xs text-zinc-500">Verified against a manufacturer document: {item.verified.join(", ")}.</p>}
          {item.disputed && <p className="mt-1 text-xs text-zinc-500">Conflicting sources for: {item.disputed.join(", ")}. Treat those figures with care.</p>}
        </section>

        {line.length > 1 && (
          <section>
            <h2 className="mb-2 text-xl font-bold">The {item.vendor} {tierLabel(item)} over time</h2>
            <p className="mb-2 text-sm text-zinc-500">{item.vendor} {typeLabel(item.type, true)} in the same tier around this one, oldest first, re-releases left out. Prices in launch dollars and in {cpi.latest_year} dollars; scores are Blender {perf.blender_major}.x medians where they exist.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <tr><th className="py-1 pr-3">Part</th><th className="py-1 pr-3">Year</th><th className="py-1 pr-3">Launch price</th><th className="py-1 pr-3">In {cpi.latest_year} $</th><th className="py-1 pr-3">Blender</th></tr>
                </thead>
                <tbody>
                  {line.map((i) => (
                    <tr key={i.id} className={`border-b border-zinc-100 last:border-0 dark:border-zinc-800 ${i.id === item.id ? "font-semibold" : ""}`}>
                      <td className="py-1 pr-3">{i.id === item.id ? i.name : link(i)}</td>
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
        )}

        {near.length > 0 && (
          <section>
            <h2 className="mb-2 text-xl font-bold">Compare with</h2>
            <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              {near.map((i) => (
                <li key={i.id}>
                  <a href={pathFor(i, slugs)} className="underline">{i.name}</a>
                  <span className="text-zinc-500"> · {i.year}{i.msrp_usd != null ? ` · ${fmtUsd(i.msrp_usd)}` : ""}{perf.items[i.id] ? ` · ${fmtNum(perf.items[i.id].median)}` : ""}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900">
          <p>
            <strong>Think you know your hardware?</strong> Specdle is a daily game: name the {kind} from its specs in eight guesses.{" "}
            <a href="/" className="underline">Play today's puzzle</a>.
          </p>
        </section>
      </article>
    </Layout>
  );
}
