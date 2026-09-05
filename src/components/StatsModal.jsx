import Modal from "./Modal.jsx";
import { MAX_GUESSES } from "../config.js";

export default function StatsModal({ stats, streak, onClose }) {
  const pct = stats.played ? Math.round((100 * stats.won) / stats.played) : 0;
  const max = Math.max(1, ...stats.dist);
  return (
    <Modal title="Statistics" onClose={onClose}>
      <div className="mb-4 grid grid-cols-4 gap-2 text-center">
        {[["Played", stats.played], ["Win %", pct], ["Streak", streak], ["Best", stats.maxStreak]].map(([l, v]) => (
          <div key={l}><div className="text-2xl font-bold">{v}</div><div className="text-xs text-zinc-500">{l}</div></div>
        ))}
      </div>
      <h3 className="mb-2 text-sm font-semibold">Guess distribution</h3>
      <ol className="space-y-1">
        {Array.from({ length: MAX_GUESSES }, (_, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-right">{i + 1}</span>
            <div className="h-5 rounded bg-green-600 px-1 text-right text-white" style={{ width: `${Math.max(6, (100 * stats.dist[i]) / max)}%` }}>{stats.dist[i]}</div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-zinc-500">Stats live in this browser only. Nothing is sent anywhere.</p>
    </Modal>
  );
}
