import Link from "next/link";
import { requireCreatorProfile, initialsFor } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function CreatorCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const { q, filter } = await searchParams;
  const searchQuery = (q ?? "").trim().toLowerCase();
  const { profile } = await requireCreatorProfile();
  const nicheKeyword = profile.niche.toLowerCase();

  const campaigns = await prisma.campaignPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: { select: { companyName: true, industry: true } } },
  });

  const applicationByCampaign = new Map(profile.applications.map((a) => [a.campaignId, a]));

  let filtered = campaigns.filter((campaign) => {
    const text = `${campaign.title} ${campaign.description} ${campaign.niche} ${campaign.client.companyName}`.toLowerCase();
    return !searchQuery || text.includes(searchQuery);
  });

  if (filter === "match") {
    filtered = filtered.filter((c) => c.niche.toLowerCase().includes(nicheKeyword));
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Campaigns</h1>
          <p className="mt-1 text-sm text-white/65">Browse brand briefs and apply with your pitch.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/campaigns"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!filter ? "border-white/25 bg-white/10 text-white" : "border-white/10 text-white/60"}`}
          >
            All
          </Link>
          <Link
            href="/dashboard/campaigns?filter=match"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === "match" ? "border-white/25 bg-white/10 text-white" : "border-white/10 text-white/60"}`}
          >
            Best for my niche
          </Link>
        </div>
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-white/10 bg-[#141416] px-5 py-8 text-sm text-white/60">No campaigns found.</li>
        ) : (
          filtered.map((campaign) => {
            const application = applicationByCampaign.get(campaign.id);
            const isMatch = campaign.niche.toLowerCase().includes(nicheKeyword);
            return (
              <li key={campaign.id} className="rounded-2xl border border-white/10 bg-[#141416] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#25F4EE]/30 to-[#FE2C55]/30 text-xs font-black">
                      {initialsFor(campaign.client.companyName)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">
                        {campaign.client.companyName} — {campaign.title}
                      </h2>
                      <p className="mt-1 text-xs text-white/60">
                        {campaign.client.industry} · Budget: {campaign.budget} · {campaign.niche}
                      </p>
                    </div>
                  </div>
                  {isMatch && (
                    <span className="rounded-full border border-[#25F4EE]/40 bg-[#25F4EE]/15 px-3 py-1 text-[11px] font-bold uppercase text-[#25F4EE]">
                      Matches you
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-white/75">{campaign.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/dashboard/campaigns/${campaign.id}`} className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-zinc-900">
                    {application ? "View application" : "Apply"}
                  </Link>
                  <Link
                    href={`/dashboard/campaigns/${campaign.id}`}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    View brief
                  </Link>
                  {application && (
                    <Link href={`/dashboard/messages/${application.id}`} className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-[#25F4EE]">
                      Message brand
                    </Link>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}
