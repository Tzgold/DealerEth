import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { AvatarImage } from "@/components/ui/avatar-image";
import { prisma } from "@/lib/prisma";

export default async function BrandPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = slug.trim().toLowerCase();

  const profile = await prisma.clientProfile.findUnique({
    where: { slug: normalizedSlug },
    include: {
      user: { select: { googleAvatarUrl: true } },
      campaigns: {
        where: { status: "LIVE" },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          niche: true,
          deliverables: true,
          deadline: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  const avatar = profile.avatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const profilePath = `/brand/${profile.slug}`;
  const profilePageUrl = host ? `${proto}://${host}${profilePath}` : profilePath;
  const displayHost = host.replace(/^www\./, "");

  return (
    <div className="product-editorial public-profile-editorial min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f6f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">
            DEALERETH
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">Brand page</p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <div className="bg-gradient-to-r from-[#25F4EE]/12 via-transparent to-white/5 px-6 py-4">
              <p className="de-eyebrow">Looking for creators</p>
              <p className="mt-1 text-sm text-white/65">Company context, open campaigns, and how to reach this brand.</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start gap-4">
                <AvatarImage src={avatar} className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 object-cover" size={80} priority />
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-black tracking-tight">{profile.companyName}</h1>
                  <p className="mt-1 text-sm font-semibold text-white/60">{profile.industry}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                    <span className="truncate font-mono text-xs text-white/85">
                      {displayHost}
                      {profilePath}
                    </span>
                    <CopyLinkButton value={profilePageUrl} />
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/80">{profile.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
                  Contact: {profile.contactName}
                </span>
                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[#25F4EE]"
                  >
                    Website
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#141416] p-6">
            <p className="de-eyebrow">Open campaigns</p>
            <h2 className="mt-2 text-lg font-black">Live briefs</h2>
            {profile.campaigns.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-white/15 px-3 py-4 text-sm text-white/50">
                No live campaigns right now.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {profile.campaigns.map((campaign) => (
                  <li key={campaign.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-base font-black text-white">{campaign.title}</h3>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70">
                        {campaign.niche}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/70">{campaign.description}</p>
                    <p className="mt-3 text-xs font-semibold text-white/55">
                      Budget: {campaign.budget}
                      {campaign.deadline ? ` · Deadline: ${campaign.deadline}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="de-card p-6">
            <p className="de-eyebrow">For creators</p>
            <h2 className="mt-2 text-2xl font-extrabold">Work with this brand</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Browse live campaigns on DealerEth and apply with a clear pitch. Brands review applications and chat
              in-app.
            </p>
            <Link href="/signup" className="de-btn de-btn-primary mt-5 inline-flex">
              Join as a creator
            </Link>
            <Link href="/login" className="de-btn de-btn-secondary mt-3 inline-flex">
              Creator login
            </Link>
          </section>
        </aside>
      </main>
    </div>
  );
}
