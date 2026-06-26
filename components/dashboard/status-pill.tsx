type StatusTone = "neutral" | "success" | "warning" | "danger";

function toneFor(status: string): StatusTone {
  if (["APPLIED", "ACCEPTED", "SHORTLISTED", "ACTIVE", "COMPLETED", "LIVE"].includes(status)) return "success";
  if (["NEW"].includes(status)) return "warning";
  if (["DECLINED", "REJECTED", "CLOSED"].includes(status)) return "danger";
  return "neutral";
}

export function statusLabel(status: string) {
  if (status === "APPLIED") return "Approve";
  if (status === "SHORTLISTED") return "Approved";
  if (status === "IN_CHAT") return "In chat";
  if (status === "IN_DISCUSSION") return "In discussion";
  return status.replace("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusPill({ status, className = "" }: { status: string; className?: string }) {
  const tone = toneFor(status);
  const toneClass = {
    neutral: "de-status-neutral",
    success: "de-status-success",
    warning: "de-status-warning",
    danger: "de-status-danger",
  }[tone];

  return (
    <span className={`de-status-pill inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${toneClass} ${className}`}>
      {statusLabel(status)}
    </span>
  );
}
