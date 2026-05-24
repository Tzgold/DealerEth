"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const darkFieldClass =
  "rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/30 w-full px-4 py-2.5 text-sm outline-none border";

export function CampaignApplyForm({
  campaignId,
  existingApplicationId,
  dark = true,
}: {
  campaignId: string;
  existingApplicationId?: string | null;
  dark?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (existingApplicationId || success) {
    return (
      <div className={`rounded-xl border px-4 py-3 text-sm ${dark ? "border-[#25F4EE]/40 bg-[#25F4EE]/10 text-[#25F4EE]" : "border-green-200 bg-green-50 text-green-800"}`}>
        Application submitted.{" "}
        <a href="/dashboard/messages" className="font-semibold underline underline-offset-2">
          View in Messages
        </a>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/campaign-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        coverLetter: formData.get("coverLetter"),
        proposedBudget: formData.get("proposedBudget") || undefined,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not apply");
      setLoading(false);
      return;
    }

    setSuccess(true);
    router.refresh();
    setLoading(false);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <textarea
        name="coverLetter"
        rows={4}
        required
        placeholder="Why are you a good fit? Mention your audience, style, and past brand work."
        className={dark ? darkFieldClass : "w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"}
      />
      <input
        name="proposedBudget"
        placeholder="Your proposed budget (optional)"
        className={dark ? darkFieldClass : "w-full rounded-full border border-zinc-200 px-4 py-2 text-sm"}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] py-2.5 text-sm font-bold text-white hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit application"}
      </button>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </form>
  );
}
