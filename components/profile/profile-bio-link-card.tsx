"use client";

import { useSyncExternalStore } from "react";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";

export function ProfileBioLinkCard({ username }: { username: string }) {
  const origin = useSyncExternalStore(
    () => () => undefined,
    () => window.location.origin,
    () => "",
  );

  const normalized = username.trim().toLowerCase().replace(/^@+/, "").replace(/\s+/g, "_");
  const ready = normalized.length >= 3;
  const path = ready ? `/${normalized}` : "";
  const host = origin ? origin.replace(/^https?:\/\//, "") : "dealereth.com";
  const display = ready ? `${host}${path}` : `${host}/your_username`;
  const fullUrl = ready && origin ? `${origin}${path}` : "";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="de-eyebrow">Bio link</p>
        {ready ? (
          <a href={path} target="_blank" rel="noreferrer" className="text-xs font-semibold underline underline-offset-4">
            View page
          </a>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
        <span className={`min-w-0 flex-1 truncate font-mono text-sm ${ready ? "text-white/90" : "text-white/35"}`}>{display}</span>
        {ready && fullUrl ? <CopyLinkButton value={fullUrl} /> : null}
      </div>
    </div>
  );
}
