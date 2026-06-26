"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusPill } from "@/components/dashboard/status-pill";

type CampaignStatus = "LIVE" | "PAUSED" | "CLOSED";

export function CampaignManageActions({
  campaignId,
  currentStatus,
  applicationCount,
}: {
  campaignId: string;
  currentStatus: CampaignStatus;
  applicationCount: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function updateStatus(status: CampaignStatus) {
    setOpen(false);
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not update campaign.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeCampaign() {
    if (!window.confirm("Delete this campaign permanently?")) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not delete campaign.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2">
        <StatusPill status={currentStatus} />
        <button
          type="button"
          aria-label="Campaign status"
          disabled={busy}
          onClick={() => setOpen((current) => !current)}
          className="de-status-trigger grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.45] text-zinc-700 transition hover:bg-white disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true">
            <path fill="currentColor" d="m7 10 5 5 5-5H7Z" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 top-12 z-30 w-40 overflow-hidden rounded-2xl border border-black/10 bg-white p-1 shadow-[0_18px_40px_rgba(17,17,15,0.12)]">
            {(["LIVE", "PAUSED", "CLOSED"] as const).map((status) => (
              <button
                key={status}
                type="button"
                disabled={busy}
                onClick={() => updateStatus(status)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#f4f2ec] ${currentStatus === status ? "text-zinc-950" : "text-zinc-700"}`}
              >
                <span>{status[0] + status.slice(1).toLowerCase()}</span>
                {currentStatus === status && <span className="h-2 w-2 rounded-full bg-zinc-950" />}
              </button>
            ))}
          </div>
        )}
      </div>
      {applicationCount === 0 && (
        <button
          type="button"
          disabled={busy}
          onClick={removeCampaign}
          className="de-btn de-btn-danger min-h-10 py-2 text-xs"
        >
          Delete
        </button>
      )}
      {error && <p className="w-full text-xs text-rose-300">{error}</p>}
    </div>
  );
}
