// Shell for the pre-rendered tool pages. No hooks, no browser APIs: this renders to a string at
// build time. Links are real paths; the game itself lives at "/".
import { SITE_NAME } from "../config.js";

export default function Layout({ children, crumbs = [] }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/70 py-3 dark:border-zinc-800/70">
        <a href="/" className="text-2xl font-black tracking-tight">{SITE_NAME}</a>
        <nav className="flex gap-4 text-sm">
          <a href="/" className="hover:underline">Play today's puzzle</a>
          <a href="/gpu/" className="hover:underline">GPUs</a>
          <a href="/cpu/" className="hover:underline">CPUs</a>
        </nav>
      </header>
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="pt-3 text-xs text-zinc-500">
          {crumbs.map((c, i) => (
            <span key={c.href || c.label}>
              {i > 0 && <span className="mx-1">/</span>}
              {c.href ? <a href={c.href} className="hover:underline">{c.label}</a> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <main className="flex-1 py-5">{children}</main>
      <footer className="space-y-2 border-t border-zinc-200 py-4 text-xs text-zinc-500 dark:border-zinc-800">
        <p>
          Specs from Wikipedia list tables, <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> (exact revisions on the{" "}
          <a className="underline" href="/#/data">data page</a>). Rendering scores from{" "}
          <a className="underline" href="https://opendata.blender.org/">Blender Open Data</a>, CC0. Inflation from the U.S. Bureau of Labor Statistics CPI via FRED, public domain.
          Downloads: <a className="underline" href="/items.json">items.json</a>, <a className="underline" href="/perf.json">perf.json</a>, <a className="underline" href="/cpi.json">cpi.json</a>.
        </p>
        <p>
          As an Amazon Associate, {SITE_NAME} earns from qualifying purchases. GeForce, RTX and Nvidia are trademarks of Nvidia Corporation; Radeon and Ryzen of Advanced Micro Devices, Inc.; Intel and Intel Core of Intel Corporation. {SITE_NAME} is not affiliated with any of them.
          {" "}<a className="underline" href="/#/privacy">Privacy</a>
        </p>
      </footer>
    </div>
  );
}
