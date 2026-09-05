// One guess: the name and a row of coloured hint cells with arrows.
const STATE_CLASS = {
  exact: "bg-green-600 text-white",
  close: "bg-yellow-500 text-zinc-900",
  far: "bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100",
  unknown: "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export function Arrow({ dir }) {
  if (!dir) return null;
  return <span aria-hidden="true" className="ml-1">{dir === "up" ? "↑" : "↓"}</span>;
}

export function cellAria(cell) {
  if (cell.state === "exact") return `${cell.label}: ${cell.text}, correct`;
  if (cell.state === "unknown") return `${cell.label}: unknown`;
  const dir = cell.dir === "up" ? "answer is higher" : cell.dir === "down" ? "answer is lower" : "wrong";
  return `${cell.label}: ${cell.text}, ${cell.state === "close" ? "close, " : ""}${dir}`;
}

export default function HintRow({ name, cells, animate }) {
  return (
    <li className="mb-2">
      <div className="mb-1 truncate text-sm font-medium">{name}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
        {cells.map((c, i) => (
          <div
            key={c.key}
            title={cellAria(c)}
            aria-label={cellAria(c)}
            className={`${STATE_CLASS[c.state]} ${animate ? "cell-pop" : ""} flex h-12 items-center justify-center rounded px-1 text-center text-xs font-semibold leading-tight sm:text-sm`}
            style={animate ? { animationDelay: `${i * 90}ms` } : undefined}
          >
            <span className="truncate">{c.text}</span>
            <Arrow dir={c.dir} />
          </div>
        ))}
      </div>
    </li>
  );
}
