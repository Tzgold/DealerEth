import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionUser } from "@/lib/session";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string; scope?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.q ?? "").trim().toLowerCase();
  const activeView = resolvedSearchParams.view === "recent" ? "recent" : resolvedSearchParams.view === "saved" ? "saved" : "best";
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CREATOR") {
    redirect("/client/dashboard");
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.userId },
    include: {
      user: {
        select: {
          tiktokAvatarUrl: true,
          googleAvatarUrl: true,
        },
      },
      dealRequests: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) {
    redirect("/profile/setup");
  }

  const marketCampaigns = await prisma.campaignPost.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    include: {
      client: {
        select: {
          companyName: true,
          industry: true,
        },
      },
    },
  });

  async function logout() {
    "use server";

    await clearSessionCookie();
    redirect("/login");
  }

  const profileCompletionChecks = [
    Boolean(profile.bio?.trim()),
    Boolean(profile.niche?.trim()),
    Boolean(profile.priceRange?.trim()),
    Array.isArray(profile.sampleVideos) && (profile.sampleVideos as unknown[]).length > 0,
    profile.followers > 0,
  ];
  const profileStrength = Math.round((profileCompletionChecks.filter(Boolean).length / profileCompletionChecks.length) * 100);
  const sampleVideos = Array.isArray(profile.sampleVideos) ? (profile.sampleVideos as string[]) : [];
  const avatar = profile.avatarUrl ?? profile.user.tiktokAvatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const nicheKeyword = profile.niche.toLowerCase();
  const suggestedCampaigns = marketCampaigns.filter((campaign) => campaign.niche.toLowerCase().includes(nicheKeyword)).slice(0, 6);
  const filteredCampaigns = marketCampaigns.filter((campaign) => {
    if (!searchQuery) return true;
    const text = `${campaign.title} ${campaign.description} ${campaign.niche} ${campaign.client.companyName} ${campaign.client.industry}`.toLowerCase();
    return text.includes(searchQuery);
  });
  const activeContacts = new Set(profile.dealRequests.map((request) => request.email.toLowerCase())).size;
  const openPromotions = marketCampaigns.length;
  const bestMatches = filteredCampaigns
    .filter((campaign) => campaign.niche.toLowerCase().includes(nicheKeyword))
    .slice(0, 8);
  const mostRecent = filteredCampaigns.slice(0, 8);
  const savedJobsMock = filteredCampaigns.filter((campaign) => campaign.budget.toLowerCase().includes("etb")).slice(0, 8);
  const jobsToShow = activeView === "recent" ? mostRecent : activeView === "saved" ? savedJobsMock : bestMatches;

  return (
    <div className="min-h-screen bg-[#f5f5f6] px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-4 rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="text-xl font-bold text-zinc-900">
              DealerEth
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-zinc-700 md:flex">
              <a href="#discover">Find work</a>
              <a href="#requests">Messages</a>
              <a href="#opened">Activity</a>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <form method="GET" className="hidden items-center gap-2 sm:flex">
                <input
                  type="text"
                  name="q"
                  defaultValue={resolvedSearchParams.q ?? ""}
                  placeholder="Search"
                  className="w-64 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-500"
                />
                <button type="submit" className="rounded-full border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800">
                  Jobs
                </button>
              </form>
              <a href="#requests" className="rounded-full border border-zinc-300 p-2 text-zinc-700" aria-label="Notifications">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
                </svg>
              </a>
              <img src={avatar} alt={`${profile.name} avatar`} className="h-8 w-8 rounded-full border border-zinc-200 object-cover" />
              <form action={logout}>
                <Button variant="secondary" type="submit" className="rounded-full px-3 py-1.5 text-xs">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="order-1 space-y-4">
            <Card className="rounded-xl border-zinc-200 bg-[#1f5f58] p-5 text-white">
              <p className="text-sm font-medium text-white/80">Get discovered faster</p>
              <h2 className="mt-2 max-w-xl text-3xl font-bold leading-tight">
                Optimize your proposal quality and profile to increase your chances of landing campaigns.
              </h2>
              <p className="mt-3 text-sm text-white/80">Profile strength: {profileStrength}% | Niche matches: {suggestedCampaigns.length}</p>
              <Link href="/profile/setup" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900">
                Improve profile
              </Link>
            </Card>

            <Card className="rounded-xl border border-[#cdeebe] bg-[#e9f8df] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-800">Stay active: new campaign posts are matched to your profile niche in real time.</p>
                <a href={searchQuery ? `/dashboard?view=best&q=${encodeURIComponent(searchQuery)}#discover` : "/dashboard?view=best#discover"} className="text-sm font-semibold text-[#108a00] underline underline-offset-4">
                  View matches
                </a>
              </div>
            </Card>

            <Card id="discover" className="rounded-xl border-zinc-200 bg-white p-4">
              <h2 className="text-2xl font-semibold text-zinc-900">Jobs you might like</h2>
              <div className="mt-3 flex flex-wrap gap-4 border-b border-zinc-200 pb-2 text-sm">
                <Link
                  href={searchQuery ? `/dashboard?view=best&q=${encodeURIComponent(searchQuery)}#discover` : "/dashboard?view=best#discover"}
                  className={activeView === "best" ? "border-b-2 border-zinc-900 pb-1 font-semibold text-zinc-900" : "text-zinc-500"}
                >
                  Best matches
                </Link>
                <Link
                  href={searchQuery ? `/dashboard?view=recent&q=${encodeURIComponent(searchQuery)}#discover` : "/dashboard?view=recent#discover"}
                  className={activeView === "recent" ? "border-b-2 border-zinc-900 pb-1 font-semibold text-zinc-900" : "text-zinc-500"}
                >
                  Most recent
                </Link>
                <Link
                  href={searchQuery ? `/dashboard?view=saved&q=${encodeURIComponent(searchQuery)}#discover` : "/dashboard?view=saved#discover"}
                  className={activeView === "saved" ? "border-b-2 border-zinc-900 pb-1 font-semibold text-zinc-900" : "text-zinc-500"}
                >
                  Saved jobs
                </Link>
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                Browse campaigns aligned with your niche. Results: {jobsToShow.length} / {filteredCampaigns.length}
              </p>

              <div className="mt-3 space-y-3">
                {jobsToShow.length === 0 ? (
                  <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-600">No campaigns matched your search.</p>
                ) : (
                  jobsToShow.map((campaign) => (
                    <article key={campaign.id} className="rounded-lg border border-zinc-200 bg-white px-4 py-4">
                      <p className="text-xs text-zinc-500">Posted recently</p>
                      <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-2xl font-semibold text-zinc-900">{campaign.title}</h3>
                          <p className="text-sm text-zinc-600">
                            {campaign.client.companyName} - {campaign.client.industry}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-zinc-800">{campaign.budget}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{campaign.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">{campaign.niche}</span>
                        {campaign.deadline && <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">Deadline: {campaign.deadline}</span>}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </Card>

            <Card id="requests" className="rounded-xl border-zinc-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-zinc-900">Incoming proposals</h2>
                <span className="text-sm text-zinc-500">{profile.dealRequests.length}</span>
              </div>
              <div className="space-y-3">
                {profile.dealRequests.length === 0 ? (
                  <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-600">No requests yet. Share your public profile with brands.</p>
                ) : (
                  profile.dealRequests.map((request) => (
                    <article key={request.id} className="rounded-lg border border-zinc-200 bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-zinc-900">{request.name}</p>
                        <p className="text-sm font-semibold text-zinc-800">{request.budget}</p>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{request.email}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{request.description}</p>
                    </article>
                  ))
                )}
              </div>
            </Card>
          </div>

          <aside className="order-2 space-y-4 md:sticky md:top-4 md:self-start">
            <Card className="rounded-xl border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <img src={avatar} alt={`${profile.name} avatar`} className="h-12 w-12 rounded-full border border-zinc-200 object-cover bg-white" />
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold text-zinc-900">{profile.name}</h2>
                  <p className="truncate text-sm text-zinc-600">{profile.tiktokHandle}</p>
                </div>
              </div>
              <Link href="/profile/setup" className="mt-3 block text-sm font-semibold text-[#108a00] underline underline-offset-4">
                Complete your profile
              </Link>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-zinc-900" style={{ width: `${profileStrength}%` }} />
                </div>
                <span className="text-xs font-semibold text-zinc-700">{profileStrength}%</span>
              </div>
              <p className="mt-3 text-xs text-zinc-600">
                Profile URL:{" "}
                <Link href={`/@${profile.username}`} className="font-semibold text-zinc-900 underline underline-offset-4">
                  /@{profile.username}
                </Link>
              </p>
              <div className="mt-3 space-y-2">
                <Link href={`/@${profile.username}`} className="block rounded-full border border-zinc-300 px-3 py-1.5 text-center text-sm font-medium text-zinc-800">
                  View profile
                </Link>
                <Link href="/profile/setup" className="block rounded-full bg-zinc-900 px-3 py-1.5 text-center text-sm font-medium text-white">
                  Edit profile
                </Link>
              </div>
            </Card>

            <Card className="rounded-xl border-zinc-200 bg-white p-4">
              <h3 className="flex items-center gap-2 text-2xl font-semibold text-zinc-900">
                <span className="text-base">🪪</span>
                Identity verification
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-600">Increase your profile visibility in search and improve trust with brands through identity verification.</p>
              <Link href="/profile/setup" className="mt-2 inline-block text-sm font-semibold text-[#108a00] underline underline-offset-4">
                Add verification details
              </Link>
            </Card>

            <Card id="opened" className="rounded-xl border-zinc-200 bg-white p-4">
              <h3 className="text-3xl font-semibold text-zinc-900">Promote with ads</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Availability badge</p>
                    <p className="text-sm text-zinc-500">Off</p>
                  </div>
                  <Link href="/profile/setup" className="text-zinc-500 hover:text-zinc-700" aria-label="Edit availability badge settings">
                    ✎
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Boost your profile</p>
                    <p className="text-sm text-zinc-500">Off</p>
                  </div>
                  <Link href="/profile/setup" className="text-zinc-500 hover:text-zinc-700" aria-label="Edit profile boost settings">
                    ✎
                  </Link>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">Open promotions: {openPromotions}</div>
                <div id="contacts" className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                  Active contacts: {activeContacts}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
