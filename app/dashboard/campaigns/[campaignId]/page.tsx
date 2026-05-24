import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignApplyForm } from "@/components/forms/campaign-apply-form";
import { requireCreatorProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function CampaignBriefPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const { profile } = await requireCreatorProfile();

  const campaign = await prisma.campaignPost.findUnique({
    where: { id: campaignId },
    include: { client: { select: { companyName: true, industry: true, contactName: true, website: true } } },
  });

  if (!campaign) notFound();

  const existing = await prisma.campaignApplication.findUnique({
    where: { campaignId_creatorId: { campaignId, creatorId: profile.id } },
  });

  return (
    <>
      <Link href="/dashboard/campaigns" className="text-sm font-semibold text-white/60 hover:text-white">
        ← Back to campaigns
      </Link>

      <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#25F4EE]">Campaign brief</p>
        <h1 className="mt-2 text-2xl font-black text-white">{campaign.title}</h1>
        <p className="mt-1 text-sm text-white/60">
          {campaign.client.companyName} · {campaign.client.industry}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs text-white/50">Budget</p>
            <p className="mt-1 font-bold text-white">{campaign.budget}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs text-white/50">Niche</p>
            <p className="mt-1 font-bold text-white">{campaign.niche}</p>
          </div>
          {campaign.deadline && (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 sm:col-span-2">
              <p className="text-xs text-white/50">Deadline</p>
              <p className="mt-1 font-bold text-white">{campaign.deadline}</p>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">Description</p>
          <p className="mt-2 text-sm leading-7 text-white/80">{campaign.description}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">Deliverables</p>
          <p className="mt-2 text-sm leading-7 text-white/80">{campaign.deliverables}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6">
        <h2 className="text-lg font-black text-white">{existing ? "Your application" : "Apply to this campaign"}</h2>
        {existing ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-white/70">Status: <span className="font-bold text-white">{existing.status.replace("_", " ")}</span></p>
            <p className="text-sm leading-6 text-white/75">{existing.coverLetter}</p>
            <Link href={`/dashboard/messages/${existing.id}`} className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-zinc-900">
              Open messages
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <CampaignApplyForm campaignId={campaign.id} />
          </div>
        )}
      </section>
    </>
  );
}
