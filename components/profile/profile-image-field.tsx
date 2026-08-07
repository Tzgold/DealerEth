"use client";

import { ChangeEvent, useRef, useState } from "react";
import { AvatarImage } from "@/components/ui/avatar-image";

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
  const [notice, setNotice] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/uploads/avatar", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string; savedToProfile?: boolean };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Could not upload image.");
        return;
      }
      onChange(data.url);
      setNotice(data.savedToProfile ? "Image uploaded and saved." : "Image uploaded. Save the profile to finish.");
    } catch {
      setError("Could not upload image. Check your connection and try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
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
      setNotice("Logo selected. Save the profile to apply it.");
    } catch {
      setError("Enter a valid website first.");
    }
  }

  function selectFallback() {
    if (!fallbackUrl) return;
    onChange(fallbackUrl);
    setError("");
    setNotice("TikTok photo selected. Save the profile to apply it.");
  }

  function removeImage() {
    onChange("");
    setError("");
    setNotice("Image removed. Save the profile to apply this change.");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <AvatarImage
        src={value || fallbackUrl || "/next.svg"}
        alt="Profile preview"
        className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 bg-white/5 object-cover"
        size={64}
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={disabled || uploading} onClick={() => inputRef.current?.click()} className="de-btn de-btn-primary min-h-9 py-2 text-xs">
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          {variant === "creator" && fallbackUrl && value !== fallbackUrl ? (
            <button type="button" disabled={disabled} onClick={selectFallback} className="de-btn de-btn-secondary min-h-9 py-2 text-xs">
              Use TikTok photo
            </button>
          ) : null}
          {variant === "brand" ? (
            <button type="button" disabled={disabled} onClick={useWebsiteLogo} className="de-btn de-btn-secondary min-h-9 py-2 text-xs">
              Logo from website
            </button>
          ) : null}
          {value ? (
            <button type="button" disabled={disabled} onClick={removeImage} className="de-btn de-btn-secondary min-h-9 py-2 text-xs">
              Remove
            </button>
          ) : null}
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={upload} />
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.value);
            setError("");
            setNotice(event.target.value.trim() ? "Image URL changed. Save to apply." : "");
          }}
          placeholder="Or paste an image URL"
          className="de-field"
        />
        {notice ? <p className="text-xs text-emerald-700">{notice}</p> : null}
        {error ? <p className="text-xs text-rose-700">{error}</p> : null}
      </div>
    </div>
  );
}
