import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionUser } from "@/lib/session";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { SidebarIcon, StatTile } from "@/components/dashboard/dashboard-ui";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string; section?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.q ?? "").trim().toLowerCase();
  const activeSection = resolvedSearchParams.section ?? "hub";
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
    take: 20,
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
  const avatar = profile.avatarUrl ?? profile.user.tiktokAvatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const nicheKeyword = profile.niche.toLowerCase();
  const filteredCampaigns = marketCampaigns.filter((campaign) => {
    if (!searchQuery) return true;
    const text = `${campaign.title} ${campaign.description} ${campaign.niche} ${campaign.client.companyName} ${campaign.client.industry}`.toLowerCase();
    return text.includes(searchQuery);
  });
  const matchedCampaigns = filteredCampaigns.filter((campaign) => campaign.niche.toLowerCase().includes(nicheKeyword));
  const newOffers = profile.dealRequests.length;
  const activeDeals = 0;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "dealereth.com";
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const publicProfilePath = `/@${profile.username}`;
  const displayBioLink = `${host.replace(/^www\./, "")}${publicProfilePath}`;
  const publicProfileUrl = `${proto}://${host}${publicProfilePath}`;

  const sampleVideos = Array.isArray(profile.sampleVideos) ? (profile.sampleVideos as string[]) : [];

  function initialsFor(name: string) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }

  const sidebarItems = [
    { id: "hub", label: "My hub", icon: "grid", badge: null as number | null },
    { id: "profile", label: "My profile", icon: "user", badge: null },
    { id: "campaigns", label: "Campaigns", icon: "megaphone", badge: null },
    { id: "brand-requests", label: "Brand requests", icon: "inbox", badge: newOffers || null },
    { id: "messages", label: "Messages", icon: "chat", badge: newOffers > 0 ? 1 : null },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0a0b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-0 text-xl font-black tracking-tight">
            <span className="text-white">dealer</span>
            <span className="text-[#25F4EE]">Eth</span>
          </Link>

          <nav className="ml-8 hidden items-center gap-2 md:flex">
            <a
              href="?section=hub#hub"
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeSection === "hub"
                  ? "border-white/25 bg-white/[0.06] text-white"
                  : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              Your hub
            </a>
            <a
              href="?section=campaigns#campaigns"
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeSection === "campaigns"
                  ? "border-white/25 bg-white/[0.06] text-white"
                  : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              Campaigns
            </a>
            <a
              href="?section=brand-requests#brand-requests"
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeSection === "brand-requests"
                  ? "border-white/25 bg-white/[0.06] text-white"
                  : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              Brand requests
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form method="GET" className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={resolvedSearchParams.q ?? ""}
                  placeholder="Search campaigns"
                  className="w-56 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 pl-9 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/30"
                />
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm10.7 16.3-3.8-3.8a8 8 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4Z"
                  />
                </svg>
              </div>
            </form>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 md:hidden"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm10.7 16.3-3.8-3.8a8 8 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4Z" />
              </svg>
            </button>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
              </svg>
              {newOffers > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FE2C55] ring-2 ring-[#0a0a0b]" />}
            </button>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
                aria-label="Account"
              >
                {avatar ? (
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z" />
                  </svg>
                )}
              </button>
              <div className="invisible absolute right-0 top-11 z-40 w-44 rounded-xl border border-white/10 bg-[#121214] p-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <Link href={publicProfilePath} className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                  View public page
                </Link>
                <Link href="/profile/setup" className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                  Edit profile
                </Link>
                <form action={logout} className="border-t border-white/5">
                  <button type="submit" className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 hover:bg-white/5">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden md:block">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Creator</p>
          <ul className="mt-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`?section=${item.id}#${item.id}`}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive ? "bg-white/[0.08] text-white" : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <SidebarIcon name={item.icon} className={isActive ? "text-white" : "text-white/60 group-hover:text-white"} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#FE2C55] px-1.5 text-[11px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                </li>
              );
            })}
            <li className="px-3 pb-1 pt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">My deals</li>
            <li>
              <Link href={publicProfilePath} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.04] hover:text-white">
                <SidebarIcon name="eye" className="text-white/60" />
                Public page
              </Link>
            </li>
            <li>
              <Link href="/profile/setup" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.04] hover:text-white">
                <SidebarIcon name="settings" className="text-white/60" />
                Settings
              </Link>
            </li>
          </ul>
        </aside>

        <main className="space-y-5">
          <section
            id="hub"
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#25F4EE] to-[#FE2C55]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#25F4EE]">Creator hub</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
              Your public page is where brands send deal requests. Share this link in your TikTok bio.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/60" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10.6 13.4a1 1 0 0 0 1.4 0l4-4a3 3 0 1 0-4.2-4.2L11 6a1 1 0 0 0 1.4 1.4l.8-.8a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 0 0 1.4Zm2.8-2.8a1 1 0 0 0-1.4 0l-4 4a3 3 0 1 0 4.2 4.2L13 18a1 1 0 0 0-1.4-1.4l-.8.8a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 0 0-1.4Z"
                />
              </svg>
              <span className="min-w-0 flex-1 truncate font-mono text-sm text-white/85">{displayBioLink}</span>
              <CopyLinkButton value={publicProfileUrl} />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Profile strength" value={`${profileStrength}%`} tone="default" />
            <StatTile label="New offers" value={String(newOffers)} tone={newOffers > 0 ? "accent" : "default"} />
            <StatTile label="Active deals" value={String(activeDeals)} tone="default" />
            <StatTile label="Campaigns match" value={String(matchedCampaigns.length)} tone="default" />
          </section>

          <section
            id="campaigns"
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Campaigns that match your niche</p>
              <a href="?section=campaigns#campaigns" className="text-xs font-semibold text-white/70 hover:text-white">
                See all
              </a>
            </div>
            <ul className="divide-y divide-white/5">
              {matchedCampaigns.length === 0 ? (
                <li className="px-5 py-6 text-sm text-white/60">
                  No live campaigns matching <span className="font-semibold text-white">{profile.niche}</span> yet. New posts will appear here.
                </li>
              ) : (
                matchedCampaigns.slice(0, 5).map((campaign) => {
                  const isStrongMatch = campaign.niche.toLowerCase() === nicheKeyword;
                  return (
                    <li key={campaign.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25F4EE]/30 to-[#FE2C55]/30 text-xs font-black text-white">
                          {initialsFor(campaign.client.companyName) || "CC"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">
                            {campaign.client.companyName} — {campaign.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-white/60">
                            Budget: {campaign.budget} · {campaign.niche}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Link
                              href={`#campaign-${campaign.id}`}
                              className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-900 transition hover:bg-white/90"
                            >
                              Apply
                            </Link>
                            <Link
                              href={`#campaign-${campaign.id}`}
                              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
                            >
                              View brief
                            </Link>
                          </div>
                        </div>
                      </div>
                      {isStrongMatch && (
                        <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full border border-[#25F4EE]/40 bg-[#25F4EE]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#25F4EE]">
                          Matches you
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141416] to-[#0f0f11] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6">
            <h3 className="max-w-xl text-lg font-black leading-snug text-white">
              Strong portfolio links and a clear niche help you get picked for paid TikTok collaborations.
            </h3>
            <p className="mt-2 text-sm text-white/65">
              Profile strength {profileStrength}% — {matchedCampaigns.length} live campaigns match your niche.
              {sampleVideos.length > 0 && <> {sampleVideos.length} portfolio links on file.</>}
            </p>
            <div className="mt-4">
              <Link
                href="/profile/setup"
                className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Improve profile
              </Link>
            </div>
          </section>

          <section
            id="brand-requests"
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Brand deal requests</p>
              <span className="text-xs font-semibold text-white/60">{profile.dealRequests.length} total</span>
            </div>
            <ul className="divide-y divide-white/5">
              {profile.dealRequests.length === 0 ? (
                <li className="px-5 py-6 text-sm text-white/60">
                  No requests yet. Add your DealerEth link to your TikTok bio so brands can reach you here with budget and brief.
                </li>
              ) : (
                profile.dealRequests.map((request) => (
                  <li key={request.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-white">{request.name}</p>
                      <p className="text-sm font-semibold text-white/80">{request.budget}</p>
                    </div>
                    <p className="mt-1 text-xs text-white/55">{request.email}</p>
                    <p className="mt-2 text-sm leading-6 text-white/75">{request.description}</p>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section id="messages" className="rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Messages</p>
            <p className="mt-2 text-sm text-white/65">
              Brand conversations will appear here. Reply quickly to keep deals moving on DealerEth instead of DMs.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
