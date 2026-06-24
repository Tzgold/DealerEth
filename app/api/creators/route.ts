import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "CLIENT") return NextResponse.json({ error: "Only brands can discover creators." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const niche = (searchParams.get("niche") ?? "").trim().toLowerCase();
  const minFollowers = Number.parseInt(searchParams.get("minFollowers") ?? "", 10);
  const maxFollowers = Number.parseInt(searchParams.get("maxFollowers") ?? "", 10);
  const hasRate = searchParams.get("hasRate") === "1";
  const sort = searchParams.get("sort") ?? "followers_desc";

  const creators = await prisma.creatorProfile.findMany({
    orderBy: { followers: "desc" },
    take: 100,
    include: {
      user: { select: { tiktokAvatarUrl: true, googleAvatarUrl: true } },
    },
  });

  const filtered = creators.filter((creator) => {
    const text = `${creator.name} ${creator.username} ${creator.tiktokHandle} ${creator.niche} ${creator.bio}`.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesNiche = !niche || creator.niche.toLowerCase().includes(niche);
    const matchesMinFollowers = Number.isNaN(minFollowers) || creator.followers >= minFollowers;
    const matchesMaxFollowers = Number.isNaN(maxFollowers) || creator.followers <= maxFollowers;
    const matchesRate = !hasRate || Boolean(creator.priceRange?.trim());
    return matchesQuery && matchesNiche && matchesMinFollowers && matchesMaxFollowers && matchesRate;
  }).sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "followers_asc") return a.followers - b.followers;
    return b.followers - a.followers;
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
