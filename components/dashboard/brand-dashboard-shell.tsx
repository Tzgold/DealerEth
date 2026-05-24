"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SidebarIcon } from "@/components/dashboard/dashboard-ui";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: number | null;
  match?: (path: string) => boolean;
};

export function BrandDashboardShell({
  children,
  avatar,
  liveCampaigns,
  applicationCount,
  searchDefault = "",
}: {
  children: ReactNode;
  avatar: string;
  liveCampaigns: number;
  applicationCount: number;
  searchDefault?: string;
}) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/client/dashboard", label: "My hub", icon: "grid", match: (p) => p === "/client/dashboard" },
    { href: "/client/profile", label: "Brand profile", icon: "user", match: (p) => p === "/client/profile" },
    { href: "/client/dashboard/post", label: "Post campaign", icon: "plus", match: (p) => p === "/client/dashboard/post" },
    {
      href: "/client/dashboard/campaigns",
      label: "My campaigns",
      icon: "megaphone",
      badge: liveCampaigns || null,
      match: (p) => p === "/client/dashboard/campaigns",
    },
    { href: "/client/dashboard/creators", label: "Creators", icon: "users", match: (p) => p.startsWith("/client/dashboard/creators") },
    {
      href: "/client/dashboard/messages",
      label: "Messages",
      icon: "chat",
      badge: applicationCount || null,
      match: (p) => p.startsWith("/client/dashboard/messages"),
    },
  ];

  const topTabs = [
    { href: "/client/dashboard", label: "Your hub", match: (p: string) => p === "/client/dashboard" },
    { href: "/client/dashboard/campaigns", label: "Campaigns", match: (p: string) => p.startsWith("/client/dashboard/campaigns") || p === "/client/dashboard/post" },
    { href: "/client/dashboard/creators", label: "Creators", match: (p: string) => p.startsWith("/client/dashboard/creators") },
  ];

  function isActive(item: NavItem) {
    return item.match ? item.match(pathname) : pathname === item.href;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0a0b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-0 text-xl font-black tracking-tight">
            <span className="text-white">dealer</span>
            <span className="text-[#FE2C55]">Eth</span>
          </Link>
          <nav className="ml-8 hidden items-center gap-2 md:flex">
            {topTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  tab.match(pathname)
                    ? "border-white/25 bg-white/[0.06] text-white"
                    : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <form action="/client/dashboard/campaigns" method="GET" className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchDefault}
                  placeholder="Search your campaigns"
                  className="w-56 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 pl-9 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
                />
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden="true">
                  <path fill="currentColor" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm10.7 16.3-3.8-3.8a8 8 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4Z" />
                </svg>
              </div>
            </form>
            <Link
              href="/client/dashboard/messages"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
              </svg>
              {applicationCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FE2C55] ring-2 ring-[#0a0a0b]" />}
            </Link>
            <div className="group relative">
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5" aria-label="Account">
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="invisible absolute right-0 top-11 z-40 w-44 rounded-xl border border-white/10 bg-[#121214] p-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <Link href="/client/profile" className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                  Edit brand profile
                </Link>
                <Link href="/logout" className="block rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-white/5">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden md:block">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Brand</p>
          <ul className="mt-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active ? "bg-white/[0.08] text-white" : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <SidebarIcon name={item.icon} className={active ? "text-white" : "text-white/60 group-hover:text-white"} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#FE2C55] px-1.5 text-[11px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
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
        <main className="space-y-5">{children}</main>
      </div>
    </div>
  );
}
