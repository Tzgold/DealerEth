import Link from "next/link";
import { requireClientProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function BrandCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; niche?: string; minFollowers?: string; maxFollowers?: string; hasRate?: string; sort?: string }>;
}) {
  const { q, niche, minFollowers, maxFollowers, hasRate, sort } = await searchParams;
  await requireClientProfile();

  const creators = await prisma.creatorProfile.findMany({
    orderBy: { followers: "desc" },
    take: 100,
    include: { user: { select: { tiktokAvatarUrl: true, googleAvatarUrl: true } } },
  });

  const searchQuery = (q ?? "").trim().toLowerCase();
  const nicheFilter = (niche ?? "").trim().toLowerCase();
  const minimumFollowers = Number.parseInt(minFollowers ?? "", 10);
  const maximumFollowers = Number.parseInt(maxFollowers ?? "", 10);
  const shouldRequireRate = hasRate === "1";
  const activeSort = sort === "name" || sort === "followers_asc" ? sort : "followers_desc";

  const filtered = creators.filter((creator) => {
    const text = `${creator.name} ${creator.username} ${creator.tiktokHandle} ${creator.niche} ${creator.bio}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery);
    const matchesNiche = !nicheFilter || creator.niche.toLowerCase() === nicheFilter;
    const matchesMinFollowers = Number.isNaN(minimumFollowers) || creator.followers >= minimumFollowers;
    const matchesMaxFollowers = Number.isNaN(maximumFollowers) || creator.followers <= maximumFollowers;
    const matchesRate = !shouldRequireRate || Boolean(creator.priceRange?.trim());
    return matchesSearch && matchesNiche && matchesMinFollowers && matchesMaxFollowers && matchesRate;
  }).sort((a, b) => {
    if (activeSort === "name") return a.name.localeCompare(b.name);
    if (activeSort === "followers_asc") return a.followers - b.followers;
    return b.followers - a.followers;
  });

  const niches = Array.from(new Set(creators.map((creator) => creator.niche.trim()).filter(Boolean))).sort();
  const hasActiveFilters = Boolean(q || niche || minFollowers || maxFollowers || hasRate || (sort && sort !== "followers_desc"));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Creator marketplace</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Discover creators</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Find Ethiopian TikTok talent by name, handle, or niche. Open a profile to review their work and send a structured collaboration request.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65">{filtered.length} of {creators.length} creators</p>
          {hasActiveFilters && <Link href="/client/dashboard/creators" className="de-chip">Reset filters</Link>}
        </div>
      </div>

      <form method="GET" className="grid gap-3 rounded-2xl border border-white/10 bg-[#141416] p-4 lg:grid-cols-[minmax(0,1.25fr)_190px_150px_150px_170px_auto]">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-white/60">Search</span>
          <input name="q" defaultValue={q ?? ""} placeholder="Name, @handle, or keyword" className="de-field" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-white/60">Niche</span>
          <select name="niche" defaultValue={niche ?? ""} className="de-field de-select">
            <option value="">All niches</option>
            {niches.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-white/60">Min followers</span>
          <input name="minFollowers" type="number" min="0" defaultValue={minFollowers ?? ""} placeholder="5,000" className="de-field" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-white/60">Max followers</span>
          <input name="maxFollowers" type="number" min="0" defaultValue={maxFollowers ?? ""} placeholder="100,000" className="de-field" />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-white/60">Sort</span>
          <select name="sort" defaultValue={activeSort} className="de-field de-select">
            <option value="followers_desc">Highest followers</option>
            <option value="followers_asc">Lowest followers</option>
            <option value="name">Name A-Z</option>
          </select>
        </label>
        <div className="flex flex-col justify-end gap-2">
          <label className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/65">
            <input name="hasRate" value="1" defaultChecked={shouldRequireRate} type="checkbox" className="h-4 w-4 accent-black" />
            Has rate
          </label>
          <button type="submit" className="de-btn de-btn-primary">Find</button>
        </div>
      </form>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <li className="col-span-full rounded-2xl border border-dashed border-white/15 bg-[#141416] px-5 py-10 text-center">
            <p className="font-bold text-white">No creators match those filters</p>
            <p className="mt-1 text-sm text-white/55">Try lowering the follower range, clearing the rate filter, or using a broader keyword.</p>
            <Link href="/client/dashboard/creators" className="de-btn de-btn-secondary mt-4">
              Clear all filters
            </Link>
          </li>
        ) : filtered.map((creator) => {
          const avatar = creator.avatarUrl ?? creator.user.tiktokAvatarUrl ?? creator.user.googleAvatarUrl ?? "/next.svg";
          return (
            <li key={creator.id} className="group rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:border-white/20">
              <div className="flex gap-3">
                <img src={avatar} alt={`${creator.name} profile`} className="h-16 w-16 rounded-2xl border border-white/10 object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-white">{creator.name}</p>
                  <p className="mt-0.5 truncate text-sm text-white/65">{creator.tiktokHandle}</p>
                  <p className="mt-2 text-xs font-semibold text-[#25F4EE]">{creator.niche} · {creator.followers.toLocaleString()} followers</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/70">{creator.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">{creator.followers.toLocaleString()} followers</span>
                {creator.priceRange ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">Rate: <span className="text-white/85">{creator.priceRange}</span></span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/45">Rate not listed</span>
                )}
              </div>
              <Link href={`/${creator.username}`} className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-zinc-950 transition group-hover:bg-[#25F4EE]">
                View profile and request a deal
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
