import Link from "next/link";
import { redirect } from "next/navigation";
import { CampaignPostForm } from "@/components/forms/campaign-post-form";
import { SidebarIcon, StatTile } from "@/components/dashboard/dashboard-ui";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionUser } from "@/lib/session";

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; section?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = (resolvedSearchParams.q ?? "").trim().toLowerCase();
  const activeSection = resolvedSearchParams.section ?? "hub";
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
  const profileCompletionChecks = [
    Boolean(profile.companyName?.trim()),
    Boolean(profile.contactName?.trim()),
    Boolean(profile.industry?.trim()),
    Boolean(profile.description?.trim()),
    Boolean(profile.avatarUrl?.trim()),
  ];
  const profileStrength = Math.round((profileCompletionChecks.filter(Boolean).length / profileCompletionChecks.length) * 100);
  const liveCampaigns = profile.campaigns.length;
  const activeDeals = 0;
  const creatorApplications = 0;

  const filteredCampaigns = profile.campaigns.filter((campaign) => {
    if (!searchQuery) return true;
    const text = `${campaign.title} ${campaign.description} ${campaign.niche} ${campaign.budget}`.toLowerCase();
    return text.includes(searchQuery);
  });

  function initialsFor(name: string) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }

  const sidebarItems = [
    { id: "hub", label: "My hub", icon: "grid", badge: null as number | null },
    { id: "profile", label: "Brand profile", icon: "user", badge: null },
    { id: "post-campaign", label: "Post campaign", icon: "plus", badge: null },
    { id: "campaigns", label: "My campaigns", icon: "megaphone", badge: liveCampaigns || null },
    { id: "creators", label: "Creators", icon: "users", badge: null },
    { id: "messages", label: "Messages", icon: "chat", badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0a0b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-0 text-xl font-black tracking-tight">
            <span className="text-white">dealer</span>
            <span className="text-[#FE2C55]">Eth</span>
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
              href="?section=creators#creators"
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                activeSection === "creators"
                  ? "border-white/25 bg-white/[0.06] text-white"
                  : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              Creators
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form method="GET" className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={resolvedSearchParams.q ?? ""}
                  placeholder="Search your campaigns"
                  className="w-56 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 pl-9 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/30"
                />
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden="true">
                  <path fill="currentColor" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm10.7 16.3-3.8-3.8a8 8 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4Z" />
                </svg>
              </div>
            </form>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
              </svg>
            </button>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5"
                aria-label="Account"
              >
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="invisible absolute right-0 top-11 z-40 w-44 rounded-xl border border-white/10 bg-[#121214] p-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <Link href="/client/profile" className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                  Edit brand profile
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
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Brand</p>
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
            <li className="px-3 pb-1 pt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">Workspace</li>
            <li>
              <Link href="/client/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.04] hover:text-white">
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
            <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#FE2C55] to-[#25F4EE]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FE2C55]">Brand hub</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
              Post campaigns so TikTok creators can discover your brief. Manage deals and creator outreach in one workspace.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FE2C55]/30 to-[#25F4EE]/30 text-sm font-black">
                {initialsFor(profile.companyName) || "BR"}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-white">{profile.companyName}</p>
                <p className="text-sm text-white/60">
                  {profile.industry} · {profile.contactName}
                </p>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
                <a
                  href="#post-campaign"
                  className="inline-flex rounded-full bg-gradient-to-r from-[#FE2C55] via-[#ff5f8a] to-[#25F4EE] px-4 py-2 text-xs font-bold text-white"
                >
                  Post new campaign
                </a>
                <Link
                  href="/client/profile"
                  className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Edit profile
                </Link>
              </div>
            </div>
            {profile.website && (
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-[#25F4EE] underline underline-offset-4"
              >
                Visit website
              </a>
            )}
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Profile strength" value={`${profileStrength}%`} />
            <StatTile label="Live campaigns" value={String(liveCampaigns)} tone={liveCampaigns > 0 ? "accent" : "default"} />
            <StatTile label="Applications" value={String(creatorApplications)} />
            <StatTile label="Active deals" value={String(activeDeals)} />
          </section>

          <section
            id="post-campaign"
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Post a campaign</p>
            <h2 className="mt-1 text-lg font-black text-white">Reach creators in your niche</h2>
            <p className="mt-1 text-sm text-white/65">
              Share goal, budget, deliverables, and timeline. Matching creators will see your brief on their dashboard.
            </p>
            <div className="mt-5">
              <CampaignPostForm dark />
            </div>
          </section>

          <section
            id="campaigns"
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Your live campaigns</p>
              <span className="text-xs font-semibold text-white/60">{filteredCampaigns.length} total</span>
            </div>
            <ul className="divide-y divide-white/5">
              {filteredCampaigns.length === 0 ? (
                <li className="px-5 py-6 text-sm text-white/60">
                  No campaigns yet. Post your first brief above to start receiving creator interest.
                </li>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <li key={campaign.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{campaign.title}</p>
                        <p className="mt-0.5 text-xs text-white/60">
                          Budget: {campaign.budget} · {campaign.niche}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full border border-[#25F4EE]/40 bg-[#25F4EE]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#25F4EE]">
                        Live
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/75">{campaign.description}</p>
                    {campaign.deadline && <p className="mt-2 text-xs text-white/50">Deadline: {campaign.deadline}</p>}
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#141416] to-[#0f0f11] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-6">
            <h3 className="max-w-xl text-lg font-black leading-snug text-white">
              Clear briefs and realistic budgets help you attract the right TikTok creators faster.
            </h3>
            <p className="mt-2 text-sm text-white/65">
              Profile strength {profileStrength}% — {liveCampaigns} campaign{liveCampaigns === 1 ? "" : "s"} live on DealerEth.
            </p>
            <div className="mt-4">
              <Link
                href="/client/profile"
                className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Improve brand profile
              </Link>
            </div>
          </section>

          <section
            id="creators"
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Creator applications</p>
            <p className="mt-2 text-sm text-white/65">
              When creators apply to your campaigns, they will show up here. You can review portfolios, chat, and move deals to contract.
            </p>
            <p className="mt-4 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
              No applications yet — publish a campaign to start receiving interest.
            </p>
          </section>

          <section id="messages" className="rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Messages</p>
            <p className="mt-2 text-sm text-white/65">
              Keep campaign conversations on DealerEth instead of scattered DMs. Threads with creators will appear here.
            </p>
          </section>

          <section id="profile" className="rounded-2xl border border-white/10 bg-[#141416] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Brand profile</p>
            <p className="mt-2 text-sm text-white/75">{profile.description}</p>
            <Link href="/client/profile" className="mt-4 inline-flex text-sm font-semibold text-[#25F4EE] underline underline-offset-4">
              Edit brand profile
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
