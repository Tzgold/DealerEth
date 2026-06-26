"use client";

import { FormEvent, useState } from "react";

type CampaignOption = {
  id: string;
  title: string;
  description: string;
  budget: string;
  deliverables: string;
  deadline: string | null;
};

export function DealRequestForm({
  creatorId,
  dark,
  initialName = "",
  initialEmail = "",
  campaigns = [],
}: {
  creatorId: string;
  dark?: boolean;
  initialName?: string;
  initialEmail?: string;
  campaigns?: CampaignOption[];
}) {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const fieldClass = dark ? "de-field" : "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm";
  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId);

  function selectCampaign(campaignId: string) {
    setSelectedCampaignId(campaignId);
    const campaign = campaigns.find((option) => option.id === campaignId);
    if (!campaign) return;

    setDescription(campaign.description);
    setBudget(campaign.budget);
    setDeliverables(campaign.deliverables);
  }

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
          creatorId,
          campaignId: selectedCampaignId,
          name: formData.get("name"),
          email: formData.get("email"),
          description: formData.get("description"),
          budget: formData.get("budget"),
          deliverables: formData.get("deliverables"),
        }),
      });

      if (response.ok) {
        form.reset();
        setSelectedCampaignId("");
        setDescription("");
        setBudget("");
        setDeliverables("");
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
      {campaigns.length > 0 && (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white/75">Attach one of your campaigns</span>
          <select value={selectedCampaignId} onChange={(event) => selectCampaign(event.target.value)} className={`${fieldClass} de-select`} name="campaignId">
            <option value="">No campaign attached</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
            ))}
          </select>
        </label>
      )}

      {selectedCampaign && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          <p className="font-bold text-white">{selectedCampaign.title}</p>
          <p className="mt-1 line-clamp-2">{selectedCampaign.description}</p>
          <p className="mt-2 text-xs text-white/50">
            Budget: {selectedCampaign.budget}
            {selectedCampaign.deadline ? ` · Deadline: ${selectedCampaign.deadline}` : ""}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white/75">Company or contact name</span>
          <input name="name" defaultValue={initialName} placeholder="Your company" required className={fieldClass} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white/75">Work email</span>
          <input name="email" type="email" defaultValue={initialEmail} placeholder="you@company.com" required className={fieldClass} />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white/75">Message and campaign overview</span>
        <textarea
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Write the message the creator should see first. What are you promoting, and why are they a fit?"
          rows={4}
          required
          className={`${fieldClass} resize-y`}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white/75">Budget</span>
        <input name="budget" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Example: 10,000 ETB" required className={fieldClass} />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white/75">Expected deliverables</span>
        <textarea name="deliverables" value={deliverables} onChange={(event) => setDeliverables(event.target.value)} placeholder="Videos, usage rights, timeline, and revisions" rows={3} required className={`${fieldClass} resize-y`} />
      </label>

      <button type="submit" disabled={submitting} className="de-btn de-btn-primary w-full">
        {submitting ? "Sending..." : "Send collaboration request"}
      </button>
      {status && (
        <p className={`rounded-lg border px-3 py-2 text-sm ${status.startsWith("Request sent") ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-rose-400/20 bg-rose-400/10 text-rose-200"}`}>
          {status}
        </p>
      )}
    </form>
  );
}
