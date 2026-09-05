import { useCallback, useEffect, useMemo, useState } from "react";
import { MAX_GUESSES, AMAZON_TAG } from "../config.js";
import { BY_ID, formatMemory, formatPrice, formatTier } from "../game/data.js";
import { compareGuess, columnsFor, isWin } from "../game/compare.js";
import { shareText } from "../game/share.js";
import { loadDay, saveDay, loadStats, recordResult } from "../game/storage.js";
import GuessInput from "../components/GuessInput.jsx";
import HintRow from "../components/HintRow.jsx";
import ColumnHeader from "../components/ColumnHeader.jsx";
import { track } from "../analytics.js";

/**
 * One puzzle. `isToday` decides whether the result counts toward stats and streaks.
 * State: the list of guessed ids for this date, persisted on every change.
 */
export default function Game({ puzzle, isToday, todayKey, yesterdayKey, onStats }) {
  const { answer, type, number, dateKey } = puzzle;
  const [day, setDay] = useState(() => loadDay(dateKey));
  const [copied, setCopied] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => { setDay(loadDay(dateKey)); setLastAdded(null); }, [dateKey]);

  const guesses = useMemo(() => day.guesses.map((id) => BY_ID.get(id)).filter(Boolean), [day.guesses]);
  const rows = useMemo(() => guesses.map((g) => compareGuess(g, answer)), [guesses, answer]);
  const columns = useMemo(() => columnsFor(answer), [answer]);
  const exclude = useMemo(() => new Set(day.guesses), [day.guesses]);

  const onGuess = useCallback((item) => {
    if (day.done) return;
    const won = isWin(item, answer);
    const guessesNext = [...day.guesses, item.id];
    const done = won || guessesNext.length >= MAX_GUESSES;
    const next = { guesses: guessesNext, done, won };
    setDay(next);
    setLastAdded(item.id);
    saveDay(dateKey, next);
    if (done) {
      track(won ? "win" : "loss", { type, guesses: guessesNext.length });
      if (isToday) {
        const stats = recordResult(loadStats(), { dateKey, yesterdayKey, won, guessCount: guessesNext.length });
        onStats?.(stats);
      }
    }
  }, [day, answer, dateKey, isToday, yesterdayKey, onStats, type]);

  async function share() {
    const text = shareText({ number, type, rows, won: day.won });
    track("share", { type });
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your result:", text);
    }
  }

  const label = type === "gpu" ? "graphics card" : "processor";

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">
          #{number} · <span className={type === "gpu" ? "text-green-700 dark:text-green-400" : "text-sky-700 dark:text-sky-400"}>{type.toUpperCase()} day</span>
        </h2>
        <span className="text-xs text-zinc-500">{isToday ? "Today" : dateKey} · {guesses.length}/{MAX_GUESSES}</span>
      </div>

      {!day.done && (
        <div className="mb-4">
          <GuessInput type={type} exclude={exclude} onGuess={onGuess} placeholder={`Guess a ${label}…`} />
          {guesses.length === 0 && (
            <p className="mt-2 text-xs text-zinc-500">Any desktop {label} from {type === "gpu" ? "2006" : "2006"} onward. Try a part you know and read the arrows.</p>
          )}
        </div>
      )}

      {rows.length > 0 && <ColumnHeader columns={columns} />}
      <ol className="mb-4">
        {rows.map((cells, i) => (
          <HintRow key={guesses[i].id} name={guesses[i].name} cells={cells} animate={guesses[i].id === lastAdded} />
        ))}
      </ol>

      {day.done && (
        <Result answer={answer} won={day.won} guessCount={guesses.length} onShare={share} copied={copied} />
      )}
    </section>
  );
}

function Result({ answer, won, guessCount, onShare, copied }) {
  const specs = answer.type === "gpu"
    ? [["Released", `${answer.month ? answer.month + "/" : ""}${answer.year}`], ["Launch price", formatPrice(answer.msrp_usd)], ["VRAM", formatMemory(answer.memory_mb)], ["Rated power", `${answer.power_w} W`], ["Tier", formatTier(answer)], ["Architecture", answer.arch]]
    : [["Released", `${answer.month ? answer.month + "/" : ""}${answer.year}`], ["Launch price", formatPrice(answer.msrp_usd)], ["Cores / threads", `${answer.cores} / ${answer.threads}`], ["Rated power", `${answer.power_w} W`], ["Tier", formatTier(answer)], ["Socket", answer.arch]];
  const amazon = AMAZON_TAG ? `https://www.amazon.com/s?k=${encodeURIComponent(answer.name)}&tag=${AMAZON_TAG}` : null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="mb-1 text-sm text-zinc-500">{won ? `Got it in ${guessCount}.` : "Out of guesses. It was"}</p>
      <h3 className="mb-3 text-xl font-bold">{answer.name}</h3>
      <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {specs.map(([k, v]) => (
          <div key={k}><dt className="text-xs text-zinc-500">{k}</dt><dd className="font-medium">{v}</dd></div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onShare} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          {copied ? "Copied!" : "Share result"}
        </button>
        {amazon && (
          <a href={amazon} target="_blank" rel="sponsored noopener" onClick={() => track("affiliate", { id: answer.id })} className="text-sm text-sky-700 underline dark:text-sky-400">
            Check the price on Amazon
          </a>
        )}
      </div>
      {amazon && <p className="mt-2 text-xs text-zinc-500">As an Amazon Associate, Specdle earns from qualifying purchases.</p>}
      <p className="mt-3 text-xs text-zinc-500">Next puzzle at midnight, your time.</p>
    </div>
  );
}
