"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandProfilePreview } from "@/components/profile/brand-profile-preview";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { ProfilePageShell } from "@/components/profile/profile-page-shell";
import { darkInputClass, darkInputClassBrand, darkTextareaClassBrand } from "@/components/profile/profile-styles";

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

  const completionItems = [
    { label: "Brand logo / image", done: Boolean(form.avatarUrl.trim()) },
    { label: "Company name", done: Boolean(form.companyName.trim()) },
    { label: "Contact person", done: Boolean(form.contactName.trim()) },
    { label: "Industry", done: Boolean(form.industry.trim()) },
    { label: "Brand story", done: Boolean(form.description.trim()) },
  ];
  const completion = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

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
    <ProfilePageShell
      variant="brand"
      title="Build your brand profile"
      subtitle="Creators see this when you post campaigns. A complete profile builds trust and gets better applications."
      backHref="/client/dashboard"
      backLabel="Brand hub"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl border border-[#FE2C55]/30 bg-[#141416] p-5">
            <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FE2C55] to-[#25F4EE]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Quick actions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push("/client/dashboard/post")}
                className="rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] px-4 py-2 text-xs font-bold text-white"
              >
                Post a campaign
              </button>
              <button
                type="button"
                onClick={() => router.push("/client/dashboard/creators")}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Discover creators
              </button>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <section>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Brand image</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={form.avatarUrl || "/next.svg"}
                  alt=""
                  className="h-20 w-20 rounded-2xl border border-white/10 object-cover bg-white/5"
                />
                <div className="flex-1">
                  <input
                    className={darkInputClassBrand}
                    placeholder="Logo or brand image URL"
                    value={form.avatarUrl}
                    disabled={bootLoading}
                    onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Company</p>
              <input
                className={darkInputClassBrand}
                placeholder="Company name"
                required
                value={form.companyName}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={darkInputClassBrand}
                  placeholder="Contact person"
                  required
                  value={form.contactName}
                  disabled={bootLoading}
                  onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                />
                <input
                  className={darkInputClassBrand}
                  placeholder="Industry"
                  required
                  value={form.industry}
                  disabled={bootLoading}
                  onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                />
              </div>
              <input
                className={darkInputClassBrand}
                placeholder="Website (optional)"
                value={form.website}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              />
            </section>

            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Collaboration goals</p>
              <textarea
                className={darkTextareaClassBrand}
                rows={6}
                placeholder="What campaigns are you running? Who is your audience? What creators do you want?"
                required
                value={form.description}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || bootLoading}
                className="flex-1 rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-50 sm:flex-none sm:px-8"
              >
                {bootLoading ? "Loading…" : loading ? "Saving…" : "Save brand profile"}
              </button>
              <button
                type="button"
                disabled={bootLoading}
                onClick={() => router.push("/client/dashboard")}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to dashboard
              </button>
            </div>
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </form>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ProfileCompletionCard completion={completion} items={completionItems} accent="brand" />
          <BrandProfilePreview
            companyName={form.companyName}
            avatarUrl={form.avatarUrl}
            contactName={form.contactName}
            industry={form.industry}
            description={form.description}
            website={form.website}
          />
        </aside>
      </div>
    </ProfilePageShell>
  );
}
