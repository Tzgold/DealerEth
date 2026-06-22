export function StatTile({ label, value, tone }: { label: string; value: string; tone?: "default" | "accent" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151518] px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
      <p className={`text-3xl font-black tracking-tight ${tone === "accent" ? "text-[#25F4EE]" : "text-white"}`}>{value}</p>
      <p className="mt-1.5 text-sm font-semibold text-white/65">{label}</p>
    </div>
  );
}

export function SidebarIcon({ name, className }: { name: string; className?: string }) {
  const common = `h-4 w-4 ${className ?? ""}`;
  switch (name) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path fill="currentColor" d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path fill="currentColor" d="M3 10v4a1 1 0 0 0 1 1h2l4 4a1 1 0 0 0 1.7-.7V5.7A1 1 0 0 0 10 5l-4 4H4a1 1 0 0 0-1 1Zm15-2v8a3 3 0 0 0 0-8Z" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c2.7 0 5 1.5 5 3v1H11v-1c0-1.5 2.3-3 5-3ZM3 18v-1c0-1.2 1.8-2.4 4-2.7A6.9 6.9 0 0 0 8 15a6.9 6.9 0 0 0-1-.3C4.8 15.6 3 16.8 3 18Z"
          />
        </svg>
      );
    case "inbox":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path fill="currentColor" d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 8v6h14v-6h-4a3 3 0 0 1-6 0H5Zm0-2h14V6H5v4Z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 5c-5 0-9.3 3.1-11 7 1.7 3.9 6 7 11 7s9.3-3.1 11-7c-1.7-3.9-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            fill="currentColor"
            d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3H9l-.3 3a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1L9 21h6l.3-3c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6ZM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
          />
        </svg>
      );
    default:
      return null;
  }
}
