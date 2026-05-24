import { CampaignPostForm } from "@/components/forms/campaign-post-form";
import { requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandPostCampaignPage() {
  await requireClientProfile();

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Post a campaign</h1>
        <p className="mt-1 text-sm text-white/65">Share goal, budget, deliverables, and timeline. Matching creators will see your brief.</p>
      </div>
      <section className="rounded-2xl border border-white/10 bg-[#141416] p-5 sm:p-6">
        <CampaignPostForm dark />
      </section>
    </>
  );
}
