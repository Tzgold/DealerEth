"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const usernameRaw = String(formData.get("username") ?? "");
    const normalizedUsername = usernameRaw
      .trim()
      .toLowerCase()
      .replace(/^@+/, "")
      .replace(/\s+/g, "_");

    const sampleVideosRaw = String(formData.get("sampleVideos") ?? "");
    const sampleVideos = sampleVideosRaw
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => (value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`));

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: normalizedUsername,
        name: formData.get("name"),
        tiktokHandle: formData.get("tiktokHandle"),
        bio: formData.get("bio"),
        niche: formData.get("niche"),
        followers: formData.get("followers"),
        priceRange: formData.get("priceRange") || undefined,
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
    <Card className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold">Creator profile setup</h1>
      <p className="mt-1 text-sm text-zinc-600">This info appears on your public page.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input name="name" placeholder="Full name" required />
        <Input name="username" placeholder="username (for /@username)" required />
        <p className="-mt-1 text-xs text-zinc-500">
          Username only: lowercase letters, numbers, underscore (video links can be full URLs).
        </p>
        <Input name="tiktokHandle" placeholder="@yourtiktok" required />
        <Textarea name="bio" placeholder="Short bio" rows={4} required />
        <Input name="niche" placeholder="Niche (e.g. Fashion, Tech)" required />
        <Input name="followers" type="number" min={0} placeholder="Followers count" required />
        <Input name="priceRange" placeholder="Price range (optional)" />
        <Textarea
          name="sampleVideos"
          rows={5}
          placeholder="Sample video URLs, one per line (e.g. tiktok.com/... or https://...)"
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}
