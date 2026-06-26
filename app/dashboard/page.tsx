import Link from "next/link";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { DashboardActionCard, ProgressBar, StatTile } from "@/components/dashboard/dashboard-ui";
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
  const activeDirectRequests = profile.dealRequests.filter((request) => request.status === "ACCEPTED" || request.status === "IN_DISCUSSION" || request.status === "ACTIVE").length;
  const activeDeals = profile.applications.filter((a) => a.status === "ACTIVE").length + activeDirectRequests;
  const newOffers = profile.dealRequests.filter((request) => request.status === "NEW").length;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6">
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#25F4EE] to-[#FE2C55]" aria-hidden="true" />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#25F4EE]">Creator hub</p>
        <h1 className="mt-2 text-3xl font-black text-white">Your creator workspace</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
          Your public page is where brands understand your audience, review your work, and send collaboration requests.
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

      <section className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="de-eyebrow">Profile readiness</p>
              <h2 className="mt-2 text-xl font-black text-white">Your creator page is {profileStrength}% complete</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                A complete profile helps brands understand your audience, content style, and collaboration fit faster.
              </p>
            </div>
            <Link href="/profile/setup" className="de-btn de-btn-secondary">
              Improve profile
            </Link>
          </div>
          <div className="mt-5">
            <ProgressBar value={profileStrength} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
          <p className="de-eyebrow">Next best move</p>
          <h2 className="mt-2 text-xl font-black text-white">{newOffers > 0 ? "Review new brand requests" : matchedCampaigns.length > 0 ? "Apply to a matching campaign" : "Share your public page"}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            {newOffers > 0 ? "A brand already reached out from your public profile. Check the details while the lead is warm." : matchedCampaigns.length > 0 ? "There are live briefs close to your niche. Send a focused pitch while the campaign is active." : "Put your DealerEth link in your TikTok bio or send it when brands ask for your media kit."}
          </p>
        </div>
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
            <li className="px-5 py-8 text-sm text-white/60">
              No matching campaigns yet.{" "}
              <Link href="/dashboard/campaigns" className="font-semibold text-white underline underline-offset-2">
                Browse all live campaigns
              </Link>
            </li>
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
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="de-btn de-btn-primary min-h-8 px-3 py-1.5 text-xs">
                          {applied ? "View application" : "Apply"}
                        </Link>
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="de-btn de-btn-secondary min-h-8 px-3 py-1.5 text-xs">
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

      <section className="grid gap-3 md:grid-cols-3">
        <DashboardActionCard eyebrow="Find work" title="Browse campaign briefs" description="See active opportunities and apply with a clear pitch." href="/dashboard/campaigns" action="Explore campaigns" />
        <DashboardActionCard eyebrow="Inbound" title="Manage brand requests" description="Review direct collaboration requests from your public page." href="/dashboard/requests" action="Open requests" />
        <DashboardActionCard eyebrow="Conversations" title="Continue messages" description="Keep campaign discussions connected to each application." href="/dashboard/messages" action="View messages" />
      </section>
    </>
  );
}
