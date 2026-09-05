import { useEffect, useMemo, useRef, useState } from "react";
import { buildIndex, search } from "../game/search.js";
import { ITEMS } from "../game/data.js";

const INDEX = buildIndex(ITEMS);

/** Search box with a keyboard-navigable dropdown. Submits an item, never free text. */
export default function GuessInput({ type, exclude, onGuess, disabled, placeholder }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const results = useMemo(() => search(INDEX, q, { type, exclude }), [q, type, exclude]);

  useEffect(() => { setActive(0); }, [q]);

  function choose(item) {
    onGuess(item);
    setQ("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKey(e) {
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % results.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length); }
    else if (e.key === "Enter") { e.preventDefault(); choose(results[active]); }
    else if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        disabled={disabled}
        value={q}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKey}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base shadow-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/30 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
      />
      {open && results.length > 0 && (
        <ul role="listbox" className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {results.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); choose(item); }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm ${i === active ? "bg-green-600 text-white" : ""}`}
            >
              <span>{item.name}</span>
              <span className={`text-xs ${i === active ? "text-green-100" : "text-zinc-500"}`}>{item.year}</span>
            </li>
          ))}
        </ul>
      )}
      {open && q && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          No {type === "gpu" ? "graphics card" : "processor"} matches that.
        </div>
      )}
    </div>
  );
}
