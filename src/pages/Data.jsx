import { SOURCES, DATASET_GENERATED, ITEMS } from "../game/data.js";

export default function Data() {
  const gpus = ITEMS.filter((i) => i.type === "gpu").length;
  const cpus = ITEMS.length - gpus;
  return (
    <section className="prose-sm space-y-4 text-sm">
      <h2 className="text-lg font-bold">Data and attribution</h2>
      <p>
        Specdle's dataset is {gpus} desktop graphics cards and {cpus} desktop processors, built from
        tables on English Wikipedia. Wikipedia text is licensed{" "}
        <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, so this
        derived dataset is published under the same license. Download it:{" "}
        <a className="underline" href="/items.json" download>items.json</a> (generated {DATASET_GENERATED}).
      </p>
      <p>
        The same data powers the spec pages: <a className="underline" href="/gpu/">graphics cards</a> and{" "}
        <a className="underline" href="/cpu/">processors</a>, each with its launch price in today's dollars and, where the
        community has benchmarked it, a Blender rendering score. Two companion datasets sit beside items.json:{" "}
        <a className="underline" href="/perf.json" download>perf.json</a>, median scores derived from{" "}
        <a className="underline" href="https://opendata.blender.org/">Blender Open Data</a> (CC0), and{" "}
        <a className="underline" href="/cpi.json" download>cpi.json</a>, calendar-year averages of the U.S. Consumer Price Index
        (BLS via FRED, public domain). A Blender score is a rendering score, not a gaming benchmark.
      </p>
      <h3 className="font-semibold">Sources (exact revisions used)</h3>
      <ul className="list-disc space-y-1 pl-5">
        {SOURCES.map((s) => (
          <li key={s.revid}><a className="underline" href={s.url}>{s.title}</a> — revision {s.revid}. Contributors are listed in the page history.</li>
        ))}
      </ul>
      <h3 className="font-semibold">How the values are defined</h3>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Year</strong>: launch year as the table lists it (usually availability, occasionally the announcement).</li>
        <li><strong>Launch price</strong>: US launch price in whole dollars. Intel prices are the 1,000-unit tray price. Parts launched only in another currency have no price and are never the answer.</li>
        <li><strong>Rated power</strong>: the maker's rated figure. Its name changed over time (TDP, typical board power, processor base power); the game treats them as one hint.</li>
        <li><strong>VRAM / cores</strong>: the base configuration where a part shipped in several; total cores on hybrid Intel chips.</li>
        <li><strong>Tier</strong>: the digit in the model name. A naming convention, not a benchmark.</li>
        <li><strong>Architecture / socket</strong>: the GPU architecture family per chip, or the CPU socket.</li>
      </ul>
      <p>
        No proprietary benchmark scores, product photos or box art are used; the only performance figure is the CC0 Blender score. Errors in the derived
        data are ours, not Wikipedia's. Spotted one? The whole pipeline is a public repository; corrections with
        a source are welcome.
      </p>
      <p className="text-xs text-zinc-500">
        GeForce, RTX and Nvidia are trademarks of Nvidia Corporation. Radeon and Ryzen are trademarks of Advanced
        Micro Devices, Inc. Intel and Intel Core are trademarks of Intel Corporation. Specdle is not affiliated with
        or endorsed by any of them.
      </p>
    </section>
  );
}
