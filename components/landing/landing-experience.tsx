"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function RoleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold tracking-tight">Get Started</h3>
        <p className="mt-1 text-sm text-zinc-600">Choose how you want to use DealerEth.</p>

        <div className="mt-5 grid gap-3">
          <a href="/login" className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 transition hover:bg-cyan-50">
            <p className="font-semibold">I&apos;m a Creator</p>
            <p className="text-xs text-zinc-600">Log in to manage your profile and receive deal requests.</p>
          </a>
          <a href="/client/login" className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 transition hover:bg-zinc-50">
            <p className="font-semibold">I&apos;m a Brand</p>
            <p className="text-xs text-zinc-600">Log in to find creators and launch campaigns.</p>
          </a>
        </div>

        <button className="mt-5 text-sm font-medium text-zinc-600 underline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  text,
  variant,
}: {
  number: number;
  title: string;
  text: string;
  variant: "creator" | "brand";
}) {
  const badge =
    variant === "creator"
      ? "bg-[#25F4EE] text-black"
      : "bg-[#FE2C55] text-white";

  return (
    <li className="group relative flex gap-3 rounded-2xl border border-white/70 bg-white/65 px-3 py-2 backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-200">
      <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-[10px] text-xs font-extrabold ${badge}`}>
        {number}
      </span>
      <div>
        <p className="text-sm font-bold tracking-tight">{title}</p>
        <p className="text-xs leading-5 text-zinc-600">{text}</p>
      </div>
    </li>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 5.5 19 11H5v2h14l-5.5 5.5 1.4 1.4L22.8 12l-8-8-1.3 1.5Z"
      />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.3 0-6 2-6 4v1h12v-1c0-2-2.7-4-6-4Z"
      />
    </svg>
  );
}

function IconBriefcase({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 3h4a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3V5a2 2 0 0 1 2-2Zm6 3V5h-4v1h4Z"
      />
    </svg>
  );
}

function SocialIcon({ label }: { label: string }) {
  return (
    <span
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-sm"
    >
      <span className="text-[11px] font-bold">{label[0]}</span>
    </span>
  );
}

function FeatureIcon({ type }: { type: "shield" | "target" | "bolt" | "spark" }) {
  const common = "h-5 w-5";

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 3.1 5 1.9V11c0 3.6-2.2 7-5 8.2-2.8-1.2-5-4.6-5-8.2V7l5-1.9Z" />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Zm0 4a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3V7Zm8-4v3h-3v2h3v3h2V8h3V6h-3V3h-2Z"
        />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
      <path
        fill="currentColor"
        d="m12 2 2.1 4.9L19 9l-4.9 2.1L12 16l-2.1-4.9L5 9l4.9-2.1L12 2Zm7 12 1.3 3 3 1.3-3 1.3L19 23l-1.3-3-3-1.3 3-1.3L19 14ZM5 13l1 2.3L8.3 16 6 17l-1 2.3L4 17l-2.3-1L4 15.3 5 13Z"
      />
    </svg>
  );
}

export function LandingExperience() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_15%_5%,rgba(37,244,238,0.18),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(254,44,85,0.14),transparent_38%),linear-gradient(to_bottom,#f8fafc,#ffffff,#fff7fa)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-12">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 px-1 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Dealer
            <span className="bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] bg-clip-text text-transparent">Eth</span>
          </Link>

          <nav className="hidden flex-wrap items-center gap-1 text-sm text-zinc-700 md:flex">
            <a href="#how" className="rounded-full px-3 py-2 transition hover:bg-gradient-to-r hover:from-[#25F4EE]/20 hover:to-[#FE2C55]/20 hover:text-black">
              How it works
            </a>
            <a href="#creators" className="rounded-full px-3 py-2 transition hover:bg-gradient-to-r hover:from-[#25F4EE]/20 hover:to-[#FE2C55]/20 hover:text-black">
              For Creators
            </a>
            <a href="#brands" className="rounded-full px-3 py-2 transition hover:bg-gradient-to-r hover:from-[#25F4EE]/20 hover:to-[#FE2C55]/20 hover:text-black">
              For Brands
            </a>
            <a href="#features" className="rounded-full px-3 py-2 transition hover:bg-gradient-to-r hover:from-[#25F4EE]/20 hover:to-[#FE2C55]/20 hover:text-black">
              Features
            </a>
            <a href="#faq" className="rounded-full px-3 py-2 transition hover:bg-gradient-to-r hover:from-[#25F4EE]/20 hover:to-[#FE2C55]/20 hover:text-black">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#25F4EE]/60 hover:text-[#0f172a]"
            >
              Log in
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-gradient-to-r from-[#111111] via-[#1d1d1d] to-[#FE2C55] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Get Started
            </button>
          </div>
        </header>
      </div>

      <section className="mt-5">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-20">
          <div>
            <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl">
              Creative campaigns that connect brands and{" "}
              <span className="bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] bg-clip-text text-transparent">TikTok creators</span> in
              Ethiopia.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-700">
              DealerEth helps creators grow their income and brands reach the right audience through powerful collaborations.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href="/login"
                className="group relative flex items-start justify-between gap-3 overflow-hidden rounded-[24px_8px_24px_8px] border border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-white to-cyan-100/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg] hover:shadow-[0_20px_45px_rgba(37,244,238,0.22)]"
              >
                <span className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-cyan-300/35 blur-xl transition group-hover:scale-125" />
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[#25F4EE] shadow-sm">
                    <IconUser className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.08em] text-cyan-950">I&apos;m a Creator</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-700">Get your profile link and receive deals.</p>
                  </div>
                </div>
                <Arrow className="mt-1 h-5 w-5 text-[#25F4EE] transition group-hover:translate-x-0.5" />
              </a>

              <a
                href="/client/login"
                className="group relative flex items-start justify-between gap-3 overflow-hidden rounded-[8px_24px_8px_24px] border border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-rose-100/60 p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:rotate-[0.6deg] hover:shadow-[0_20px_45px_rgba(254,44,85,0.24)]"
              >
                <span className="absolute -left-8 -bottom-8 h-16 w-16 rounded-full bg-rose-300/35 blur-xl transition group-hover:scale-125" />
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-[#FE2C55] shadow-sm">
                    <IconBriefcase className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.08em] text-rose-950">I&apos;m a Brand</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-700">Find creators and launch campaigns.</p>
                  </div>
                </div>
                <Arrow className="mt-1 h-5 w-5 text-[#FE2C55] transition group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
              <div className="flex -space-x-2">
                {["/landing/face-1.jpg", "/landing/face-2.jpg", "/landing/face-3.jpg", "/landing/face-4.jpg"].map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`Creator avatar ${index + 1}`}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-[10px] font-bold text-white">
                  +120
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] bg-clip-text text-transparent">★★★★★</span>
                <span className="text-xs sm:text-sm">Trusted by creators and brands across Ethiopia</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white/80 to-white/50 p-0">
              <div className="relative min-h-[380px] w-full sm:min-h-[520px] lg:min-h-[640px]">
                <Image
                  src="/landing/dealereth-hero.png"
                  alt="DealerEth mobile preview"
                  fill
                  priority
                  quality={100}
                  sizes="(min-width: 1536px) 720px, (min-width: 1024px) 640px, 92vw"
                  className="object-contain p-2 contrast-[1.03] saturate-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <h2 className="text-center text-4xl font-black tracking-tight text-zinc-900">How it works</h2>
        <p className="mt-2 text-center text-sm text-zinc-600">Simple steps for powerful collaborations</p>

        <div className="relative mt-10 grid gap-8 lg:grid-cols-2">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/10 lg:block" />

          <article
            id="creators"
            className="group relative overflow-hidden rounded-[28px_10px_28px_10px] border border-cyan-200/90 bg-gradient-to-br from-cyan-50/90 via-white to-cyan-100/50 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(37,244,238,0.24)]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-300/35 blur-2xl transition group-hover:scale-125" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-[#25F4EE] shadow-sm">
                <IconUser className="h-5 w-5" />
              </span>
              <p className="text-xl font-black uppercase tracking-[0.08em] text-[#0F172A]">For Creators</p>
            </div>
            <ul className="mt-6 space-y-4">
              <Step variant="creator" number={1} title="Create your profile" text="Add your info, niche, audience and rates." />
              <Step variant="creator" number={2} title="Get your unique link" text="Share your DealerEth link in your TikTok bio." />
              <Step variant="creator" number={3} title="Receive deal requests" text="Brands send structured offers and briefs." />
              <Step variant="creator" number={4} title="Collaborate & earn" text="Choose the best deals and grow your brand." />
            </ul>
          </article>

          <article
            id="brands"
            className="group relative overflow-hidden rounded-[10px_28px_10px_28px] border border-rose-200/90 bg-gradient-to-br from-rose-50/90 via-white to-rose-100/50 p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(254,44,85,0.2)]"
          >
            <div className="pointer-events-none absolute -left-8 -bottom-8 h-20 w-20 rounded-full bg-rose-300/35 blur-2xl transition group-hover:scale-125" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-zinc-50 text-black shadow-sm">
                <IconBriefcase className="h-5 w-5" />
              </span>
              <p className="text-xl font-black uppercase tracking-[0.08em]">For Brands</p>
            </div>
            <ul className="mt-6 space-y-4">
              <Step variant="brand" number={1} title="Find the right creators" text="Search and discover creators by niche and audience." />
              <Step variant="brand" number={2} title="Send a campaign request" text="Tell them about your product and budget." />
              <Step variant="brand" number={3} title="Connect & collaborate" text="Creators review and accept your offers." />
              <Step variant="brand" number={4} title="Track & grow" text="Build long-term partnerships and boost your brand." />
            </ul>
          </article>
        </div>
      </section>

      <section id="features" className="border-y border-zinc-200/80 bg-gradient-to-b from-cyan-50/60 via-white to-rose-50/40">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
          <h2 className="text-center text-4xl font-black tracking-tight text-zinc-900">Why choose DealerEth?</h2>
          <p className="mt-2 text-center text-sm text-zinc-600">Built with speed, trust, and creator-first workflow in mind.</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,1.6fr]">
            <div className="relative overflow-hidden rounded-[28px_12px_28px_12px] border border-zinc-200 bg-white/85 p-7">
              <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-200/50 blur-2xl" />
              <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">DealerEth Value</p>
              <p className="mt-3 text-3xl font-black leading-tight text-zinc-900">
                One place to discover, connect, and launch creator campaigns that actually convert.
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                We combine creator identity, campaign briefs, and fast collaboration flow so brands and creators can move from idea to execution with less friction.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["shield", "Trusted & Secure", "Verified profile flow and structured requests keep collaborations safer."],
                ["target", "Right Audience", "Match by niche and community fit, not random DMs and guesswork."],
                ["bolt", "Fast Execution", "Launch campaign requests in minutes with clear goals and budget context."],
                ["spark", "Creative Growth", "Build repeat partnerships that grow both creator influence and brand results."],
              ].map(([icon, title, text]) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-[20px_8px_20px_8px] border border-zinc-200 bg-white/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)]"
                >
                  <span className="pointer-events-none absolute -right-7 -top-7 h-16 w-16 rounded-full bg-gradient-to-br from-[#25F4EE]/20 to-[#FE2C55]/20 blur-xl transition group-hover:scale-125" />
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#25F4EE]/35 via-[#00C2FF]/25 to-[#FE2C55]/30 text-zinc-900">
                    <FeatureIcon type={icon as "shield" | "target" | "bolt" | "spark"} />
                  </div>
                  <p className="mt-3 text-sm font-black uppercase tracking-[0.06em] text-zinc-900">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <h2 className="text-center text-4xl font-black tracking-tight text-zinc-900">FAQ</h2>
        <p className="mt-2 text-center text-sm text-zinc-600">Clear answers before you get started.</p>

        <div className="mx-auto mt-9 grid max-w-5xl gap-6 lg:grid-cols-[0.9fr,1.6fr]">
          <aside className="rounded-[24px_10px_24px_10px] border border-zinc-200 bg-white/80 p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Need help?</p>
            <p className="mt-3 text-2xl font-black leading-tight text-zinc-900">Common questions, quick answers.</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              We designed DealerEth to stay simple. If you still need support, use the contact page and we will guide you.
            </p>
          </aside>

          <div className="space-y-3">
            {[
              ["Is DealerEth a marketplace?", "No. It is a focused MVP for creator profiles, campaign requests, and straightforward collaboration setup."],
              ["Do creators pay to join?", "Not during early validation. We are focused on growth first, then pricing can evolve later."],
              ["Can brands message creators inside the app?", "Not in this MVP. We keep communication structured through requests instead of full chat."],
              ["How fast can a brand launch a campaign?", "A brand can publish a campaign request in a few minutes once profile and budget details are ready."],
              ["Can creators reject offers?", "Yes. Creators can review campaign details and choose only the opportunities that fit their audience and values."],
              ["Does DealerEth support long-term partnerships?", "Yes. The platform is built to help brands and creators build repeat collaborations over time."],
            ].map(([q, a], index) => (
              <details
                key={q}
                className="group rounded-[18px_8px_18px_8px] border border-zinc-200 bg-white/90 p-4 open:border-[#25F4EE]/50 open:bg-gradient-to-r open:from-cyan-50/45 open:to-rose-50/35"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-bold text-zinc-900">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] bg-zinc-900 text-[11px] font-black text-white">
                    {index + 1}
                  </span>
                  <span>{q}</span>
                  <span className="ml-auto text-base text-zinc-400 transition group-open:rotate-45 group-open:text-zinc-700">+</span>
                </summary>
                <p className="mt-3 pl-10 text-xs leading-6 text-zinc-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-[linear-gradient(130deg,#101010,#161616_45%,#2c0f1b)]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 py-12 text-white sm:px-10 lg:px-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Ready to start?</h2>
            <p className="mt-3 max-w-md text-sm text-zinc-300">Join DealerEth today and start creating impactful collaborations.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/login"
              className="rounded-xl bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(254,44,85,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(254,44,85,0.35)]"
            >
              I&apos;m a Creator
            </a>
            <a
              href="/client/login"
              className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              I&apos;m a Brand
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 py-8 text-xs text-zinc-600 sm:px-10 lg:px-12">
          <p className="max-w-md leading-5">
            <span className="font-black text-black">Dealer</span>
            <span className="bg-gradient-to-r from-[#25F4EE] via-[#00C2FF] to-[#FE2C55] bg-clip-text font-black text-transparent">Eth</span>
            <span className="ml-2">Connecting brands with TikTok creators in Ethiopia.</span>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="transition hover:text-black">
              About Us
            </a>
            <a href="#" className="transition hover:text-black">
              Contact
            </a>
            <a href="#" className="transition hover:text-black">
              Terms
            </a>
            <a href="#" className="transition hover:text-black">
              Privacy
            </a>
          </div>

          <div className="flex items-center gap-2">
            <SocialIcon label="TikTok" />
            <SocialIcon label="Instagram" />
            <SocialIcon label="Twitter" />
            <SocialIcon label="YouTube" />
          </div>
        </div>
      </footer>

      <RoleModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
