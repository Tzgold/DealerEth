"use client";

import { useEffect, useState } from "react";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";

export function ProfileBioLinkCard({
  username,
  accent = "creator",
}: {
  username: string;
  accent?: "creator" | "brand";
}) {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const normalized = username.trim().toLowerCase().replace(/^@+/, "").replace(/\s+/g, "_");
  const hasUsername = normalized.length >= 3;
  const path = hasUsername ? `/@${normalized}` : "";
  const host = origin ? origin.replace(/^https?:\/\//, "") : "dealereth.com";
  const display = hasUsername ? `${host}${path}` : "Set a username to unlock your link";
  const fullUrl = hasUsername && origin ? `${origin}${path}` : "";

  const borderAccent = accent === "creator" ? "border-[#25F4EE]/30" : "border-[#FE2C55]/30";
  const labelAccent = accent === "creator" ? "text-[#25F4EE]" : "text-[#FE2C55]";

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${borderAccent} bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]`}>
      <span
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent === "creator" ? "from-[#25F4EE] to-[#FE2C55]" : "from-[#FE2C55] to-[#25F4EE]"}`}
        aria-hidden="true"
      />
      <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${labelAccent}`}>Bio link</p>
      <p className="mt-1 text-sm text-white/65">Put this in your TikTok bio so brands can request deals on DealerEth.</p>

      {hasUsername ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10.6 13.4a1 1 0 0 0 1.4 0l4-4a3 3 0 1 0-4.2-4.2L11 6a1 1 0 0 0 1.4 1.4l.8-.8a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 0 0 1.4Zm2.8-2.8a1 1 0 0 0-1.4 0l-4 4a3 3 0 1 0 4.2 4.2L13 18a1 1 0 0 0-1.4-1.4l-.8.8a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 0 0-1.4Z"
              />
            </svg>
            <span className="min-w-0 flex-1 truncate font-mono text-sm text-white/90">{display}</span>
            {fullUrl && <CopyLinkButton value={fullUrl} />}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-900 transition hover:bg-white/90"
            >
              View public page
            </a>
            <a
              href={path}
              className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Open preview
            </a>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
          Choose a username below (min. 3 characters) to generate your shareable link.
        </p>
      )}
    </div>
  );
}
