"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    const data = (await response.json()) as { role?: "CREATOR" | "CLIENT" };

    router.push(data.role === "CLIENT" ? "/client/dashboard" : "/dashboard");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-xl font-semibold">Creator login</h1>
      <p className="mt-1 text-sm text-zinc-600">Login and we will route you to the right dashboard.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Input name="password" type="password" placeholder="Your password" required minLength={6} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-sm text-zinc-600">
        New creator? <Link href="/signup" className="underline">Create account</Link>
      </p>
    </Card>
  );
}
