"use client";

import { ReactNode } from "react";

type AuthSplitLayoutProps = {
  badge: string;
  heading: string;
  subheading: string;
  steps: string[];
  formTitle: string;
  formSubtitle: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkText: string;
  children: ReactNode;
};

export function AuthSplitLayout({
  badge,
  heading,
  subheading,
  steps,
  formTitle,
  formSubtitle,
  footerText,
  footerLinkHref,
  footerLinkText,
  children,
}: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_0%,rgba(37,244,238,0.16),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(254,44,85,0.18),transparent_35%),#0b0b0f] px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/15 bg-black/70 shadow-[0_25px_90px_rgba(0,0,0,0.45)] lg:grid-cols-2">
        <aside className="relative isolate flex flex-col justify-between overflow-hidden bg-[linear-gradient(165deg,#0f0f12_0%,#10131a_38%,#151025_72%,#0a0a0d_100%)] p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-rose-300/25 blur-3xl" />
          <div className="relative z-10">
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">D</span>
              DealerEth
            </a>
            <h1 className="mt-14 max-w-md text-4xl font-black leading-tight sm:text-5xl">{heading}</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/85">{subheading}</p>
          </div>

          <ol className="relative z-10 mt-10 space-y-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  index === 0 ? "border-white/35 bg-white/90 text-zinc-900" : "border-white/10 bg-white/5 text-white/85"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? "bg-zinc-900 text-white" : "bg-white/20 text-white"
                  }`}
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </aside>

        <section className="bg-[#0a0a0c] p-8 text-white sm:p-10 lg:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">{badge}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">{formTitle}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/65">{formSubtitle}</p>

          <div className="mt-7">{children}</div>

          <p className="mt-6 text-sm text-white/65">
            {footerText}{" "}
            <a href={footerLinkHref} className="font-semibold text-white underline decoration-white/40 underline-offset-4">
              {footerLinkText}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
