import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { DealRequestForm } from "@/components/forms/deal-request-form";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function CreatorPublicPage({ params }: { params: Promise<{ atUsername: string }> }) {
  const { atUsername } = await params;
  const normalizedUsername = atUsername.trim().replace(/^@+/, "").toLowerCase();

  const profile = await prisma.creatorProfile.findUnique({
    where: { username: normalizedUsername },
    include: {
      user: {
        select: {
          tiktokAvatarUrl: true,
          googleAvatarUrl: true,
        },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  const sampleVideos = Array.isArray(profile.sampleVideos) ? (profile.sampleVideos as string[]) : [];
  const avatar = profile.avatarUrl ?? profile.user.tiktokAvatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const profilePath = `/${profile.username}`;
  const profilePageUrl = host ? `${proto}://${host}${profilePath}` : profilePath;
  const displayHost = host.replace(/^www\./, "");
  const session = await getSessionUser();
  const clientProfile = session?.role === "CLIENT"
    ? await prisma.clientProfile.findUnique({
        where: { userId: session.userId },
        include: {
          campaigns: {
            where: { status: "LIVE" },
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, description: true, budget: true, deliverables: true, deadline: true },
          },
        },
      })
    : null;

  return (
    <div className="product-editorial public-profile-editorial min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f6f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">DEALERETH</Link>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">Creator media kit</p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <div className="bg-gradient-to-r from-[#25F4EE]/15 via-transparent to-[#FE2C55]/15 px-6 py-4">
              <p className="de-eyebrow">Available for partnerships</p>
              <p className="mt-1 text-sm text-white/65">A clear view of this creator’s audience, work, and collaboration details.</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start gap-4">
                <img src={avatar} alt="" className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 object-cover" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-black tracking-tight">{profile.name}</h1>
                  <p className="mt-1 text-sm font-semibold text-white/60">{profile.tiktokHandle}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                    <span className="truncate font-mono text-xs text-white/85">
                      {displayHost}
                      {profilePath}
                    </span>
                    <CopyLinkButton value={profilePageUrl} />
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-white/80">{profile.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">Niche: {profile.niche}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">
                  {profile.followers.toLocaleString()} followers
                </span>
                {profile.priceRange && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold">Rate: {profile.priceRange}</span>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#141416] p-6">
            <p className="de-eyebrow">Creator overview</p>
            <h2 className="mt-2 text-lg font-black">At a glance</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-white/50">Audience</p>
                <p className="mt-1 text-lg font-black">{profile.followers.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-white/50">Content focus</p>
                <p className="mt-1 text-lg font-black">{profile.niche}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#141416] p-6">
            <p className="de-eyebrow">Selected work</p>
            <h2 className="mt-2 text-lg font-black">Portfolio</h2>
            <ul className="mt-4 space-y-2">
              {sampleVideos.length === 0 ? (
                <li className="rounded-xl border border-dashed border-white/15 px-3 py-4 text-sm text-white/50">No portfolio links yet.</li>
              ) : (
                sampleVideos.map((video, index) => (
                  <li key={video} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold">{index + 1}</span>
                    <a className="min-w-0 flex-1 break-all text-sm font-medium text-[#25F4EE] underline underline-offset-2" href={video} target="_blank" rel="noreferrer">
                      {video}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <section className="de-card h-fit p-6 lg:sticky lg:top-24">
          <p className="de-eyebrow">Start a conversation</p>
          <h2 className="mt-2 text-2xl font-extrabold">Request a collaboration</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">Share the campaign idea, budget, deliverables, and timeline. The request goes directly to the creator’s DealerEth inbox.</p>
          <div className="mt-5">
            <DealRequestForm
              creatorId={profile.id}
              dark
              initialName={clientProfile?.companyName ?? ""}
              initialEmail={session?.role === "CLIENT" ? session.email : ""}
              campaigns={clientProfile?.campaigns ?? []}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
