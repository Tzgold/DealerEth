import Link from "next/link";
import { requireClientProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function BrandCreatorsPage({ searchParams }: { searchParams: Promise<{ q?: string; niche?: string }> }) {
  const { q, niche } = await searchParams;
  await requireClientProfile();

  const creators = await prisma.creatorProfile.findMany({
    orderBy: { followers: "desc" },
    take: 100,
    include: { user: { select: { tiktokAvatarUrl: true, googleAvatarUrl: true } } },
  });

  const searchQuery = (q ?? "").trim().toLowerCase();
  const nicheFilter = (niche ?? "").trim().toLowerCase();
  const filtered = creators.filter((creator) => {
    const text = `${creator.name} ${creator.username} ${creator.tiktokHandle} ${creator.niche} ${creator.bio}`.toLowerCase();
    return (!searchQuery || text.includes(searchQuery)) && (!nicheFilter || creator.niche.toLowerCase() === nicheFilter);
  });
  const niches = Array.from(new Set(creators.map((creator) => creator.niche.trim()).filter(Boolean))).sort();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Creator marketplace</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Discover creators</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Find Ethiopian TikTok talent by name, handle, or niche. Open a profile to review their work and send a structured collaboration request.</p>
        </div>
        <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65">{filtered.length} of {creators.length} creators</p>
      </div>

      <form method="GET" className="grid gap-3 rounded-2xl border border-white/10 bg-[#141416] p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
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
        <button type="submit" className="de-btn de-btn-primary self-end">Find creators</button>
        {(q || niche) && <Link href="/client/dashboard/creators" className="de-btn de-btn-secondary self-end">Clear</Link>}
      </form>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <li className="col-span-full rounded-2xl border border-dashed border-white/15 bg-[#141416] px-5 py-10 text-center">
            <p className="font-bold text-white">No creators match those filters</p>
            <p className="mt-1 text-sm text-white/55">Try a broader search or clear the niche filter.</p>
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
              {creator.priceRange && <p className="mt-3 text-xs font-semibold text-white/55">Typical rate: <span className="text-white/85">{creator.priceRange}</span></p>}
              <Link href={`/@${creator.username}`} className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-zinc-950 transition group-hover:bg-[#25F4EE]">
                View profile and request a deal
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
