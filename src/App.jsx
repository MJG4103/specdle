import { useCallback, useEffect, useState } from "react";
import { SITE_NAME } from "./config.js";
import { todayKey, dateFromNumber, puzzleFor, puzzleNumber, START_DATE, dayDiff } from "./game/data.js";
import { loadStats, effectiveStreak } from "./game/storage.js";
import Game from "./pages/Game.jsx";
import Archive from "./pages/Archive.jsx";
import Data from "./pages/Data.jsx";
import Privacy from "./pages/Privacy.jsx";
import StatsModal from "./components/StatsModal.jsx";
import HelpModal from "./components/HelpModal.jsx";
import { installAnalytics } from "./analytics.js";
import TechBackground from "./components/TechBackground.jsx";

/** Tiny hash router: #/ play today, #/day/YYYY-MM-DD, #/archive, #/data, #/privacy. */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const on = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  const [today, setToday] = useState(todayKey());
  const [stats, setStats] = useState(loadStats);
  const [modal, setModal] = useState(() => (loadStats().played === 0 && !localStorage.getItem("specdle:seen-help") ? "help" : null));

  // Roll over at local midnight without a reload.
  useEffect(() => {
    const t = setInterval(() => { const k = todayKey(); if (k !== today) setToday(k); }, 30000);
    return () => clearInterval(t);
  }, [today]);
  useEffect(() => { installAnalytics(); }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    try { localStorage.setItem("specdle:seen-help", "1"); } catch { /* ignore */ }
  }, []);

  const yesterday = dateFromNumber(puzzleNumber(today) - 1);
  const streak = effectiveStreak(stats, today, yesterday);

  let page;
  const dayMatch = hash.match(/^#\/day\/(\d{4}-\d{2}-\d{2})$/);
  if (hash === "#/archive") page = <Archive todayKey={today} />;
  else if (hash === "#/data") page = <Data />;
  else if (hash === "#/privacy") page = <Privacy />;
  else {
    const key = dayMatch ? dayMatch[1] : today;
    const inRange = dayDiff(START_DATE, key) >= 0 && dayDiff(key, today) >= 0;
    const puzzle = inRange ? puzzleFor(key) : null;
    page = puzzle
      ? <Game puzzle={puzzle} isToday={key === today} todayKey={today} yesterdayKey={yesterday} onStats={setStats} streak={streak} />
      : <p className="text-sm text-zinc-500">{dayDiff(START_DATE, today) < 0 ? `First puzzle on ${START_DATE}.` : "No puzzle for that date."}</p>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4">
      <TechBackground />
      <header className="flex items-center justify-between border-b border-zinc-200/70 py-3 dark:border-zinc-800/70">
        <button onClick={() => setModal("help")} aria-label="How to play" className="rounded px-2 py-1 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">?</button>
        <a href="#/" className="text-2xl font-black tracking-tight">{SITE_NAME}</a>
        <div className="flex gap-1">
          <a href="#/archive" aria-label="Archive" title="Archive" className="rounded px-2 py-1 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">▤</a>
          <button onClick={() => setModal("stats")} aria-label="Statistics" title="Statistics" className="rounded px-2 py-1 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">▥</button>
        </div>
      </header>
      <main className="flex-1 py-5">{page}</main>
      <footer className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-200 py-4 text-xs text-zinc-500 dark:border-zinc-800">
        <a href="#/data" className="hover:underline">Data & attribution</a>
        <a href="#/privacy" className="hover:underline">Privacy</a>
        <a href="#/archive" className="hover:underline">Archive</a>
        <a href="/gpu/" className="hover:underline">GPU specs</a>
        <a href="/cpu/" className="hover:underline">CPU specs</a>
        <span className="ml-auto">Data CC BY-SA 4.0 · Wikipedia</span>
      </footer>
      {modal === "stats" && <StatsModal stats={stats} streak={streak} onClose={closeModal} />}
      {modal === "help" && <HelpModal onClose={closeModal} />}
    </div>
  );
}
