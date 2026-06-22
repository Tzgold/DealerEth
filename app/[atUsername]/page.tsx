import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { DealRequestForm } from "@/components/forms/deal-request-form";
import { prisma } from "@/lib/prisma";

export default async function CreatorPublicPage({ params }: { params: Promise<{ atUsername: string }> }) {
  const { atUsername } = await params;
  const normalizedUsername = atUsername.startsWith("@") ? atUsername.slice(1) : atUsername;

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
  const profilePath = `/@${profile.username}`;
  const profilePageUrl = host ? `${proto}://${host}${profilePath}` : profilePath;
  const displayHost = host.replace(/^www\./, "");

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="border-b border-white/5 bg-[#0a0a0b]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-black">
            <span className="text-white">dealer</span>
            <span className="text-[#25F4EE]">Eth</span>
          </Link>
          <p className="text-xs font-semibold text-white/50">Creator profile</p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <div className="bg-gradient-to-r from-[#25F4EE]/15 via-transparent to-[#FE2C55]/15 px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#25F4EE]">DealerEth creator</p>
              <p className="mt-1 text-sm text-white/65">Public page — brands can request a paid collaboration here.</p>
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
            <h2 className="text-lg font-black">At a glance</h2>
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
            <h2 className="text-lg font-black">Portfolio</h2>
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

        <section className="de-card h-fit p-6">
          <p className="de-eyebrow">For brands</p>
          <h2 className="mt-2 text-2xl font-extrabold">Request a collaboration</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">Send budget, deliverables, and timeline. The creator gets notified on DealerEth.</p>
          <div className="mt-5">
            <DealRequestForm creatorId={profile.id} dark />
          </div>
        </section>
      </div>
    </div>
  );
}
