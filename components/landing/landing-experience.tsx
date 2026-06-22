"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const creatorSteps = ["Build a credible creator profile", "Share your DealerEth bio link", "Review briefs and direct offers", "Collaborate and get paid"];
const brandSteps = ["Create a trusted brand profile", "Discover creators by niche", "Publish a clear campaign brief", "Review applications and collaborate"];

function EditorialIcon({ index, className = "h-6 w-6" }: { index: number; className?: string }) {
  const paths = [
    <path key="user" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.6-3.4 3.1-5.5 7-5.5s6.4 2.1 7 5.5" />,
    <path key="brief" d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7m-12 4h16M5 7h14a1 1 0 0 1 1 1v10H4V8a1 1 0 0 1 1-1Z" />,
    <path key="search" d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />,
    <path key="chat" d="M5 5h14v10H9l-4 4V5Zm4 4h6m-6 3h4" />,
  ];
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index % paths.length]}</svg>;
}

function RoleModal({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onClick={close}>
      <section className="de-card w-full max-w-lg p-6 sm:p-7" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div><p className="de-eyebrow">Choose your workspace</p><h2 className="mt-1 text-2xl font-extrabold text-white">How will you use DealerEth?</h2></div>
          <button type="button" onClick={close} className="de-btn de-btn-secondary min-h-9 px-3" aria-label="Close">×</button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/signup" className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]">
            <span className="text-2xl">✦</span><h3 className="mt-4 font-extrabold text-white">I’m a creator</h3><p className="mt-1 text-sm leading-6 text-white/60">Create your profile, find campaigns, and manage brand deals.</p><p className="mt-5 text-sm font-bold text-white">Create creator account →</p>
          </Link>
          <Link href="/client/signup" className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]">
            <span className="text-2xl">◆</span><h3 className="mt-4 font-extrabold text-white">I’m a brand</h3><p className="mt-1 text-sm leading-6 text-white/60">Discover talent, publish briefs, and run collaborations.</p><p className="mt-5 text-sm font-bold text-white">Create brand account →</p>
          </Link>
        </div>
        <p className="mt-5 text-center text-sm text-white/50">Already registered? <Link href="/login" className="font-bold text-white underline decoration-white/25 underline-offset-4 hover:decoration-white">Sign in</Link></p>
      </section>
    </div>
  );
}

