import { cookies } from "next/headers";

const COOKIE_NAME = "dealereth_seen_notifications";
const MAX_ITEMS = 80;

export type SeenNotificationItem = {
  key: string;
  time: string | Date;
};

export type SeenNotificationMap = Record<string, string>;

function normalizeTime(time: string | Date) {
  return new Date(time).toISOString();
}

export async function getSeenNotifications() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as SeenNotificationMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function isNotificationSeen(seen: SeenNotificationMap, key: string, time: string | Date) {
  const seenAt = seen[key];
  if (!seenAt) return false;
  return new Date(seenAt).getTime() >= new Date(time).getTime();
}

export async function markNotificationsSeen(items: SeenNotificationItem[]) {
  const cookieStore = await cookies();
  const current = await getSeenNotifications();
  const next: SeenNotificationMap = { ...current };

  for (const item of items) {
    next[item.key] = normalizeTime(item.time);
  }

  const trimmed = Object.fromEntries(
    Object.entries(next)
      .sort(([, a], [, b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, MAX_ITEMS),
  );

  cookieStore.set(COOKIE_NAME, JSON.stringify(trimmed), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
