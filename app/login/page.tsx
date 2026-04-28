"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

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
        role: "CREATOR",
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
    <AuthSplitLayout
      badge="Creator Portal"
      heading="Welcome back, Creator"
      subheading="Sign in to manage your profile link, review incoming deals, and keep your TikTok partnerships growing."
      steps={["Sign in to your account", "Review incoming campaign requests", "Accept deals and grow"]}
      formTitle="Sign In"
      formSubtitle="Enter your account details to continue. You can also continue instantly with TikTok."
      footerText="New creator?"
      footerLinkHref="/signup"
      footerLinkText="Create account"
    >
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/google/start?role=CREATOR";
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 2.9 14.7 2 12 2 6.9 2 2.8 6.3 2.8 11.7S6.9 21.4 12 21.4c6.9 0 9.1-4.9 9.1-7.4 0-.5 0-.8-.1-1.1H12Z" />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/tiktok/start?role=CREATOR";
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <svg viewBox="0 0 256 256" className="h-4 w-4" aria-hidden="true">
            <path fill="#25F4EE" d="M182 31c4 20 16 35 35 41v31c-14 0-27-4-38-11v64a71 71 0 1 1-71-71c3 0 6 0 9 1v32a39 39 0 1 0 30 38V31h35Z" />
            <path fill="#FE2C55" d="M175 31c4 20 16 35 35 41v31c-14 0-27-4-38-11v64a71 71 0 1 1-71-71c3 0 6 0 9 1v24a47 47 0 1 0 30 46V31h35Z" />
            <path fill="#fff" d="M177 31c4 20 16 35 35 41v19c-13 0-25-4-35-10v75a59 59 0 1 1-59-59c2 0 4 0 6 .3v20a39 39 0 1 0 32 38V31h21Z" />
          </svg>
          Continue with TikTok
        </button>
      </div>
      <div className="mb-3 flex items-center gap-3 text-xs text-white/40">
        <span className="h-px flex-1 bg-white/10" />
        OR
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#25F4EE]/50"
        />
        <Input
          name="password"
          type="password"
          placeholder="Your password"
          required
          minLength={6}
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#25F4EE]/50"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] py-2.5 font-bold text-white hover:opacity-95"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </AuthSplitLayout>
  );
}