export function LandingExperience() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="editorial-shell min-h-screen overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#09090b]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center px-5 sm:px-8">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">DEALERETH</Link>
          <nav className="ml-10 hidden items-center gap-1 md:flex">
            {[['#how','How it works'],['#features','Why DealerEth'],['#faq','FAQ']].map(([href,label]) => <a key={href} href={href} className="de-chip border-transparent bg-transparent">{label}</a>)}
          </nav>
          <div className="ml-auto flex items-center gap-2"><Link href="/login" className="de-btn de-btn-secondary">Sign in</Link><button type="button" onClick={() => setModalOpen(true)} className="de-btn de-btn-primary">Get started</button></div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="pointer-events-none absolute -left-64 top-0 h-[520px] w-[520px] rounded-full bg-white/[0.04] blur-3xl" />
          <div className="relative">
            <div className="de-chip de-chip-active w-fit">Built for Ethiopia’s creator economy</div>
            <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.03] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">Better brand deals start with a <span className="text-white/55">better connection.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">DealerEth gives TikTok creators and brands one professional place to discover each other, share clear briefs, and turn good ideas into paid collaborations.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="de-btn de-btn-primary">Join as a creator</Link><Link href="/client/signup" className="de-btn de-btn-secondary">Join as a brand</Link></div>
            <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-white/[0.08] pt-6">
              <div className="flex -space-x-2">{[1,2,3,4].map((number) => <Image key={number} src={`/landing/face-${number}.jpg`} alt="Creator" width={36} height={36} className="h-9 w-9 rounded-full border-2 border-[#09090b] object-cover" />)}</div>
              <p className="text-sm text-white/55"><span className="font-bold text-white">Creator-first.</span> Clear for brands. Built locally.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-white/[0.035] blur-3xl" />
            <div className="de-card relative overflow-hidden p-3"><div className="relative min-h-[460px] sm:min-h-[590px]"><Image src="/landing/dealereth-hero.png" alt="DealerEth creator profile and campaign preview" fill priority sizes="(min-width: 1024px) 48vw, 90vw" className="object-contain" /></div></div>
          </div>
        </section>

        <section id="how" className="border-y border-white/[0.07] bg-white/[0.018]">
          <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
            <p className="de-eyebrow">A simpler workflow</p><h2 className="mt-2 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">From discovery to collaboration, without the messy DMs.</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {[["For creators", creatorSteps, "text-white", "border-white/10"], ["For brands", brandSteps, "text-white", "border-white/10"]].map(([title, steps, color, border]) => (
                <article key={title as string} className={`de-card p-6 sm:p-7 ${border}`}><h3 className={`text-xl font-extrabold ${color}`}>{title as string}</h3><ol className="mt-6 space-y-3">{(steps as string[]).map((step,index) => <li key={step} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/15 hover:bg-white/[0.045]"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.07] text-xs font-bold text-white/70">0{index+1}</span><span className="font-semibold text-white/80">{step}</span></li>)}</ol></article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="de-eyebrow">Why DealerEth</p><h2 className="mt-2 text-4xl font-extrabold tracking-tight">Professional tools for real creator work.</h2><p className="mt-4 text-sm leading-7 text-white/60">One focused workspace replaces scattered links, vague messages, and campaign details lost in chat.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{[["Clear profiles","Show niche, audience, rates, and portfolio in one shareable page."],["Structured briefs","Budget, deliverables, and timeline are clear before anyone commits."],["Creator discovery","Brands can search by niche and review creators before reaching out."],["Deal workflow","Applications, statuses, and conversations stay connected to the campaign."]].map(([title,text], index) => <article key={title} className="de-card p-5 transition hover:-translate-y-0.5 hover:border-black/20"><EditorialIcon index={index} className="h-7 w-7 text-black/70" /><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{text}</p></article>)}</div>
          </div>
        </section>

        <section id="faq" className="border-y border-white/[0.07] bg-white/[0.018]"><div className="mx-auto max-w-4xl px-5 py-20 sm:px-8"><p className="de-eyebrow">Common questions</p><h2 className="mt-2 text-4xl font-extrabold">A few things worth knowing.</h2><div className="mt-8 space-y-3">{[["Who is DealerEth for?","Ethiopian TikTok creators and brands that want clearer, more professional collaborations."],["Can creators choose which offers to accept?","Yes. Creators review campaign details and decide what fits their audience and values."],["Can brands talk with applicants?","Yes. Every campaign application can become a focused message thread."],["Does it work on mobile?","Yes. Creator and brand workspaces include responsive mobile navigation and forms."]].map(([q,a]) => <details key={q} className="de-card group p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold"><span>{q}</span><span className="text-xl text-white/40 transition group-open:rotate-45 group-open:text-white">+</span></summary><p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">{a}</p></details>)}</div></div></section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8"><div className="de-card relative overflow-hidden p-8 sm:p-12"><div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" /><div className="relative flex flex-wrap items-end justify-between gap-8"><div><p className="de-eyebrow">Ready when you are</p><h2 className="mt-2 max-w-xl text-4xl font-extrabold tracking-tight">Make your next collaboration easier to start—and easier to manage.</h2></div><button type="button" onClick={() => setModalOpen(true)} className="de-btn de-btn-primary">Create your workspace</button></div></div></section>
      </main>

      <footer className="border-t border-white/[0.07]"><div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-5 px-5 py-8 text-sm text-white/45 sm:px-8"><p><span className="font-black text-white">dealerEth</span> · Creator partnerships, made clearer.</p><div className="flex gap-5"><a href="#how" className="hover:text-white">How it works</a><a href="#faq" className="hover:text-white">FAQ</a><Link href="/login" className="hover:text-white">Sign in</Link></div></div></footer>
      {modalOpen && <RoleModal close={() => setModalOpen(false)} />}
    </div>
  );
}
