"use client";

import { FormEvent, useState } from "react";

export function DealRequestForm({ creatorId, dark }: { creatorId: string; dark?: boolean }) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fieldClass = dark ? "de-field" : "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/deal-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId, name: formData.get("name"), email: formData.get("email"), description: formData.get("description"),
          budget: formData.get("budget"), deliverables: formData.get("deliverables"),
        }),
      });
      if (response.ok) {
        form.reset();
        setStatus("Request sent. The creator will see it in their DealerEth inbox.");
      } else {
        const data = (await response.json()) as { error?: string };
        setStatus(data.error ?? "Failed to send request.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Company or contact name</span><input name="name" placeholder="Your company" required className={fieldClass} /></label>
        <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Work email</span><input name="email" type="email" placeholder="you@company.com" required className={fieldClass} /></label>
      </div>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Campaign overview</span><textarea name="description" placeholder="What are you promoting, and what should the content achieve?" rows={4} required className={`${fieldClass} resize-y`} /></label>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Budget</span><input name="budget" placeholder="Example: 10,000 ETB" required className={fieldClass} /></label>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Expected deliverables</span><textarea name="deliverables" placeholder="Videos, usage rights, timeline, and revisions" rows={3} required className={`${fieldClass} resize-y`} /></label>
      <button type="submit" disabled={submitting} className="de-btn de-btn-primary w-full">{submitting ? "Sending…" : "Send collaboration request"}</button>
      {status && <p className={`rounded-lg border px-3 py-2 text-sm ${status.startsWith("Request sent") ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-rose-400/20 bg-rose-400/10 text-rose-200"}`}>{status}</p>}
    </form>
  );
}
