export function ProfileCompletionCard({
  completion,
  items,
  accent = "creator",
}: {
  completion: number;
  items: { label: string; done: boolean }[];
  accent?: "creator" | "brand";
}) {
  const barGradient =
    accent === "creator"
      ? "bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55]"
      : "bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE]";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-white">Profile strength</p>
        <p className="text-2xl font-black text-white">{completion}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-all duration-500 ${barGradient}`} style={{ width: `${completion}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                item.done ? "bg-[#25F4EE]/20 text-[#25F4EE]" : "bg-white/10 text-white/40"
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
