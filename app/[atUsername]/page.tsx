import { notFound } from "next/navigation";
import { DealRequestForm } from "@/components/forms/deal-request-form";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function CreatorPublicPage({ params }: { params: Promise<{ atUsername: string }> }) {
  const { atUsername } = await params;
  const normalizedUsername = atUsername.startsWith("@") ? atUsername.slice(1) : atUsername;

  const profile = await prisma.creatorProfile.findUnique({
    where: { username: normalizedUsername },
  });

  if (!profile) {
    notFound();
  }

  const sampleVideos = Array.isArray(profile.sampleVideos) ? (profile.sampleVideos as string[]) : [];

  return (
    <div className="mx-auto grid max-w-3xl gap-4">
      <Card>
        <p className="text-xs text-zinc-500">TikTok creator profile</p>
        <h1 className="mt-1 text-2xl font-semibold">{profile.name}</h1>
        <p className="text-sm text-zinc-600">{profile.tiktokHandle}</p>
        <p className="mt-3 text-sm text-zinc-700">{profile.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-700">
          <span className="rounded-full border border-black/10 px-3 py-1">Niche: {profile.niche}</span>
          <span className="rounded-full border border-black/10 px-3 py-1">Followers: {profile.followers.toLocaleString()}</span>
          {profile.priceRange && <span className="rounded-full border border-black/10 px-3 py-1">Price: {profile.priceRange}</span>}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Sample videos</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {sampleVideos.length === 0 ? (
            <li className="text-zinc-600">No sample videos yet.</li>
          ) : (
            sampleVideos.map((video) => (
              <li key={video}>
                <a className="text-zinc-800 underline" href={video} target="_blank" rel="noreferrer">
                  {video}
                </a>
              </li>
            ))
          )}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Request Promotion</h2>
        <p className="mb-3 text-sm text-zinc-600">Brands can submit campaign requirements below.</p>
        <DealRequestForm creatorId={profile.id} />
      </Card>
    </div>
  );
}
