"use client";

import { ChangeEvent, useRef, useState } from "react";

export function ProfileImageField({
  value,
  onChange,
  fallbackUrl,
  website,
  variant,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  fallbackUrl?: string;
  website?: string;
  variant: "creator" | "brand";
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/uploads/avatar", { method: "POST", body });
    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) setError(data.error ?? "Could not upload image.");
    else onChange(data.url);
    setUploading(false);
    event.target.value = "";
  }

  function useWebsiteLogo() {
    const raw = website?.trim();
    if (!raw) {
      setError("Add your website first, then choose this option.");
      return;
    }
    try {
      const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const domain = new URL(normalized).hostname;
      onChange(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`);
      setError("");
    } catch {
      setError("Enter a valid website first.");
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <img src={value || fallbackUrl || "/next.svg"} alt="Profile preview" className="h-24 w-24 shrink-0 rounded-2xl border border-white/10 bg-white/5 object-cover shadow-lg" />
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={disabled || uploading} onClick={() => inputRef.current?.click()} className="de-btn de-btn-primary">
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          {variant === "creator" && fallbackUrl && value !== fallbackUrl && (
            <button type="button" disabled={disabled} onClick={() => onChange(fallbackUrl)} className="de-btn de-btn-accent">
              Use TikTok photo
            </button>
          )}
          {variant === "brand" && (
            <button type="button" disabled={disabled} onClick={useWebsiteLogo} className="de-btn de-btn-secondary">
              Get logo from website
            </button>
          )}
          {value && <button type="button" disabled={disabled} onClick={() => onChange("")} className="de-btn de-btn-danger">Remove</button>}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload} />
        <p className="text-xs leading-5 text-white/50">JPG, PNG, or WebP · maximum 3 MB. You can still paste an image URL below.</p>
        <input value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} placeholder="Or paste an image URL" className="de-field" />
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>
    </div>
  );
}
