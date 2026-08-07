"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreatorProfilePreview } from "@/components/profile/creator-profile-preview";
import { ProfileBioLinkCard } from "@/components/profile/profile-bio-link-card";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { ProfileImageField } from "@/components/profile/profile-image-field";
import { ProfilePageShell } from "@/components/profile/profile-page-shell";
import { darkInputClass, darkTextareaClass } from "@/components/profile/profile-styles";
import { CREATOR_NICHES, SearchSelect } from "@/components/ui/search-select";

type CreatorSetupState = {
  name: string;
  avatarUrl: string;
  username: string;
  tiktokHandle: string;
  bio: string;
  niche: string;
  followers: string;
  priceRange: string;
  sampleVideos: string;
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [savedUsername, setSavedUsername] = useState("");
  const [sourceAvatarUrl, setSourceAvatarUrl] = useState("");
  const [form, setForm] = useState<CreatorSetupState>({
    name: "",
    avatarUrl: "",
    username: "",
    tiktokHandle: "",
    bio: "",
    niche: "",
    followers: "",
    priceRange: "",
    sampleVideos: "",
  });

  useEffect(() => {
    async function loadProfileDefaults() {
      try {
        const response = await fetch("/api/profile", { method: "GET", cache: "no-store" });
        if (!response.ok) {
          setBootLoading(false);
          return;
        }

        const data = (await response.json()) as {
          profile?: {
            name?: string;
            avatarUrl?: string | null;
            username?: string;
            tiktokHandle?: string;
            bio?: string;
            niche?: string;
            followers?: number;
            priceRange?: string | null;
            sampleVideos?: string[];
          } | null;
          defaults?: {
            name?: string;
            avatarUrl?: string;
            tiktokHandle?: string;
            followers?: number | string;
          };
        };

        const username = data.profile?.username ?? "";
        setSourceAvatarUrl(data.defaults?.avatarUrl ?? "");
        setSavedUsername(username);
        setForm((prev) => ({
          ...prev,
          name: data.profile?.name ?? data.defaults?.name ?? "",
          avatarUrl: data.profile?.avatarUrl ?? data.defaults?.avatarUrl ?? "",
          username,
          tiktokHandle: data.profile?.tiktokHandle ?? data.defaults?.tiktokHandle ?? "",
          bio: data.profile?.bio ?? "",
          niche: data.profile?.niche ?? "",
          followers: String(data.profile?.followers ?? data.defaults?.followers ?? ""),
          priceRange: data.profile?.priceRange ?? "",
          sampleVideos: Array.isArray(data.profile?.sampleVideos) ? data.profile!.sampleVideos.join("\n") : "",
        }));
      } finally {
        setBootLoading(false);
      }
    }

    void loadProfileDefaults();
  }, []);

  const completionItems = [
    { label: "Profile photo", done: Boolean(form.avatarUrl.trim()) },
    { label: "Full name", done: Boolean(form.name.trim()) },
    { label: "Username", done: Boolean(form.username.trim()) },
    { label: "TikTok handle", done: Boolean(form.tiktokHandle.trim()) },
    { label: "Bio", done: Boolean(form.bio.trim()) },
    { label: "Niche", done: Boolean(form.niche.trim()) },
    { label: "Followers", done: Boolean(form.followers.trim()) },
    { label: "Portfolio", done: Boolean(form.sampleVideos.trim()) },
  ];
  const completion = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const normalizedUsername = form.username
      .trim()
      .toLowerCase()
      .replace(/^@+/, "")
      .replace(/\s+/g, "_");

    const sampleVideos = form.sampleVideos
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => (value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`));

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: normalizedUsername,
          name: form.name,
          avatarUrl: form.avatarUrl || "",
          tiktokHandle: form.tiktokHandle,
          bio: form.bio,
          niche: form.niche,
          followers: form.followers,
          priceRange: form.priceRange || undefined,
          sampleVideos,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Could not save profile");
        return;
      }

      setSavedUsername(normalizedUsername);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProfilePageShell
      variant="creator"
      title="Build your creator profile"
      subtitle="Keep it clear for brands. Your bio link updates as you set a username."
      backHref="/dashboard"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_320px]">
        <div className="space-y-4">
          <ProfileBioLinkCard username={form.username || savedUsername} />

          <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6">
            <section className="space-y-3">
              <p className="de-eyebrow">Photo</p>
              <ProfileImageField
                value={form.avatarUrl}
                fallbackUrl={sourceAvatarUrl}
                variant="creator"
                disabled={bootLoading}
                onChange={(avatarUrl) => setForm((previous) => ({ ...previous, avatarUrl }))}
              />
            </section>

            <section className="space-y-3">
              <p className="de-eyebrow">Identity</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={darkInputClass} placeholder="Full name" required value={form.name} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                <input className={darkInputClass} placeholder="@yourtiktok" required value={form.tiktokHandle} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, tiktokHandle: e.target.value }))} />
                <input className={`${darkInputClass} sm:col-span-2`} placeholder="Username for bio link" required value={form.username} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} />
                <textarea className={`${darkTextareaClass} sm:col-span-2`} rows={3} placeholder="Short bio" required value={form.bio} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
              </div>
            </section>

            <section className="space-y-3">
              <p className="de-eyebrow">Audience & rates</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <SearchSelect
                  value={form.niche}
                  onChange={(niche) => setForm((p) => ({ ...p, niche }))}
                  options={CREATOR_NICHES}
                  placeholder="Search or type your niche"
                  required
                  disabled={bootLoading}
                  allowCustom
                />
                <input className={darkInputClass} type="number" min={0} placeholder="Followers" required value={form.followers} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, followers: e.target.value }))} />
                <input className={`${darkInputClass} sm:col-span-2`} placeholder="Guide rate (optional)" value={form.priceRange} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, priceRange: e.target.value }))} />
              </div>
            </section>

            <section className="space-y-3">
              <p className="de-eyebrow">Portfolio</p>
              <textarea className={darkTextareaClass} rows={3} placeholder="TikTok video URLs, one per line" required value={form.sampleVideos} disabled={bootLoading} onChange={(e) => setForm((p) => ({ ...p, sampleVideos: e.target.value }))} />
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={loading || bootLoading} className="de-btn de-btn-primary">
                {bootLoading ? "Loading…" : loading ? "Saving…" : "Save profile"}
              </button>
              <button type="button" disabled={bootLoading} onClick={() => router.push("/dashboard")} className="de-btn de-btn-secondary">
                Cancel
              </button>
            </div>
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </form>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ProfileCompletionCard completion={completion} items={completionItems} />
          <CreatorProfilePreview
            name={form.name}
            avatarUrl={form.avatarUrl}
            tiktokHandle={form.tiktokHandle}
            bio={form.bio}
            niche={form.niche}
            followers={form.followers}
            priceRange={form.priceRange}
            username={form.username}
          />
        </aside>
      </div>
    </ProfilePageShell>
  );
}
