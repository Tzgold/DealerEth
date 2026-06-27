"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SeenNotificationItem } from "@/lib/notification-seen";

export function NotificationSeenMarker({ items }: { items: SeenNotificationItem[] }) {
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) return;
    const signature = JSON.stringify(items);
    if (sessionStorage.getItem("dealereth_seen_signature") === signature) return;
    sessionStorage.setItem("dealereth_seen_signature", signature);

    void fetch("/api/notifications/seen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).then((response) => {
      if (response.ok) router.refresh();
    });
  }, [items, router]);

  return null;
}
