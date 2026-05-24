import Link from "next/link";
import { StatTile } from "@/components/dashboard/dashboard-ui";
import { clientProfileStrength, initialsFor, requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandHubPage() {
  const { profile } = await requireClientProfile();
  const profileStrength = clientProfileStrength(profile);
  const liveCampaigns = profile.campaigns.length;
  const applications = profile.campaigns.flatMap((c) => c.applications);
  const activeDeals = applications.filter((a) => a.status === "ACTIVE").length;
  const pendingApplications = applications.filter((a) => a.status === "APPLIED").length;

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6">
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FE2C55] to-[#25F4EE]" aria-hidden="true" />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Brand hub</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
          Post campaigns so TikTok creators can discover your brief. Manage deals and creator outreach in one workspace.
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
            <Link href="/client/dashboard/post" className="inline-flex rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] px-4 py-2 text-xs font-bold text-white">
              Post new campaign
            </Link>
            <Link href="/client/profile" className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">
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

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Recent campaigns</p>
          <Link href="/client/dashboard/campaigns" className="text-xs font-semibold text-white/70 hover:text-white">
            See all
          </Link>
        </div>
        <ul className="divide-y divide-white/5">
          {profile.campaigns.length === 0 ? (
            <li className="px-5 py-6 text-sm text-white/60">No campaigns yet.</li>
          ) : (
            profile.campaigns.slice(0, 4).map((campaign) => (
              <li key={campaign.id} className="px-5 py-4">
                <p className="text-sm font-bold text-white">{campaign.title}</p>
                <p className="mt-1 text-xs text-white/60">
                  {campaign.budget} · {campaign.niche} · {campaign.applications.length} application(s)
                </p>
                <Link href="/client/dashboard/campaigns" className="mt-2 inline-block text-xs font-semibold text-[#25F4EE] underline">
                  Manage
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141416] to-[#0f0f11] p-5 sm:p-6">
        <h3 className="max-w-xl text-lg font-black text-white">Clear briefs and realistic budgets attract the right creators.</h3>
        <p className="mt-2 text-sm text-white/65">Profile strength {profileStrength}% — {liveCampaigns} live campaign{liveCampaigns === 1 ? "" : "s"}.</p>
        <Link href="/client/profile" className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
          Improve brand profile
        </Link>
      </section>
    </>
  );
}
