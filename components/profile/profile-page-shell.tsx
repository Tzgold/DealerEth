"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function ProfilePageShell({
  variant,
  title,
  subtitle,
  backHref,
  children,
}: {
  variant: "creator" | "brand";
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  children: ReactNode;
}) {
  const isCreator = variant === "creator";

  return (
    <div className="dashboard-surface product-editorial min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f6f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">
            DEALERETH
          </Link>
          <nav className="ml-4 hidden items-center gap-2 sm:flex">
            <Link href={backHref} className="de-chip">
              {isCreator ? "Your hub" : "Brand hub"}
            </Link>
            <span className="de-chip de-chip-active">Profile</span>
            {isCreator ? (
              <Link href="/dashboard/campaigns" className="de-chip">
                Campaigns
              </Link>
            ) : (
              <Link href="/client/dashboard/campaigns" className="de-chip">
                Campaigns
              </Link>
            )}
          </nav>
          <div className="ml-auto">
            <Link href={backHref} className="de-btn de-btn-primary min-h-9 py-2 text-xs">
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        <p className="de-eyebrow">{isCreator ? "Creator profile" : "Brand profile"}</p>
        <h1 className="mt-2 text-3xl text-black sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
