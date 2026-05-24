"use client";

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

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const status = event.target.value;
    await fetch(`/api/campaign-applications/${applicationId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold text-white outline-none"
    >
      {statuses.map((status) => (
        <option key={status} value={status} className="bg-zinc-900 text-white">
          {status.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
