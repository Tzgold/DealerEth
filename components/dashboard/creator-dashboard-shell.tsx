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

  const hasRequestNotifications = newOffers > 0 && !pathname.startsWith("/dashboard/requests");
  const hasMessageNotifications = messageCount > 0 && !pathname.startsWith("/dashboard/messages");
  const hasNotifications = hasRequestNotifications || hasMessageNotifications;
  const notificationHref = hasRequestNotifications ? "/dashboard/requests" : "/dashboard/messages";

  return (
    <div className="dashboard-surface product-editorial creator-shell min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f6f2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="font-serif text-lg tracking-[0.14em] text-black">
            <span>DEALERETH</span>
          </Link>
          <nav className="ml-8 hidden items-center gap-2 md:flex">
            {topTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`de-chip text-sm ${tab.match(pathname) ? "de-chip-active" : ""}`}
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
                  className="de-field w-56 py-2 pl-9 text-sm"
                />
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden="true">
                  <path fill="currentColor" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm10.7 16.3-3.8-3.8a8 8 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4Z" />
                </svg>
              </div>
            </form>
            <div className="group relative">
              <Link
                href={notificationHref}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
                aria-label="Notifications"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" />
                </svg>
                {hasNotifications && <span className="de-notification-dot absolute right-2 top-2 h-2 w-2 rounded-full ring-2 ring-white" />}
              </Link>
              <div className="de-menu invisible absolute right-0 top-11 z-40 w-60 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-black/45">Notifications</p>
                {hasRequestNotifications && <Link href="/dashboard/requests" className="de-menu-item">New brand requests ({newOffers})</Link>}
                {hasMessageNotifications && <Link href="/dashboard/messages" className="de-menu-item">Messages need reply ({messageCount})</Link>}
                {!hasNotifications && <p className="px-3 py-2 text-sm text-black/50">You are caught up.</p>}
              </div>
            </div>
            <div className="group relative">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5"
                aria-label="Account"
              >
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="de-menu invisible absolute right-0 top-11 z-40 w-48 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <Link href={publicProfilePath} className="de-menu-item">
                  View public page
                </Link>
                <Link href="/profile/setup" className="de-menu-item">
                  Edit profile
                </Link>
                <Link href="/logout" className="de-menu-item text-rose-300">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-7 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden md:block">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Creator</p>
          <ul className="mt-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`de-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active ? "de-nav-item-active" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <SidebarIcon name={item.icon} className={active ? "text-white" : "text-white/60 group-hover:text-white"} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && !active ? (
                      <span className="de-notification-badge inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white">
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
        <main className="space-y-5 pb-20 md:pb-0">{children}</main>
      </div>
      <nav className="editorial-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden" aria-label="Creator dashboard">
        <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link href={item.href} className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${active ? "de-mobile-active" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
                  <SidebarIcon name={item.icon} className="h-4 w-4" />
                  <span className="max-w-full truncate">{item.label.replace("Brand ", "")}</span>
                  {item.badge && !active ? <span className="de-notification-badge absolute right-2 top-1 h-4 min-w-4 rounded-full px-1 text-center text-[9px] leading-4 text-white">{item.badge}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
