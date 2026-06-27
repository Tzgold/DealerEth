import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="product-editorial min-h-screen bg-[#f7f6f2] text-[#11110f]">
      <header className="border-b border-black/10 bg-[#f7f6f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">
            DEALERETH
          </Link>
          <Link href="/" className="de-chip">
            Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <section className="border-b border-black/10 pb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/45">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.05em] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-black/60">{intro}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
            Last updated: {updatedAt}
          </p>
        </section>

        <article className="legal-content mt-10 grid gap-8 text-sm leading-7 text-black/66">
          {children}
        </article>
      </main>

      <SiteFooter variant="light" />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/55 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-black">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
