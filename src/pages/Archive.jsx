import { archiveDates, puzzleFor } from "../game/data.js";
import { loadDay } from "../game/storage.js";

export default function Archive({ todayKey }) {
  const dates = archiveDates(todayKey);
  return (
    <section>
      <h2 className="mb-1 text-lg font-bold">Archive</h2>
      <p className="mb-4 text-sm text-zinc-500">Past puzzles. Playing them doesn't affect your streak.</p>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-700 dark:bg-zinc-900">
        {dates.map((d) => {
          const p = puzzleFor(d);
          if (!p) return null;
          const s = loadDay(d);
          const status = s.done ? (s.won ? `won in ${s.guesses.length}` : "lost") : s.guesses.length ? "in progress" : "";
          return (
            <li key={d}>
              <a href={d === todayKey ? "#/" : `#/day/${d}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <span>#{p.number} <span className="text-zinc-500">· {d} · {p.type.toUpperCase()}</span></span>
                <span className={s.done ? (s.won ? "text-green-700 dark:text-green-400" : "text-red-600") : "text-zinc-400"}>{status || "play"}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
