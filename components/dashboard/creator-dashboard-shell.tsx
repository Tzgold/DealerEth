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

export function CreatorDashboardShell({
  children,
  avatar,
  publicProfilePath,
  newOffers,
  messageCount,
  searchDefault = "",
}: {
  children: ReactNode;
  avatar: string;
  publicProfilePath: string;
  newOffers: number;
  messageCount: number;
  searchDefault?: string;
}) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "My hub", icon: "grid", match: (p) => p === "/dashboard" },
    { href: "/profile/setup", label: "My profile", icon: "user", match: (p) => p.startsWith("/profile") },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: "megaphone", match: (p) => p.startsWith("/dashboard/campaigns") },
    {
      href: "/dashboard/requests",
      label: "Brand requests",
      icon: "inbox",
      badge: newOffers || null,
      match: (p) => p.startsWith("/dashboard/requests"),
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: "chat",
      badge: messageCount || null,
      match: (p) => p.startsWith("/dashboard/messages"),
    },
  ];

  const topTabs = [
    { href: "/dashboard", label: "Your hub", match: (p: string) => p === "/dashboard" },
    { href: "/dashboard/campaigns", label: "Campaigns", match: (p: string) => p.startsWith("/dashboard/campaigns") },
    { href: "/dashboard/requests", label: "Brand requests", match: (p: string) => p.startsWith("/dashboard/requests") },
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
            <span className="text-[#25F4EE]">Eth</span>
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
            <form action="/dashboard/campaigns" method="GET" className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchDefault}
                  placeholder="Search campaigns"
                  className="w-56 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 pl-9 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
                />
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden="true">
                  <path fill="currentColor" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm10.7 16.3-3.8-3.8a8 8 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4Z" />
                </svg>
              </div>
            </form>
            <Link
              href="/dashboard/requests"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
              </svg>
              {newOffers > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FE2C55] ring-2 ring-[#0a0a0b]" />}
            </Link>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5"
                aria-label="Account"
              >
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="invisible absolute right-0 top-11 z-40 w-44 rounded-xl border border-white/10 bg-[#121214] p-1 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <Link href={publicProfilePath} className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                  View public page
                </Link>
                <Link href="/profile/setup" className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                  Edit profile
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
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Creator</p>
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
        <main className="space-y-5">{children}</main>
      </div>
    </div>
  );
}
