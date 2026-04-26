"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DealRequestForm({ creatorId }: { creatorId: string }) {
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
      <Input name="name" placeholder="Company / Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Textarea name="description" placeholder="Campaign description" rows={4} required />
      <Input name="budget" placeholder="Budget (USD or ETB)" required />
      <Textarea name="deliverables" placeholder="Expected deliverables" rows={3} required />
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Sending..." : "Submit Request"}
      </Button>
      {status && <p className="text-sm text-zinc-600">{status}</p>}
    </form>
  );
}
