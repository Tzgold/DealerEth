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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(37,244,238,0.14),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(254,44,85,0.14),transparent_35%),#f8fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">TikTok creator profile</p>
            <img src={avatar} alt={`${profile.name} avatar`} className="mt-3 h-16 w-16 rounded-full border border-zinc-200 object-cover bg-white" />
            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900">{profile.name}</h1>
            <p className="text-sm font-medium text-zinc-600">{profile.tiktokHandle}</p>
            <p className="mt-4 text-sm leading-7 text-zinc-700">{profile.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-700">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">Niche: {profile.niche}</span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">Followers: {profile.followers.toLocaleString()}</span>
              {profile.priceRange && <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">Rate: {profile.priceRange}</span>}
            </div>
          </Card>

          <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-6">
            <h2 className="text-lg font-black text-zinc-900">Profile details</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-xs text-zinc-500">Username</p>
                <p className="font-semibold text-zinc-900">@{profile.username}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-xs text-zinc-500">Niche</p>
                <p className="font-semibold text-zinc-900">{profile.niche}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-xs text-zinc-500">Followers</p>
                <p className="font-semibold text-zinc-900">{profile.followers.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-xs text-zinc-500">Sample videos</p>
                <p className="font-semibold text-zinc-900">{sampleVideos.length}</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-6">
            <h2 className="text-lg font-black text-zinc-900">Portfolio samples</h2>
            <p className="mt-1 text-sm text-zinc-600">Recent sample videos that show style and audience fit.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {sampleVideos.length === 0 ? (
                <li className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-600">No sample videos yet.</li>
              ) : (
                sampleVideos.map((video) => (
                  <li key={video} className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
                    <a className="font-medium text-zinc-800 underline underline-offset-4" href={video} target="_blank" rel="noreferrer">
                      {video}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        <Card className="h-fit rounded-[24px] border-zinc-200 bg-white/90 p-6">
          <h2 className="text-lg font-black text-zinc-900">Request Promotion</h2>
          <p className="mb-4 text-sm text-zinc-600">Share campaign details, deliverables, and budget. The creator reviews and responds.</p>
          <DealRequestForm creatorId={profile.id} />
        </Card>
      </div>
    </div>
  );
}
