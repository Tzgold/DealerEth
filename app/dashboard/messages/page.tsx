import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-ui";
import { NotificationSeenMarker } from "@/components/dashboard/notification-seen-marker";
import { StatusPill } from "@/components/dashboard/status-pill";
import { requireCreatorProfile } from "@/lib/dashboard-context";

export default async function CreatorMessagesPage() {
  const { profile } = await requireCreatorProfile();
  const threadsNeedingReply = profile.applications.filter((application) => application.messages[0]?.senderRole === "CLIENT").length;
  const seenItems = profile.applications
    .filter((application) => application.messages[0]?.senderRole === "CLIENT")
    .map((application) => ({ key: `application:${application.id}`, time: application.messages[0].createdAt.toISOString() }));

  return (
    <>
      <NotificationSeenMarker items={seenItems} />
      <div>
        <h1 className="text-2xl font-black text-white">Messages</h1>
        <p className="mt-1 text-sm text-white/65">
          Campaign threads with brands after you apply. {threadsNeedingReply > 0 ? `${threadsNeedingReply} ${threadsNeedingReply === 1 ? "thread needs" : "threads need"} your reply.` : "You are caught up."}
        </p>
      </div>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#141416]">
        {profile.applications.length === 0 ? (
          <li className="p-4">
            <DashboardEmptyState
              title="No conversations yet"
              description="Apply to a campaign first. Once a brand responds, your conversation stays connected to that application."
              href="/dashboard/campaigns"
              action="Browse campaigns"
            />
          </li>
        ) : (
          profile.applications.map((application) => {
            const latestMessage = application.messages[0];
            const needsReply = latestMessage?.senderRole === "CLIENT";

            return (
              <li key={application.id}>
                <Link href={`/dashboard/messages/${application.id}`} className={`block px-5 py-4 transition ${needsReply ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">Campaign conversation</p>
                      <p className="mt-0.5 text-xs text-white/45">Brand team: {application.campaign.client.companyName}</p>
                    </div>
                    {needsReply ? (
                      <span className="rounded-full border border-white/30 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-950">Needs reply</span>
                    ) : (
                      <StatusPill status={application.status} />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/60">Campaign application</p>
                  {latestMessage ? (
                    <p className="mt-2 line-clamp-1 text-sm text-white/70">
                      <span className="text-white/40">{latestMessage.senderRole === "CREATOR" ? "You: " : "Brand: "}</span>
                      {latestMessage.text}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-white/45">No brand reply yet. Your application is ready to be reviewed.</p>
                  )}
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}
