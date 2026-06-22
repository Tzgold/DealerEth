"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function ProfilePageShell({
  variant,
  title,
  subtitle,
  backHref,
  backLabel,
  children,
}: {
  variant: "creator" | "brand";
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}) {
  const accent = variant === "creator" ? "text-[#25F4EE]" : "text-[#FE2C55]";
  const gradient =
    variant === "creator"
      ? "from-[#25F4EE]/20 via-transparent to-[#FE2C55]/15"
      : "from-[#FE2C55]/20 via-transparent to-[#25F4EE]/15";

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0a0b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-0 text-xl font-black tracking-tight">
            <span className="text-white">dealer</span>
            <span className={accent}>Eth</span>
          </Link>
          <Link
            href={backHref}
            className="de-chip ml-4 hidden sm:inline-flex"
          >
            ← {backLabel}
          </Link>
          <div className="ml-auto">
            <Link
              href={backHref}
              className="de-btn de-btn-secondary min-h-9 py-2 text-xs"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className={`border-b border-white/5 bg-gradient-to-r ${gradient}`}>
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
          <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${accent}`}>
            {variant === "creator" ? "Creator profile" : "Brand profile"}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
