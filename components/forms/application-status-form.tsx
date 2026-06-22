"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const status = event.target.value;
    const previous = value;
    setValue(status);
    setBusy(true);
    setError("");
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
    setBusy(false);
  }

  return (
    <div className="text-right">
      <select
        value={value}
        disabled={busy}
        onChange={handleChange}
        className="de-field de-select min-h-10 w-auto py-2 text-xs font-semibold disabled:opacity-50"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </div>
  );
}
