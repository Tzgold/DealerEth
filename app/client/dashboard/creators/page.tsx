import Link from "next/link";
import { requireClientProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function BrandCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; niche?: string; minFollowers?: string; maxFollowers?: string; hasRate?: string; hasPortfolio?: string; sort?: string }>;
}) {
  const { q, niche, minFollowers, maxFollowers, hasRate, hasPortfolio, sort } = await searchParams;
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
  const shouldRequirePortfolio = hasPortfolio === "1";
  const activeSort = sort === "name" || sort === "followers_asc" || sort === "profile_score" ? sort : "followers_desc";

  function portfolioCount(sampleVideos: unknown) {
    return Array.isArray(sampleVideos) ? sampleVideos.length : 0;
  }

  function profileScore(creator: (typeof creators)[number]) {
    const checks = [
      Boolean(creator.avatarUrl ?? creator.user.tiktokAvatarUrl ?? creator.user.googleAvatarUrl),
      Boolean(creator.name.trim()),
      Boolean(creator.tiktokHandle.trim()),
      Boolean(creator.bio.trim()),
      Boolean(creator.niche.trim()),
      creator.followers > 0,
      Boolean(creator.priceRange?.trim()),
      portfolioCount(creator.sampleVideos) > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  const filtered = creators.filter((creator) => {
    const text = `${creator.name} ${creator.username} ${creator.tiktokHandle} ${creator.niche} ${creator.bio}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery);
    const matchesNiche = !nicheFilter || creator.niche.toLowerCase() === nicheFilter;
    const matchesMinFollowers = Number.isNaN(minimumFollowers) || creator.followers >= minimumFollowers;
    const matchesMaxFollowers = Number.isNaN(maximumFollowers) || creator.followers <= maximumFollowers;
    const matchesRate = !shouldRequireRate || Boolean(creator.priceRange?.trim());
    const matchesPortfolio = !shouldRequirePortfolio || portfolioCount(creator.sampleVideos) > 0;
    return matchesSearch && matchesNiche && matchesMinFollowers && matchesMaxFollowers && matchesRate && matchesPortfolio;
  }).sort((a, b) => {
    if (activeSort === "name") return a.name.localeCompare(b.name);
    if (activeSort === "followers_asc") return a.followers - b.followers;
    if (activeSort === "profile_score") return profileScore(b) - profileScore(a);
    return b.followers - a.followers;
  });

  const niches = Array.from(new Set(creators.map((creator) => creator.niche.trim()).filter(Boolean))).sort();
  const creatorsWithPortfolio = creators.filter((creator) => portfolioCount(creator.sampleVideos) > 0).length;
  const creatorsWithRate = creators.filter((creator) => Boolean(creator.priceRange?.trim())).length;
  const hasActiveFilters = Boolean(q || niche || minFollowers || maxFollowers || hasRate || hasPortfolio || (sort && sort !== "followers_desc"));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Creator marketplace</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Discover creators</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Find Ethiopian TikTok talent by name, handle, niche, portfolio readiness, and rate availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65">{filtered.length} of {creators.length} creators</p>
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65">{creatorsWithPortfolio} with portfolio</p>
          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65">{creatorsWithRate} with rate</p>
          {hasActiveFilters && <Link href="/client/dashboard/creators" className="de-chip">Reset filters</Link>}
        </div>
      </div>

      <form method="GET" className="grid gap-3 rounded-2xl border border-white/10 bg-[#141416] p-4 lg:grid-cols-[minmax(0,1.25fr)_170px_135px_135px_170px_auto]">
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
            <option value="profile_score">Best profiles</option>
            <option value="name">Name A-Z</option>
          </select>
        </label>
        <div className="flex flex-col justify-end gap-2">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <label className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/65">
              <input name="hasRate" value="1" defaultChecked={shouldRequireRate} type="checkbox" className="h-4 w-4 accent-black" />
              Has rate
            </label>
            <label className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/65">
              <input name="hasPortfolio" value="1" defaultChecked={shouldRequirePortfolio} type="checkbox" className="h-4 w-4 accent-black" />
              Has portfolio
            </label>
          </div>
          <button type="submit" className="de-btn de-btn-primary">Find</button>
        </div>
      </form>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <li className="col-span-full rounded-2xl border border-dashed border-white/15 bg-[#141416] px-5 py-10 text-center">
            <p className="font-bold text-white">No creators match those filters</p>
            <p className="mt-1 text-sm text-white/55">Try lowering the follower range, clearing the portfolio/rate filters, or using a broader keyword.</p>
            <Link href="/client/dashboard/creators" className="de-btn de-btn-secondary mt-4">
              Clear all filters
            </Link>
          </li>
        ) : filtered.map((creator) => {
          const avatar = creator.avatarUrl ?? creator.user.tiktokAvatarUrl ?? creator.user.googleAvatarUrl ?? "/next.svg";
          const score = profileScore(creator);
          const videos = portfolioCount(creator.sampleVideos);

          return (
            <li key={creator.id} className="group rounded-2xl border border-white/10 bg-[#141416] p-5 transition hover:border-white/20">
              <div className="flex gap-3">
                <img src={avatar} alt={`${creator.name} profile`} className="h-16 w-16 rounded-2xl border border-white/10 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-extrabold text-white">{creator.name}</p>
                  <p className="mt-0.5 truncate text-sm text-white/65">{creator.tiktokHandle}</p>
                  <p className="mt-2 text-xs font-semibold text-white/55">{creator.niche} · {creator.followers.toLocaleString()} followers</p>
                </div>
                <span className="h-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">
                  {score}% ready
                </span>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/70">{creator.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">{creator.followers.toLocaleString()} followers</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">{videos} portfolio link{videos === 1 ? "" : "s"}</span>
                {creator.priceRange ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">Rate: <span className="text-white/85">{creator.priceRange}</span></span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/45">Rate not listed</span>
                )}
              </div>
              <Link href={`/${creator.username}`} className="de-btn de-btn-primary mt-4 w-full">
                View profile and request a deal
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
