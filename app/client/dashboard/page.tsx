import Link from "next/link";
import { DashboardActionCard, ProgressBar, StatTile } from "@/components/dashboard/dashboard-ui";
import { clientProfileStrength, initialsFor, requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandHubPage() {
  const { profile } = await requireClientProfile();
  const profileStrength = clientProfileStrength(profile);
  const liveCampaigns = profile.campaigns.filter((campaign) => campaign.status === "LIVE").length;
  const applications = profile.campaigns.flatMap((c) => c.applications);
  const activeDeals = applications.filter((a) => a.status === "ACTIVE").length;
  const pendingApplications = applications.filter((a) => a.status === "APPLIED").length;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6">
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FE2C55] to-[#25F4EE]" aria-hidden="true" />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Brand hub</p>
        <h1 className="mt-2 text-3xl font-black text-white">Your client workspace</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
          Post clear creator briefs, review applications, and keep collaboration decisions in one workspace.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FE2C55]/30 to-[#25F4EE]/30 text-sm font-black">
            {initialsFor(profile.companyName)}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-white">{profile.companyName}</p>
            <p className="text-sm text-white/60">
              {profile.industry} · {profile.contactName}
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
            <Link href="/client/dashboard/post" className="de-btn de-btn-primary">
              Post new campaign
            </Link>
            <Link href="/client/profile" className="de-btn de-btn-secondary">
              Edit profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Profile strength" value={`${profileStrength}%`} />
        <StatTile label="Live campaigns" value={String(liveCampaigns)} tone={liveCampaigns > 0 ? "accent" : "default"} />
        <StatTile label="Applications" value={String(applications.length)} tone={pendingApplications > 0 ? "accent" : "default"} />
        <StatTile label="Active deals" value={String(activeDeals)} />
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="de-eyebrow">Brand readiness</p>
              <h2 className="mt-2 text-xl font-black text-white">Your brand profile is {profileStrength}% complete</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                A complete brand profile helps creators trust your brief and decide whether the campaign fits their audience.
              </p>
            </div>
            <Link href="/client/profile" className="de-btn de-btn-secondary">
              Improve profile
            </Link>
          </div>
          <div className="mt-5">
            <ProgressBar value={profileStrength} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
          <p className="de-eyebrow">Next best move</p>
          <h2 className="mt-2 text-xl font-black text-white">{pendingApplications > 0 ? "Review pending applications" : liveCampaigns > 0 ? "Find creators for your campaign" : "Post your first campaign"}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            {pendingApplications > 0 ? "Creators are waiting for a decision. Shortlist, message, or move the right ones forward." : liveCampaigns > 0 ? "Your brief is live. Discover creators who match the niche and send a direct request." : "Start with a clear budget, deliverables, niche, and timeline so creators can judge the fit quickly."}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Recent campaigns</p>
          <Link href="/client/dashboard/campaigns" className="text-xs font-semibold text-white/70 hover:text-white">
            See all
          </Link>
        </div>
        <ul className="divide-y divide-white/5">
          {profile.campaigns.length === 0 ? (
            <li className="px-5 py-8 text-sm text-white/60">
              No campaigns yet.{" "}
              <Link href="/client/dashboard/post" className="font-semibold text-white underline underline-offset-2">
                Post your first campaign
              </Link>
            </li>
          ) : (
            profile.campaigns.slice(0, 4).map((campaign) => (
              <li key={campaign.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{campaign.title}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {campaign.budget} · {campaign.niche} · {campaign.applications.length} application(s)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/client/dashboard/messages?campaign=${campaign.id}`} className="de-btn de-btn-secondary min-h-8 px-3 py-1.5 text-xs">
                    Review applications
                  </Link>
                  <Link href={`/client/dashboard/campaigns/${campaign.id}/edit`} className="de-btn de-btn-primary min-h-8 px-3 py-1.5 text-xs">
                    Edit brief
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <DashboardActionCard eyebrow="Campaigns" title="Post or manage briefs" description="Keep budgets, deliverables, status, and campaign details clear." href="/client/dashboard/campaigns" action="Manage campaigns" />
        <DashboardActionCard eyebrow="Discovery" title="Find aligned creators" description="Search by niche, followers, rate availability, and creator profile details." href="/client/dashboard/creators" action="Discover creators" />
        <DashboardActionCard eyebrow="Applications" title="Review creator responses" description="Shortlist, message, and move promising applications through the deal flow." href="/client/dashboard/messages" action="Open messages" />
      </section>
    </>
  );
}
