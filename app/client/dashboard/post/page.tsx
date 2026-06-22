import { CampaignPostForm } from "@/components/forms/campaign-post-form";
import { requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandPostCampaignPage() {
  await requireClientProfile();

  return (
    <>
      <div>
        <p className="de-eyebrow">New campaign</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">Create a clear creator brief</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Give creators enough context to judge the fit and send a thoughtful application. You can pause or close the campaign later.</p>
      </div>
      <section className="de-card max-w-3xl p-5 sm:p-7">
        <CampaignPostForm dark />
      </section>
    </>
  );
}
