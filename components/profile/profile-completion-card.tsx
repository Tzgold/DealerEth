export function ProfileCompletionCard({
  completion,
  items,
}: {
  completion: number;
  items: { label: string; done: boolean }[];
  accent?: "creator" | "brand";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="de-eyebrow">Profile strength</p>
        <p className="text-2xl font-black text-white">{completion}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-black transition-all duration-500" style={{ width: `${completion}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                item.done ? "bg-black text-white" : "bg-white/10 text-white/40"
              }`}
            >
              {item.done ? "✓" : "·"}
            </span>
            <span className={item.done ? "text-white/80" : "text-white/45"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
