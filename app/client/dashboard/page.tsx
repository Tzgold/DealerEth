import { redirect } from "next/navigation";
import { CampaignPostForm } from "@/components/forms/campaign-post-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionUser } from "@/lib/session";

export default async function ClientDashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/client/login");
  }

  if (session.role !== "CLIENT") {
    redirect("/dashboard");
  }

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.userId },
    include: {
      campaigns: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) {
    redirect("/client/profile");
  }

  async function logout() {
    "use server";
    await clearSessionCookie();
    redirect("/client/login");
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{profile.companyName}</h1>
          <p className="text-sm text-zinc-600">{profile.industry} - {profile.contactName}</p>
        </div>
        <form action={logout}>
          <Button variant="secondary" type="submit">
            Logout
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Post a campaign for creators</h2>
        <p className="mb-3 text-sm text-zinc-600">Publish what you need and your ideal creator niche.</p>
        <CampaignPostForm />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Your campaign posts</h2>
        <div className="mt-3 space-y-3">
          {profile.campaigns.length === 0 ? (
            <p className="text-sm text-zinc-600">No campaigns posted yet.</p>
          ) : (
            profile.campaigns.map((campaign) => (
              <article key={campaign.id} className="rounded-2xl border border-black/10 bg-zinc-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{campaign.title}</h3>
                  <p className="text-xs text-zinc-600">{campaign.budget}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-700">{campaign.description}</p>
                <p className="mt-2 text-xs text-zinc-600">Niche: {campaign.niche}</p>
              </article>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
