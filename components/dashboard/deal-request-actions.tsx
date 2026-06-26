"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RequestStatus = "NEW" | "ACCEPTED" | "IN_DISCUSSION" | "ACTIVE" | "COMPLETED" | "DECLINED";

const nextActions: Record<RequestStatus, { status: RequestStatus; label: string; variant: "primary" | "secondary" }[]> = {
  NEW: [
    { status: "ACCEPTED", label: "Accept request", variant: "primary" },
    { status: "DECLINED", label: "Decline", variant: "secondary" },
  ],
  ACCEPTED: [
    { status: "IN_DISCUSSION", label: "Move to discussion", variant: "primary" },
    { status: "DECLINED", label: "Decline", variant: "secondary" },
  ],
  IN_DISCUSSION: [
    { status: "ACTIVE", label: "Mark active", variant: "primary" },
    { status: "COMPLETED", label: "Mark completed", variant: "secondary" },
  ],
  ACTIVE: [
    { status: "COMPLETED", label: "Mark completed", variant: "primary" },
    { status: "IN_DISCUSSION", label: "Back to discussion", variant: "secondary" },
  ],
  COMPLETED: [
    { status: "ACTIVE", label: "Reopen as active", variant: "secondary" },
  ],
  DECLINED: [
    { status: "NEW", label: "Move back to inbox", variant: "secondary" },
  ],
};

export function DealRequestActions({ requestId, currentStatus }: { requestId: string; currentStatus: RequestStatus }) {
  const router = useRouter();
  const [busyStatus, setBusyStatus] = useState<RequestStatus | null>(null);
  const [error, setError] = useState("");

  async function update(status: RequestStatus) {
    setBusyStatus(status);
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
      setBusyStatus(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {nextActions[currentStatus].map((action) => (
          <button
            key={action.status}
            type="button"
            disabled={Boolean(busyStatus)}
            onClick={() => update(action.status)}
            className={`de-btn ${action.variant === "primary" ? "de-btn-primary" : "de-btn-secondary"} min-h-9 py-2 text-xs`}
          >
            {busyStatus === action.status ? "Updating..." : action.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
