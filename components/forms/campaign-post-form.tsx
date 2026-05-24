"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const darkFieldClass =
  "rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/30";

export function CampaignPostForm({ dark }: { dark?: boolean }) {
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
    router.push("/client/dashboard/campaigns");
    router.refresh();
    setLoading(false);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Input name="title" placeholder="Campaign title" required className={dark ? darkFieldClass : undefined} />
      <Textarea name="description" rows={4} placeholder="What is the campaign about?" required className={dark ? darkFieldClass : undefined} />
      <Input name="budget" placeholder="Budget (e.g. 8,000–15,000 ETB)" required className={dark ? darkFieldClass : undefined} />
      <Input name="niche" placeholder="Target niche (fashion, tech, food...)" required className={dark ? darkFieldClass : undefined} />
      <Textarea name="deliverables" rows={3} placeholder="Deliverables (videos, stories, timeline)" required className={dark ? darkFieldClass : undefined} />
      <Input name="deadline" placeholder="Deadline (optional)" className={dark ? darkFieldClass : undefined} />
      <Button
        type="submit"
        disabled={loading}
        className={
          dark
            ? "w-full rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] font-bold text-white hover:opacity-95"
            : "w-full"
        }
      >
        {loading ? "Publishing..." : "Publish campaign"}
      </Button>
      {error && <p className={`text-sm ${dark ? "text-rose-300" : "text-red-600"}`}>{error}</p>}
    </form>
  );
}
