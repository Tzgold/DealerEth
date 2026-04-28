"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

export default function ClientSignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password,
        role: "CLIENT",
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Signup failed");
      setLoading(false);
      return;
    }

    router.push("/client/profile");
    router.refresh();
  }

  return (
    <AuthSplitLayout
      badge="Brand Portal"
      heading="Launch smarter brand campaigns"
      subheading="Create your brand account and start connecting with creators who match your target audience."
      steps={["Create brand account", "Set campaign goals and budget", "Connect and collaborate with creators"]}
      formTitle="Create Brand Account"
      formSubtitle="Add your brand details to create your account and begin posting campaigns."
      footerText="Already have a brand account?"
      footerLinkHref="/client/login"
      footerLinkText="Login"
    >
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/google/start?role=CLIENT";
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
            window.location.href = "/api/auth/tiktok/start?role=CLIENT";
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
          name="companyName"
          type="text"
          placeholder="Company name"
          required
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            name="contactName"
            type="text"
            placeholder="Contact name"
            required
            className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
          />
          <Input
            name="industry"
            type="text"
            placeholder="Industry"
            required
            className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
          />
        </div>
        <Input
          name="website"
          type="url"
          placeholder="Website (optional)"
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
        />
        <Input
          name="email"
          type="email"
          placeholder="brand@company.com"
          required
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
        />
        <Input
          name="password"
          type="password"
          placeholder="At least 6 characters"
          required
          minLength={6}
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          required
          minLength={6}
          className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-[#FE2C55]/50"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] py-2.5 font-bold text-white hover:opacity-95"
        >
          {loading ? "Creating..." : "Create Brand Account"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </AuthSplitLayout>
  );
}
