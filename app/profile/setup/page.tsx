"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreatorProfilePreview } from "@/components/profile/creator-profile-preview";
import { ProfileBioLinkCard } from "@/components/profile/profile-bio-link-card";
import { ProfileCompletionCard } from "@/components/profile/profile-completion-card";
import { ProfileImageField } from "@/components/profile/profile-image-field";
import { ProfilePageShell } from "@/components/profile/profile-page-shell";
import { darkInputClass, darkTextareaClass } from "@/components/profile/profile-styles";

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
    { label: "Username (bio link)", done: Boolean(form.username.trim()) },
    { label: "TikTok handle", done: Boolean(form.tiktokHandle.trim()) },
    { label: "Bio", done: Boolean(form.bio.trim()) },
    { label: "Niche", done: Boolean(form.niche.trim()) },
    { label: "Followers", done: Boolean(form.followers.trim()) },
    { label: "Portfolio links", done: Boolean(form.sampleVideos.trim()) },
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
      subtitle="This becomes your public DealerEth page for brands. Add your bio link to TikTok and keep your portfolio up to date."
      backHref="/dashboard"
      backLabel="Creator hub"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <ProfileBioLinkCard username={form.username || savedUsername} />

          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <section>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Photo</p>
              <div className="mt-3">
                <ProfileImageField value={form.avatarUrl} fallbackUrl={sourceAvatarUrl} variant="creator" disabled={bootLoading} onChange={(avatarUrl) => setForm((previous) => ({ ...previous, avatarUrl }))} />
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Identity</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={darkInputClass}
                  placeholder="Full name"
                  required
                  value={form.name}
                  disabled={bootLoading}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
                <input
                  className={darkInputClass}
                  placeholder="@yourtiktok"
                  required
                  value={form.tiktokHandle}
                  disabled={bootLoading}
                  onChange={(e) => setForm((p) => ({ ...p, tiktokHandle: e.target.value }))}
                />
              </div>
              <input
                className={darkInputClass}
                placeholder="Username for bio link (e.g. shemzu)"
                required
                value={form.username}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              />
              <p className="text-xs text-white/45">Lowercase letters, numbers, and underscore only.</p>
              <textarea
                className={darkTextareaClass}
                rows={4}
                placeholder="Short bio — your content style, audience, and what brands can expect"
                required
                value={form.bio}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              />
            </section>

            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Audience & rates</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={darkInputClass}
                  placeholder="Niche (Fashion, Tech, Food…)"
                  required
                  value={form.niche}
                  disabled={bootLoading}
                  onChange={(e) => setForm((p) => ({ ...p, niche: e.target.value }))}
                />
                <input
                  className={darkInputClass}
                  type="number"
                  min={0}
                  placeholder="Follower count"
                  required
                  value={form.followers}
                  disabled={bootLoading}
                  onChange={(e) => setForm((p) => ({ ...p, followers: e.target.value }))}
                />
              </div>
              <input
                className={darkInputClass}
                placeholder="Guide rate (optional, e.g. 5,000–15,000 ETB/post)"
                value={form.priceRange}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, priceRange: e.target.value }))}
              />
            </section>

            <section className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Portfolio</p>
              <textarea
                className={darkTextareaClass}
                rows={5}
                placeholder="TikTok video URLs, one per line (max 5)"
                required
                value={form.sampleVideos}
                disabled={bootLoading}
                onChange={(e) => setForm((p) => ({ ...p, sampleVideos: e.target.value }))}
              />
            </section>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || bootLoading}
                className="de-btn de-btn-primary flex-1 sm:flex-none"
              >
                {bootLoading ? "Loading…" : loading ? "Saving…" : "Save profile"}
              </button>
              <button
                type="button"
                disabled={bootLoading}
                onClick={() => router.push("/dashboard")}
                className="de-btn de-btn-secondary"
              >
                Back to dashboard
              </button>
            </div>
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </form>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ProfileCompletionCard completion={completion} items={completionItems} accent="creator" />
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
