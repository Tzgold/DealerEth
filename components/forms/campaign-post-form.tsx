"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CampaignPostForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/client/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        budget: formData.get("budget"),
        niche: formData.get("niche"),
        deliverables: formData.get("deliverables"),
        deadline: formData.get("deadline") || undefined,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not publish campaign");
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    router.refresh();
    setLoading(false);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input name="title" placeholder="Campaign title" required />
      <Textarea name="description" rows={4} placeholder="What is the campaign about?" required />
      <Input name="budget" placeholder="Budget (USD/ETB)" required />
      <Input name="niche" placeholder="Target niche (fashion, tech, food...)" required />
      <Textarea name="deliverables" rows={3} placeholder="Deliverables (videos, stories, timeline)" required />
      <Input name="deadline" placeholder="Deadline (optional)" />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Publishing..." : "Publish Campaign"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
