"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClientProfilePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/client/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: formData.get("companyName"),
        contactName: formData.get("contactName"),
        industry: formData.get("industry"),
        website: formData.get("website"),
        description: formData.get("description"),
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
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold">Client profile setup</h1>
      <p className="mt-1 text-sm text-zinc-600">This helps creators understand your brand and campaign fit.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input name="companyName" placeholder="Company name" required />
        <Input name="contactName" placeholder="Contact person" required />
        <Input name="industry" placeholder="Industry (e.g. FMCG, fintech, fashion)" required />
        <Input name="website" placeholder="Website URL (optional)" />
        <Textarea name="description" rows={5} placeholder="Brand description and collaboration goals" required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Client Profile"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}
