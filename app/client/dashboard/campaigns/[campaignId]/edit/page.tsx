import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignPostForm } from "@/components/forms/campaign-post-form";
import { requireClientProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function EditCampaignPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const { profile } = await requireClientProfile();

  const campaign = await prisma.campaignPost.findFirst({
    where: { id: campaignId, clientId: profile.id },
  });

  if (!campaign) notFound();

  return (
    <>
      <Link href="/client/dashboard/campaigns" className="text-sm font-semibold text-white/60 hover:text-white">
        ← Back to campaigns
      </Link>

      <div className="mt-4">
        <p className="de-eyebrow">Edit campaign</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">Update your creator brief</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
          Keep the brief accurate as budget, deliverables, timing, or campaign direction changes.
        </p>
      </div>

      <section className="de-card max-w-3xl p-5 sm:p-7">
        <CampaignPostForm
          dark
          mode="edit"
          campaignId={campaign.id}
          initialValues={{
            title: campaign.title,
            description: campaign.description,
            budget: campaign.budget,
            niche: campaign.niche,
            deliverables: campaign.deliverables,
            deadline: campaign.deadline,
          }}
        />
      </section>
    </>
  );
}
