"use client";

import Link from "next/link";
import { ReactNode, useSyncExternalStore } from "react";

type AuthSplitLayoutProps = {
  badge: string; heading: string; subheading: string; steps: string[]; formTitle: string; formSubtitle: string;
  footerText: string; footerLinkHref: string; footerLinkText: string; children: ReactNode;
};

export function AuthSplitLayout(props: AuthSplitLayoutProps) {
  const isBrand = props.badge.toLowerCase().includes("brand");
  const search = useSyncExternalStore(
    () => () => undefined,
    () => window.location.search,
    () => "",
  );
  const error = new URLSearchParams(search).get("error");
  const messages: Record<string, string> = {
    google_setup: "Google sign-in needs GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI in the server environment.",
    tiktok_setup: "TikTok sign-in needs TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, and TIKTOK_REDIRECT_URI in the server environment.",
    google_state: "Google sign-in expired or was interrupted. Please try again.",
    tiktok_state: "TikTok sign-in expired or was interrupted. Please try again.",
    google_failed: "Google could not complete sign-in. Please retry or use email and password.",
    tiktok_failed: "TikTok could not complete sign-in. Please retry or use email and password.",
    oauth_database: "Sign-in reached DealerEth, but the production database is not ready. Check DATABASE_URL, run migrations, and redeploy.",
  };
  const providerError = error ? (messages[error] ?? "Sign-in could not be completed. Please try again.") : "";
  return (
    <main className="dashboard-surface editorial-auth min-h-screen px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-2">
        <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">DEALERETH</Link>
        <Link href={isBrand ? "/login" : "/client/login"} className="de-chip">Switch to {isBrand ? "creator" : "brand"}</Link>
      </div>
      <div className="mx-auto mt-5 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/[0.09] bg-[#111114] shadow-[0_30px_90px_rgba(0,0,0,.34)] lg:grid-cols-[.88fr_1.12fr]">
        <aside className="relative flex flex-col justify-between overflow-hidden border-b border-white/[0.08] bg-white/[0.018] p-7 sm:p-10 lg:min-h-[680px] lg:border-b-0 lg:border-r">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/[0.045] blur-3xl" />
          <div className="relative"><p className="de-eyebrow">{props.badge}</p><h1 className="mt-5 max-w-md text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl">{props.heading}</h1><p className="mt-5 max-w-md text-sm leading-7 text-white/60">{props.subheading}</p></div>
          <ol className="relative mt-10 space-y-3">{props.steps.map((step,index) => <li key={step} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm font-semibold text-white/70"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-black ${index === 0 ? "bg-[var(--accent)] text-zinc-950" : "bg-white/[0.06] text-white/50"}`}>{index+1}</span>{step}</li>)}</ol>
        </aside>
        <section className="p-7 sm:p-10 lg:p-12">
          <p className="de-eyebrow">Secure access</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{props.formTitle}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/55">{props.formSubtitle}</p>
          {providerError && <p role="alert" className="mt-5 rounded-xl border border-rose-900/15 bg-rose-950/[0.04] px-4 py-3 text-sm leading-6 text-rose-800">{providerError}</p>}
          <div className="auth-form mt-8">{props.children}</div>
          <p className="mt-7 text-sm text-white/55">{props.footerText} <Link href={props.footerLinkHref} className="font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{props.footerLinkText}</Link></p>
        </section>
      </div>
    </main>
  );
}
