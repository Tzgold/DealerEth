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
  return (
    <div className="product-editorial min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f6f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">
            <span>DEALERETH</span>
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

      <div className="border-b border-black/10 bg-black/[0.015]">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
          <p className="de-eyebrow">
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
