import Link from "next/link";
import { CampaignManageActions } from "@/components/dashboard/campaign-manage-actions";
import { requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = (q ?? "").trim().toLowerCase();
  const { profile } = await requireClientProfile();

  const filtered = profile.campaigns.filter((campaign) => {
    const text = `${campaign.title} ${campaign.description} ${campaign.niche} ${campaign.budget}`.toLowerCase();
    return !searchQuery || text.includes(searchQuery);
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">My campaigns</h1>
          <p className="mt-1 text-sm text-white/65">Live briefs creators can discover and apply to.</p>
        </div>
        <Link href="/client/dashboard/post" className="de-btn de-btn-primary">
          Post new campaign
        </Link>
      </div>

      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-white/10 bg-[#141416] px-5 py-8 text-sm text-white/60">
            No campaigns yet.{" "}
            <Link href="/client/dashboard/post" className="font-semibold text-[#FE2C55] underline">
              Post your first campaign
            </Link>
          </li>
        ) : (
          filtered.map((campaign) => (
            <li key={campaign.id} className="rounded-2xl border border-white/10 bg-[#141416] p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-white">{campaign.title}</h2>
                  <p className="mt-1 text-xs text-white/60">
                    Budget: {campaign.budget} · {campaign.niche}
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase ${campaign.status === "LIVE" ? "border-[#25F4EE]/40 bg-[#25F4EE]/15 text-[#25F4EE]" : campaign.status === "PAUSED" ? "border-amber-300/30 bg-amber-300/10 text-amber-200" : "border-white/15 bg-white/5 text-white/50"}`}>
                  {campaign.status} · {campaign.applications.length} applications
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/75">{campaign.description}</p>
              {campaign.deadline && <p className="mt-2 text-xs text-white/50">Deadline: {campaign.deadline}</p>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                <div className="flex flex-wrap gap-3">
                  <Link href={`/client/dashboard/messages?campaign=${campaign.id}`} className="text-xs font-semibold text-[#25F4EE] underline">
                    Review applications
                  </Link>
                  <Link href={`/client/dashboard/campaigns/${campaign.id}/edit`} className="text-xs font-semibold text-white/65 underline underline-offset-2 hover:text-white">
                    Edit brief
                  </Link>
                </div>
                <CampaignManageActions campaignId={campaign.id} currentStatus={campaign.status} applicationCount={campaign.applications.length} />
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
