import Link from "next/link";
import { requireClientProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function BrandCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; niche?: string }>;
}) {
  const { q, niche } = await searchParams;
  await requireClientProfile();

  const creators = await prisma.creatorProfile.findMany({
    orderBy: { followers: "desc" },
    take: 50,
    include: { user: { select: { tiktokAvatarUrl: true, googleAvatarUrl: true } } },
  });

  const searchQuery = (q ?? "").trim().toLowerCase();
  const nicheFilter = (niche ?? "").trim().toLowerCase();

  const filtered = creators.filter((creator) => {
    const text = `${creator.name} ${creator.username} ${creator.tiktokHandle} ${creator.niche} ${creator.bio}`.toLowerCase();
    const matchesQuery = !searchQuery || text.includes(searchQuery);
    const matchesNiche = !nicheFilter || creator.niche.toLowerCase().includes(nicheFilter);
    return matchesQuery && matchesNiche;
  });

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Discover creators</h1>
        <p className="mt-1 text-sm text-white/65">Browse TikTok creators and open their public pages to request a deal.</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search creators"
          className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <input
          name="niche"
          defaultValue={niche ?? ""}
          placeholder="Filter by niche"
          className="w-40 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
        <button type="submit" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-900">
          Search
        </button>
      </form>

      <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <li className="col-span-full rounded-2xl border border-white/10 bg-[#141416] px-5 py-8 text-sm text-white/60">No creators found.</li>
        ) : (
          filtered.map((creator) => {
            const avatar = creator.avatarUrl ?? creator.user.tiktokAvatarUrl ?? creator.user.googleAvatarUrl ?? "/next.svg";
            return (
              <li key={creator.id} className="rounded-2xl border border-white/10 bg-[#141416] p-4">
                <div className="flex gap-3">
                  <img src={avatar} alt="" className="h-12 w-12 rounded-xl border border-white/10 object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold text-white">{creator.name}</p>
                    <p className="text-xs text-white/60">{creator.tiktokHandle}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {creator.niche} · {creator.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-white/70">{creator.bio}</p>
                <Link
                  href={`/@${creator.username}`}
                  className="mt-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                >
                  View profile & request deal
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}
