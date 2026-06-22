"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CampaignPostForm({ dark }: { dark?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/client/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"), description: formData.get("description"), budget: formData.get("budget"),
        niche: formData.get("niche"), deliverables: formData.get("deliverables"), deadline: formData.get("deadline") || undefined,
      }),
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not publish campaign");
      setLoading(false);
      return;
    }
    form.reset();
    router.push("/client/dashboard/campaigns");
    router.refresh();
  }

  const fieldClass = dark ? "de-field" : "w-full rounded-lg border border-zinc-300 px-3 py-2";
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Campaign title</span><input name="title" placeholder="Example: Summer product launch" required className={fieldClass} /></label>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Campaign brief</span><textarea name="description" rows={5} placeholder="Describe the product, audience, campaign goal, and creative direction." required className={`${fieldClass} resize-y`} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Budget</span><input name="budget" placeholder="8,000–15,000 ETB" required className={fieldClass} /></label>
        <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Target niche</span><input name="niche" placeholder="Fashion, technology, food…" required className={fieldClass} /></label>
      </div>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Deliverables</span><textarea name="deliverables" rows={4} placeholder="Example: Two TikTok videos and one revision round." required className={`${fieldClass} resize-y`} /></label>
      <label className="block space-y-2"><span className="text-sm font-semibold text-white/75">Deadline <span className="font-normal text-white/40">(optional)</span></span><input name="deadline" type="date" className={`${fieldClass} [color-scheme:dark]`} /></label>
      <button type="submit" disabled={loading} className="de-btn de-btn-primary w-full sm:w-auto">{loading ? "Publishing…" : "Publish campaign"}</button>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}
