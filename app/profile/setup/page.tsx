"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

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
        const response = await fetch("/api/profile", { method: "GET" });
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

        setForm((prev) => ({
          ...prev,
          name: data.profile?.name ?? data.defaults?.name ?? "",
          avatarUrl: data.profile?.avatarUrl ?? data.defaults?.avatarUrl ?? "",
          username: data.profile?.username ?? "",
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

  const completedCoreFields = [
    form.name,
    form.avatarUrl,
    form.username,
    form.tiktokHandle,
    form.bio,
    form.niche,
    form.followers,
    form.sampleVideos,
  ].filter((value) => value.trim().length > 0).length;
  const completion = Math.round((completedCoreFields / 8) * 100);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const usernameRaw = form.username;
    const normalizedUsername = usernameRaw
      .trim()
      .toLowerCase()
      .replace(/^@+/, "")
      .replace(/\s+/g, "_");

    const sampleVideos = form.sampleVideos
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => (value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`));

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
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(37,244,238,0.2),transparent_30%),radial-gradient(circle_at_100%_20%,rgba(254,44,85,0.18),transparent_35%),#f8fafc] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr,1.5fr]">
        <aside className="rounded-[24px] border border-zinc-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Creator Onboarding</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-zinc-900">Set up your creator profile</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            This page becomes your public pitch for brands. Keep it clear, real, and specific to your TikTok niche.
          </p>

          <ol className="mt-6 space-y-3">
            {["Basic identity", "Audience + niche", "Rates + sample videos"].map((step, index) => (
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
          <h2 className="text-xl font-black text-zinc-900">Public Profile Details</h2>
          <p className="mt-1 text-sm text-zinc-600">Brands use this information to decide if you are the right match.</p>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>Profile completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55]" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <form className="mt-5 space-y-5" onSubmit={onSubmit}>
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3">
              <img
                src={form.avatarUrl || "/vercel.svg"}
                alt="Profile avatar preview"
                className="h-16 w-16 rounded-full border border-zinc-200 object-cover bg-white"
              />
              <div className="flex-1">
                <Input
                  name="avatarUrl"
                  placeholder="Profile image URL (optional)"
                  value={form.avatarUrl}
                  disabled={bootLoading}
                  onChange={(event) => setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
                />
                <p className="mt-1 text-xs text-zinc-500">Add a professional headshot URL to build trust with brands.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                name="name"
                placeholder="Full name"
                required
                value={form.name}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <Input
                name="tiktokHandle"
                placeholder="@yourtiktok"
                required
                value={form.tiktokHandle}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, tiktokHandle: event.target.value }))}
              />
            </div>

            <div>
              <Input
                name="username"
                placeholder="username (for /@username)"
                required
                value={form.username}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              />
              <p className="mt-1 text-xs text-zinc-500">Use lowercase letters, numbers, and underscore only.</p>
            </div>

            <Textarea
              name="bio"
              placeholder="Short bio about your content and audience"
              rows={4}
              required
              value={form.bio}
              disabled={bootLoading}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                name="niche"
                placeholder="Niche (e.g. Fashion, Tech, Food)"
                required
                value={form.niche}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, niche: event.target.value }))}
              />
              <Input
                name="followers"
                type="number"
                min={0}
                placeholder="Followers count"
                required
                value={form.followers}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, followers: event.target.value }))}
              />
            </div>

            <Input
              name="priceRange"
              placeholder="Price range (optional, e.g. 5,000 - 15,000 ETB/post)"
              value={form.priceRange}
              disabled={bootLoading}
              onChange={(event) => setForm((prev) => ({ ...prev, priceRange: event.target.value }))}
            />

            <div>
              <Textarea
                name="sampleVideos"
                rows={5}
                placeholder="Sample video URLs, one per line (e.g. tiktok.com/... or https://...)"
                required
                value={form.sampleVideos}
                disabled={bootLoading}
                onChange={(event) => setForm((prev) => ({ ...prev, sampleVideos: event.target.value }))}
              />
              <p className="mt-1 text-xs text-zinc-500">Add at least 1 video. Maximum 5 links.</p>
            </div>

            <Button
              type="submit"
              disabled={loading || bootLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] py-2.5 font-bold text-white hover:opacity-95"
            >
              {bootLoading ? "Preparing form..." : loading ? "Saving..." : "Save Profile & Continue"}
            </Button>
          </form>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        </section>
      </div>
    </main>
  );
}
