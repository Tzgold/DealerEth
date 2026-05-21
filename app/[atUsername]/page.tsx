import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DealRequestForm } from "@/components/forms/deal-request-form";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(37,244,238,0.14),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(254,44,85,0.14),transparent_35%),#f8fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden rounded-[24px] border-zinc-200 bg-white/95 p-0 shadow-sm ring-1 ring-black/[0.04]">
            <div className="bg-gradient-to-r from-[#25F4EE]/20 via-white to-[#FE2C55]/20 px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-600">DealerEth creator</p>
              <p className="mt-1 text-sm text-zinc-600">Public page for brands — request a collaboration with budget and brief.</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start gap-4">
                <img src={avatar} alt="" className="h-20 w-20 shrink-0 rounded-2xl border border-zinc-200 object-cover bg-white" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900">{profile.name}</h1>
                  <p className="mt-1 text-sm font-semibold text-zinc-600">{profile.tiktokHandle}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Profile <span className="font-mono font-semibold text-zinc-800">{profilePath}</span>
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-zinc-700">{profile.bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-800">Niche: {profile.niche}</span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-800">
                  Followers: {profile.followers.toLocaleString()}
                </span>
                {profile.priceRange && (
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-800">Guide rate: {profile.priceRange}</span>
                )}
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-zinc-800">{sampleVideos.length} portfolio links</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-[24px] border border-zinc-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900">At a glance</h2>
            <p className="mt-1 text-sm text-zinc-600">What brands see before they send a request.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Audience</p>
                <p className="mt-1 text-lg font-black text-zinc-900">{profile.followers.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">Followers (self-reported)</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Content focus</p>
                <p className="mt-1 text-lg font-black text-zinc-900">{profile.niche}</p>
                <p className="text-xs text-zinc-500">Best-fit campaigns</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Bio link (this page)</p>
                <p className="mt-1 break-all font-mono text-sm font-medium text-zinc-900">{profilePageUrl}</p>
                <p className="mt-2 text-xs text-zinc-500">Creators: add this URL to your TikTok bio so inbound deals stay organized on DealerEth.</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[24px] border-zinc-200 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900">Portfolio</h2>
            <p className="mt-1 text-sm text-zinc-600">Sample TikToks that show your style and audience fit for paid collaborations.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {sampleVideos.length === 0 ? (
                <li className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-zinc-600">No portfolio links yet.</li>
              ) : (
                sampleVideos.map((video, index) => (
                  <li key={video} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">{index + 1}</span>
                    <a className="min-w-0 flex-1 break-all font-medium text-zinc-800 underline decoration-[#25F4EE] decoration-2 underline-offset-2" href={video} target="_blank" rel="noreferrer">
                      {video}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        <Card className="h-fit rounded-[24px] border-zinc-200 bg-white/95 p-6 shadow-sm ring-1 ring-black/[0.04]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">For brands</p>
          <h2 className="mt-2 text-xl font-black text-zinc-900">Request a collaboration</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Send deliverables, timeline, and budget. The creator sees your message on DealerEth and can follow up here — keep campaign details in one place.
          </p>
          <DealRequestForm creatorId={profile.id} />
        </Card>
      </div>
    </div>
  );
}
