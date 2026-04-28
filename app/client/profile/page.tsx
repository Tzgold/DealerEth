"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

type ClientSetupState = {
  companyName: string;
  avatarUrl: string;
  contactName: string;
  industry: string;
  website: string;
  description: string;
};

export default function ClientProfilePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [form, setForm] = useState<ClientSetupState>({
    companyName: "",
    avatarUrl: "",
    contactName: "",
    industry: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    async function loadProfileDefaults() {
      try {
        const response = await fetch("/api/client/profile", { method: "GET" });
        if (!response.ok) {
          setBootLoading(false);
          return;
        }

        const data = (await response.json()) as {
          profile?: {
            companyName?: string;
            avatarUrl?: string | null;
            contactName?: string;
            industry?: string;
            website?: string | null;
            description?: string;
          } | null;
          defaults?: {
            avatarUrl?: string;
            contactName?: string;
          };
        };

        setForm((prev) => ({
          ...prev,
          companyName: data.profile?.companyName ?? "",
          avatarUrl: data.profile?.avatarUrl ?? data.defaults?.avatarUrl ?? "",
          contactName: data.profile?.contactName ?? data.defaults?.contactName ?? "",
          industry: data.profile?.industry ?? "",
          website: data.profile?.website ?? "",
          description: data.profile?.description ?? "",
        }));
      } finally {
        setBootLoading(false);
      }
    }

    void loadProfileDefaults();
  }, []);

  const completedCoreFields = [form.companyName, form.avatarUrl, form.contactName, form.industry, form.description].filter((value) => value.trim().length > 0).length;
  const completion = Math.round((completedCoreFields / 5) * 100);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/client/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: form.companyName,
        avatarUrl: form.avatarUrl || "",
        contactName: form.contactName,
        industry: form.industry,
        website: form.website,
        description: form.description,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not save profile");
      setLoading(false);
      return;
    }

    router.push("/client/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(37,244,238,0.18),transparent_30%),radial-gradient(circle_at_100%_20%,rgba(254,44,85,0.2),transparent_35%),#f8fafc] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr,1.5fr]">
        <aside className="rounded-[24px] border border-zinc-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Brand Onboarding</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-zinc-900">Set up your brand profile</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Creators see this information before accepting your request. Write clearly so your brand feels trustworthy and professional.
          </p>

          <ol className="mt-6 space-y-3">
            {["Company identity", "Contact + industry", "Collaboration goals"].map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </aside>

        <section className="rounded-[24px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="text-xl font-black text-zinc-900">Brand Profile Details</h2>
          <p className="mt-1 text-sm text-zinc-600">This helps creators understand your campaign fit and expected collaboration style.</p>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>Profile completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE]" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <form className="mt-5 space-y-5" onSubmit={onSubmit}>
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3">
              <img
                src={form.avatarUrl || "/vercel.svg"}
                alt="Brand avatar preview"
                className="h-16 w-16 rounded-full border border-zinc-200 object-cover bg-white"
              />
              <div className="flex-1">
                <Input
                  name="avatarUrl"
                  placeholder="Brand logo or profile image URL"
                  value={form.avatarUrl}
                  disabled={bootLoading}
                  onChange={(event) => setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
                />
                <p className="mt-1 text-xs text-zinc-500">Use a clean logo or contact image to look professional.</p>
              </div>
            </div>

            <Input
              name="companyName"
              placeholder="Company name"
              required
              value={form.companyName}
              disabled={bootLoading}
              onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                name="contactName"
                placeholder="Contact person"
                required
                value={form.contactName}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, contactName: event.target.value }))}
              />
              <Input
                name="industry"
                placeholder="Industry (e.g. FMCG, fintech, fashion)"
                required
                value={form.industry}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))}
              />
            </div>

            <Input
              name="website"
              placeholder="Website URL (optional)"
              value={form.website}
              disabled={bootLoading}
              onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            />

            <Textarea
              name="description"
              rows={6}
              placeholder="Describe your brand and campaign goals. Include audience focus, tone, and what type of creators you are looking for."
              required
              value={form.description}
              disabled={bootLoading}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />

            <Button
              type="submit"
              disabled={loading || bootLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] py-2.5 font-bold text-white hover:opacity-95"
            >
              {bootLoading ? "Preparing form..." : loading ? "Saving..." : "Save Brand Profile & Continue"}
            </Button>
          </form>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        </section>
      </div>
    </main>
  );
}
