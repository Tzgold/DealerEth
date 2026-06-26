"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusPill } from "@/components/dashboard/status-pill";

const statuses = ["APPLIED", "SHORTLISTED", "IN_CHAT", "ACTIVE", "COMPLETED", "REJECTED"] as const;

export function ApplicationStatusForm({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(currentStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function updateStatus(status: string) {
    const previous = value;
    setValue(status);
    setOpen(false);
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/campaign-applications/${applicationId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setValue(previous);
        setError(data.error ?? "Could not update status.");
      } else {
        router.refresh();
      }
    } catch {
      setValue(previous);
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-w-[210px] text-left">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Application status</p>
          <div className="mt-1">
            <StatusPill status={value} />
          </div>
        </div>
        <button
          type="button"
          aria-label="Application status"
          disabled={busy}
          onClick={() => setOpen((current) => !current)}
          className="de-status-trigger grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.45] text-zinc-700 transition hover:bg-white disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true">
            <path fill="currentColor" d="m7 10 5 5 5-5H7Z" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-14 z-30 w-52 overflow-hidden rounded-2xl border border-black/10 bg-white p-1 shadow-[0_18px_40px_rgba(17,17,15,0.12)]">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              disabled={busy}
              onClick={() => updateStatus(status)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#f4f2ec] ${value === status ? "text-zinc-950" : "text-zinc-700"}`}
            >
              <span>{status === "SHORTLISTED" ? "Approved" : status.replace("_", " ")}</span>
              {value === status && <span className="h-2 w-2 rounded-full bg-zinc-950" />}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
