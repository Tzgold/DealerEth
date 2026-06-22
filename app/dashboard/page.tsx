import Link from "next/link";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { StatTile } from "@/components/dashboard/dashboard-ui";
import { creatorProfileStrength, getPublicProfileUrls, initialsFor, requireCreatorProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function CreatorHubPage() {
  const { profile } = await requireCreatorProfile();
  const urls = await getPublicProfileUrls(profile.username);
  const profileStrength = creatorProfileStrength(profile);
  const nicheKeyword = profile.niche.toLowerCase();

  const marketCampaigns = await prisma.campaignPost.findMany({
    where: { status: "LIVE" },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { client: { select: { companyName: true } } },
  });

  const applicationByCampaign = new Map(profile.applications.map((a) => [a.campaignId, a]));
  const matchedCampaigns = marketCampaigns.filter((c) => c.niche.toLowerCase().includes(nicheKeyword));
  const activeDeals = profile.applications.filter((a) => a.status === "ACTIVE").length;
  const newOffers = profile.dealRequests.filter((request) => request.status === "NEW").length;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6">
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#25F4EE] to-[#FE2C55]" aria-hidden="true" />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#25F4EE]">Creator hub</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
          Your public page is where brands send deal requests. Share this link in your TikTok bio.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-white/85">{urls.display}</span>
          <CopyLinkButton value={urls.full} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Profile strength" value={`${profileStrength}%`} />
        <StatTile label="New offers" value={String(newOffers)} tone={newOffers > 0 ? "accent" : "default"} />
        <StatTile label="Active deals" value={String(activeDeals)} />
        <StatTile label="Campaigns match" value={String(matchedCampaigns.length)} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Campaigns that match your niche</p>
          <Link href="/dashboard/campaigns" className="text-xs font-semibold text-white/70 hover:text-white">
            See all
          </Link>
        </div>
        <ul className="divide-y divide-white/5">
          {matchedCampaigns.length === 0 ? (
            <li className="px-5 py-6 text-sm text-white/60">No matching campaigns yet.</li>
          ) : (
            matchedCampaigns.slice(0, 5).map((campaign) => {
              const applied = applicationByCampaign.has(campaign.id);
              return (
                <li key={campaign.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25F4EE]/30 to-[#FE2C55]/30 text-xs font-black">
                      {initialsFor(campaign.client.companyName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {campaign.client.companyName} — {campaign.title}
                      </p>
                      <p className="mt-0.5 text-xs text-white/60">
                        Budget: {campaign.budget} · {campaign.niche}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/campaigns/${campaign.id}`}
                          className="de-btn de-btn-primary min-h-8 px-3 py-1.5 text-xs"
                        >
                          {applied ? "View application" : "Apply"}
                        </Link>
                        <Link
                          href={`/dashboard/campaigns/${campaign.id}`}
                          className="de-btn de-btn-secondary min-h-8 px-3 py-1.5 text-xs"
                        >
                          View brief
                        </Link>
                      </div>
                    </div>
                  </div>
                  {campaign.niche.toLowerCase() === nicheKeyword && (
                    <span className="inline-flex w-fit rounded-full border border-[#25F4EE]/40 bg-[#25F4EE]/15 px-3 py-1 text-[11px] font-bold uppercase text-[#25F4EE]">
                      Matches you
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141416] to-[#0f0f11] p-5 sm:p-6">
        <h3 className="max-w-xl text-lg font-black text-white">Strong portfolio links and a clear niche help you get picked.</h3>
        <p className="mt-2 text-sm text-white/65">
          Profile strength {profileStrength}% — {matchedCampaigns.length} campaigns match your niche.
        </p>
        <Link href="/profile/setup" className="de-btn de-btn-secondary mt-4">
          Improve profile
        </Link>
      </section>
    </>
  );
}
