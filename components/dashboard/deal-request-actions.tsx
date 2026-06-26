"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RequestStatus = "NEW" | "ACCEPTED" | "DECLINED";

export function DealRequestActions({ requestId, currentStatus }: { requestId: string; currentStatus: RequestStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function update(status: RequestStatus) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/deal-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not update request.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (currentStatus !== "NEW") {
    return (
      <div>
        <button type="button" disabled={busy} onClick={() => update("NEW")} className="de-btn de-btn-secondary min-h-9 py-2 text-xs">
          {busy ? "Moving..." : "Move back to inbox"}
        </button>
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => update("ACCEPTED")} className="de-btn de-btn-primary">
          {busy ? "Updating..." : "Accept request"}
        </button>
        <button type="button" disabled={busy} onClick={() => update("DECLINED")} className="de-btn de-btn-secondary">
          Decline
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
