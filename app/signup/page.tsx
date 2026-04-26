"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        role: "CREATOR",
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Signup failed");
      setLoading(false);
      return;
    }

    router.push("/profile/setup");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-xl font-semibold">Creator signup</h1>
      <p className="mt-1 text-sm text-zinc-600">Create your creator profile and share it in TikTok bio.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Input name="password" type="password" placeholder="At least 6 characters" required minLength={6} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Creator Account"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-sm text-zinc-600">
        Already have an account? <Link href="/login" className="underline">Login</Link>
      </p>
    </Card>
  );
}
