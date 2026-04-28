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
      user: {
        select: {
          googleAvatarUrl: true,
        },
      },
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
  const avatar = profile.avatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(254,44,85,0.16),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(37,244,238,0.14),transparent_35%),#f8fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <img src={avatar} alt={`${profile.companyName} avatar`} className="mb-3 h-14 w-14 rounded-full border border-zinc-200 object-cover bg-white" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Brand Workspace</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900">{profile.companyName}</h1>
              <p className="mt-2 text-sm text-zinc-600">
                {profile.industry} - {profile.contactName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/client/profile"
                className="rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] px-4 py-2 text-sm font-semibold text-white"
              >
                Edit Brand Profile
              </a>
              <form action={logout}>
                <Button variant="secondary" type="submit" className="rounded-full">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr,1.8fr]">
          <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-5">
            <h2 className="text-lg font-black text-zinc-900">Quick stats</h2>
            <p className="mt-1 text-sm text-zinc-600">Monitor activity and keep campaigns active.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                <p className="text-xs text-zinc-500">Campaigns</p>
                <p className="text-xl font-bold text-zinc-900">{profile.campaigns.length}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                <p className="text-xs text-zinc-500">Industry</p>
                <p className="font-semibold text-zinc-900">{profile.industry}</p>
              </div>
            </div>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-zinc-800 underline">
                Visit website
              </a>
            )}
          </Card>

          <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-5">
            <h2 className="text-lg font-black text-zinc-900">Post a campaign</h2>
            <p className="mb-4 text-sm text-zinc-600">Share your goal, budget, niche, and deliverables to attract the right creators.</p>
            <CampaignPostForm />
          </Card>
        </div>

        <Card className="rounded-[24px] border-zinc-200 bg-white/90 p-5">
          <h2 className="text-lg font-black text-zinc-900">Your campaign posts</h2>
          <div className="mt-4 space-y-3">
            {profile.campaigns.length === 0 ? (
              <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-600">No campaigns posted yet. Create your first campaign above.</p>
            ) : (
              profile.campaigns.map((campaign) => (
                <article key={campaign.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-zinc-900">{campaign.title}</h3>
                    <p className="text-xs font-semibold text-zinc-600">{campaign.budget}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{campaign.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700">Niche: {campaign.niche}</span>
                    {campaign.deadline && <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700">Deadline: {campaign.deadline}</span>}
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
