import { NextResponse } from "next/server";
import { markNotificationsSeen, type SeenNotificationItem } from "@/lib/notification-seen";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = (await request.json()) as { items?: SeenNotificationItem[] };
  const items = Array.isArray(payload.items)
    ? payload.items.filter((item) => typeof item?.key === "string" && item.key.length > 0 && Boolean(item.time))
    : [];

  if (items.length > 0) {
    await markNotificationsSeen(items);
  }

  return NextResponse.json({ ok: true });
}
