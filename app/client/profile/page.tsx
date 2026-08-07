"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandProfilePreview } from "@/components/profile/brand-profile-preview";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { ProfileImageField } from "@/components/profile/profile-image-field";
import { ProfilePageShell } from "@/components/profile/profile-page-shell";
import { darkInputClassBrand, darkTextareaClassBrand } from "@/components/profile/profile-styles";
import { BRAND_INDUSTRIES, SearchSelect } from "@/components/ui/search-select";

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
  const [fallbackAvatarUrl, setFallbackAvatarUrl] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
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
        const response = await fetch("/api/client/profile", { method: "GET", cache: "no-store" });
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

        setHasProfile(Boolean(data.profile));
        setFallbackAvatarUrl(data.defaults?.avatarUrl ?? "");
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
    { label: "Brand image", done: Boolean(form.avatarUrl.trim()) },
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

    const website = form.website.trim()
      ? (/^https?:\/\//i.test(form.website.trim()) ? form.website.trim() : `https://${form.website.trim()}`)
      : "";

    try {
      const response = await fetch("/api/client/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName,
          avatarUrl: form.avatarUrl || "",
          contactName: form.contactName,
          industry: form.industry,
          website,
          description: form.description,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not save profile");
        return;
      }

      router.push("/client/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfilePageShell
      variant="brand"
      title="Build your brand profile"
      subtitle="Creators see this when they review your campaigns."
      backHref="/client/dashboard"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <button type="button" disabled={!hasProfile} onClick={() => router.push("/client/dashboard/post")} className="de-btn de-btn-primary min-h-9 py-2 text-xs">
              Post a campaign
            </button>
            <button type="button" disabled={!hasProfile} onClick={() => router.push("/client/dashboard/creators")} className="de-btn de-btn-secondary min-h-9 py-2 text-xs">
              Discover creators
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6">
            <section className="space-y-3">
              <p className="de-eyebrow">Brand image</p>
              <ProfileImageField
                value={form.avatarUrl}
                fallbackUrl={fallbackAvatarUrl}
                website={form.website}
                variant="brand"
                disabled={bootLoading}
                onChange={(avatarUrl) => setForm((previous) => ({ ...previous, avatarUrl }))}
              />
            </section>

            <section className="space-y-3">
              <p className="de-eyebrow">Company</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={darkInputClassBrand} placeholder="Company name" required value={form.companyName} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} />
                <input className={darkInputClassBrand} placeholder="Contact person" required value={form.contactName} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} />
                <SearchSelect
                  value={form.industry}
                  onChange={(industry) => setForm((p) => ({ ...p, industry }))}
                  options={BRAND_INDUSTRIES}
                  placeholder="Search or type your industry"
                  required
                  disabled={bootLoading}
                  allowCustom
                  className={darkInputClassBrand}
                />
                <input className={darkInputClassBrand} placeholder="Website (optional)" value={form.website} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
                <textarea className={`${darkTextareaClassBrand} sm:col-span-2`} rows={4} placeholder="Brand description" required value={form.description} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={loading || bootLoading} className="de-btn de-btn-primary">
                {bootLoading ? "Loading…" : loading ? "Saving…" : "Save brand profile"}
              </button>
              <button type="button" disabled={bootLoading} onClick={() => router.push("/client/dashboard")} className="de-btn de-btn-secondary">
                Cancel
              </button>
            </div>
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </form>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ProfileCompletionCard completion={completion} items={completionItems} />
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
