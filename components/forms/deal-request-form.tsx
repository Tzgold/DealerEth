"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const darkFieldClass =
  "rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#25F4EE]/50 w-full px-4 py-2.5 text-sm outline-none border";

export function DealRequestForm({ creatorId, dark }: { creatorId: string; dark?: boolean }) {
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const body = {
      creatorId,
      name: formData.get("name"),
      email: formData.get("email"),
      description: formData.get("description"),
      budget: formData.get("budget"),
      deliverables: formData.get("deliverables"),
    };

    const response = await fetch("/api/deal-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      event.currentTarget.reset();
      setStatus("Request sent successfully.");
    } else {
      const data = (await response.json()) as { error?: string };
      setStatus(data.error ?? "Failed to send request.");
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="name" placeholder="Company / Name" required className={dark ? darkFieldClass : undefined} />
      <Input name="email" type="email" placeholder="Email" required className={dark ? darkFieldClass : undefined} />
      <Textarea name="description" placeholder="Campaign description" rows={4} required className={dark ? darkFieldClass : undefined} />
      <Input name="budget" placeholder="Budget (USD or ETB)" required className={dark ? darkFieldClass : undefined} />
      <Textarea name="deliverables" placeholder="Expected deliverables" rows={3} required className={dark ? darkFieldClass : undefined} />
      <Button
        type="submit"
        disabled={submitting}
        className={dark ? "w-full rounded-full bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] font-bold text-white" : "w-full"}
      >
        {submitting ? "Sending..." : "Submit Request"}
      </Button>
      {status && <p className={`text-sm ${dark ? "text-[#25F4EE]" : "text-zinc-600"}`}>{status}</p>}
    </form>
  );
}
