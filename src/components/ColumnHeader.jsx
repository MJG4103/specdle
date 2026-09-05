export default function ColumnHeader({ columns }) {
  return (
    <div className="mb-2 grid gap-1 text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
         style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
      {columns.map((c) => <div key={c.key} className="text-center leading-tight">{c.label}</div>)}
    </div>
  );
}
