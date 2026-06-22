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
          <Link href="/signup" className="landing-role-card group rounded-2xl border p-5 transition">
            <span className="text-2xl">✦</span><h3 className="mt-4 font-extrabold text-white">I’m a creator</h3><p className="mt-1 text-sm leading-6 text-white/60">Create your profile, find campaigns, and manage brand deals.</p><p className="mt-5 text-sm font-bold text-white">Create creator account →</p>
          </Link>
          <Link href="/client/signup" className="landing-role-card group rounded-2xl border p-5 transition">
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
          <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
            <div><p className="de-eyebrow">A simpler workflow</p><h2 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">From discovery to collaboration, without the messy DMs.</h2></div>
            <div className="grid gap-10 xl:grid-cols-2">
              {[["For creators", creatorSteps], ["For brands", brandSteps]].map(([title, steps]) => (
                <article key={title as string} className="landing-workflow-group">
                  <div className="flex items-center justify-between border-b border-black/15 pb-4"><h3 className="text-2xl font-normal">{title as string}</h3><EditorialIcon index={title === "For creators" ? 0 : 1} className="h-7 w-7 text-black/55" /></div>
                  <ol className="mt-4 space-y-3">{(steps as string[]).map((step,index) => <li key={step} className="landing-workflow-row grid min-h-20 grid-cols-[1fr_52px] items-center gap-4 rounded-2xl border px-5 py-4 transition"><span className="text-base leading-snug">{step}</span><span className="landing-step-number grid h-11 w-11 place-items-center rounded-full border text-xs font-semibold">0{index+1}</span></li>)}</ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <div><div className="max-w-3xl"><p className="de-eyebrow">Why DealerEth</p><h2 className="mt-2 text-4xl font-extrabold tracking-tight">Professional tools for real creator work.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">One focused workspace replaces scattered links, vague messages, and campaign details lost in chat.</p></div>
            <div className="landing-feature-grid mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Clear profiles","Show niche, audience, rates, and portfolio in one shareable page."],["Structured briefs","Budget, deliverables, and timeline are clear before anyone commits."],["Creator discovery","Brands can search by niche and review creators before reaching out."],["Deal workflow","Applications, statuses, and conversations stay connected to the campaign."]].map(([title,text], index) => <article key={title} className="landing-feature-card flex min-h-[330px] flex-col border p-6 sm:p-7"><EditorialIcon index={index} className="h-8 w-8 text-black/70" /><div className="mt-auto pt-20"><h3 className="text-xl font-normal leading-tight">{title}</h3><p className="mt-6 text-sm leading-6 text-white/55">{text}</p></div></article>)}</div>
          </div>
        </section>

        <section id="faq" className="border-y border-white/[0.07] bg-white/[0.018]"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16"><div><p className="de-eyebrow">Common questions</p><h2 className="mt-3 text-4xl font-extrabold leading-[1.05]">A few things worth knowing.</h2></div><div className="space-y-4">{[["Who is DealerEth for?","Ethiopian TikTok creators and brands that want clearer, more professional collaborations."],["Can creators choose which offers to accept?","Yes. Creators review campaign details and decide what fits their audience and values."],["Can brands talk with applicants?","Yes. Every campaign application can become a focused message thread."],["Does it work on mobile?","Yes. Creator and brand workspaces include responsive mobile navigation and forms."]].map(([q,a]) => <details key={q} className="landing-faq-row group border"><summary className="grid cursor-pointer list-none items-center gap-4 px-5 py-5 sm:grid-cols-[minmax(180px,.8fr)_minmax(240px,1.25fr)_64px] sm:px-7"><span className="text-lg leading-tight sm:text-xl">{q}</span><span className="hidden text-sm leading-6 text-black/50 sm:block">{a}</span><span className="landing-faq-control ml-auto grid h-12 w-12 place-items-center rounded-full border text-2xl font-light transition group-open:rotate-45">+</span></summary><p className="px-5 pb-5 text-sm leading-7 text-black/55 sm:hidden">{a}</p></details>)}</div></div></section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8"><div className="landing-final-cta border p-8 sm:p-12"><div className="flex flex-wrap items-end justify-between gap-8"><div><p className="de-eyebrow">Ready when you are</p><h2 className="mt-2 max-w-xl text-4xl font-extrabold tracking-tight">Make your next collaboration easier to start—and easier to manage.</h2></div><button type="button" onClick={() => setModalOpen(true)} className="de-btn de-btn-primary">Create your workspace</button></div></div></section>
      </main>

      <footer className="border-t border-white/[0.07]"><div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-5 px-5 py-8 text-sm text-white/45 sm:px-8"><p><span className="font-black text-white">dealerEth</span> · Creator partnerships, made clearer.</p><div className="flex gap-5"><a href="#how" className="landing-footer-link">How it works</a><a href="#faq" className="landing-footer-link">FAQ</a><Link href="/login" className="landing-footer-link">Sign in</Link></div></div></footer>
      {modalOpen && <RoleModal close={() => setModalOpen(false)} />}
    </div>
  );
}
