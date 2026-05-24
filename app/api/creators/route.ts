import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const niche = (searchParams.get("niche") ?? "").trim().toLowerCase();

  const creators = await prisma.creatorProfile.findMany({
    orderBy: { followers: "desc" },
    take: 50,
    include: {
      user: { select: { tiktokAvatarUrl: true, googleAvatarUrl: true } },
    },
  });

  const filtered = creators.filter((creator) => {
    const text = `${creator.name} ${creator.username} ${creator.tiktokHandle} ${creator.niche} ${creator.bio}`.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesNiche = !niche || creator.niche.toLowerCase().includes(niche);
    return matchesQuery && matchesNiche;
  });

  return NextResponse.json({
    creators: filtered.map((c) => ({
      id: c.id,
      username: c.username,
      name: c.name,
      tiktokHandle: c.tiktokHandle,
      niche: c.niche,
      followers: c.followers,
      priceRange: c.priceRange,
      bio: c.bio,
      avatarUrl: c.avatarUrl ?? c.user.tiktokAvatarUrl ?? c.user.googleAvatarUrl,
    })),
  });
}
