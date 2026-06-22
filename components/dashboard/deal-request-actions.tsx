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
    setBusy(false);
  }

  if (currentStatus !== "NEW") {
    return (
      <button type="button" disabled={busy} onClick={() => update("NEW")} className="text-xs font-semibold text-white/55 underline hover:text-white">
        Move back to inbox
      </button>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => update("ACCEPTED")} className="de-btn de-btn-primary">
          Accept request
        </button>
        <button type="button" disabled={busy} onClick={() => update("DECLINED")} className="de-btn de-btn-secondary">
          Decline
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
