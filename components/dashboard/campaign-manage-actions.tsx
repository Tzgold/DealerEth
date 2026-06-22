"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  async function updateStatus(status: CampaignStatus) {
    setBusy(true);
    setError("");
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
    setBusy(false);
  }

  async function removeCampaign() {
    if (!window.confirm("Delete this campaign permanently?")) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/campaigns/${campaignId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not delete campaign.");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Campaign status"
        value={currentStatus}
        disabled={busy}
        onChange={(event) => updateStatus(event.target.value as CampaignStatus)}
        className="de-field de-select min-h-10 w-auto py-2 text-xs"
      >
        <option value="LIVE">Live</option>
        <option value="PAUSED">Paused</option>
        <option value="CLOSED">Closed</option>
      </select>
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
