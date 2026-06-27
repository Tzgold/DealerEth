import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-ui";
import { NotificationSeenMarker } from "@/components/dashboard/notification-seen-marker";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ApplicationChatBox } from "@/components/forms/application-chat-box";
import { ApplicationStatusForm } from "@/components/forms/application-status-form";
import { requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string; application?: string }>;
}) {
  const { campaign: campaignFilter, application: applicationFocus } = await searchParams;
  const { profile } = await requireClientProfile();

  const allApplications = profile.campaigns.flatMap((campaign) =>
    campaign.applications.map((application) => ({
      ...application,
      campaignTitle: campaign.title,
      campaignId: campaign.id,
    })),
  );

  const filtered = campaignFilter
    ? allApplications.filter((a) => a.campaignId === campaignFilter)
    : allApplications;

  const focused = applicationFocus ? filtered.find((a) => a.id === applicationFocus) : filtered[0];
  const threadsNeedingReply = filtered.filter((application) => {
    const latestMessage = application.messages[application.messages.length - 1];
    return application.status === "APPLIED" || (application.status === "IN_CHAT" && latestMessage?.senderRole === "CREATOR");
  }).length;
  const seenItems = filtered
    .filter((application) => {
      const latestMessage = application.messages[application.messages.length - 1];
      return application.status === "APPLIED" || (application.status === "IN_CHAT" && latestMessage?.senderRole === "CREATOR");
    })
    .map((application) => {
      const latestMessage = application.messages[application.messages.length - 1];
      return {
        key: `application:${application.id}`,
        time: latestMessage?.senderRole === "CREATOR" ? latestMessage.createdAt.toISOString() : application.updatedAt.toISOString(),
      };
    });

  return (
    <>
      <NotificationSeenMarker items={seenItems} />
      <div>
        <h1 className="text-2xl font-black text-white">Creator applications & messages</h1>
        <p className="mt-1 text-sm text-white/65">
          Review applications, update status, and chat with creators. {threadsNeedingReply > 0 ? `${threadsNeedingReply} ${threadsNeedingReply === 1 ? "thread needs" : "threads need"} your attention.` : "No open replies right now."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:h-[calc(100vh-170px)]">
        <ul className="max-h-[70vh] divide-y divide-white/5 overflow-y-auto rounded-2xl border border-white/10 bg-[#141416]">
          {filtered.length === 0 ? (
            <li className="p-4">
              <DashboardEmptyState
                title="No applications yet"
                description={campaignFilter ? "This campaign has not received applications yet. You can keep sharing the brief or discover creators directly." : "Post a campaign brief so creators can apply, or discover creators and request a collaboration directly."}
                href={campaignFilter ? "/client/dashboard/creators" : "/client/dashboard/post"}
                action={campaignFilter ? "Discover creators" : "Post a campaign"}
              />
            </li>
          ) : (
            filtered.map((application) => {
              const latestMessage = application.messages[application.messages.length - 1];
              const needsReply = application.status === "APPLIED" || (application.status === "IN_CHAT" && latestMessage?.senderRole === "CREATOR");

              return (
                <li key={application.id}>
                  <Link
                    href={`/client/dashboard/messages?application=${application.id}`}
                    className={`block px-4 py-3 transition ${focused?.id === application.id ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">{application.creator.name}</p>
                        <p className="truncate text-xs text-white/55">{application.campaignTitle}</p>
                      </div>
                      {needsReply && <span className="de-notification-dot mt-0.5 h-2 w-2 shrink-0 rounded-full" aria-label="Needs reply" />}
                    </div>
                  <div className="mt-2">
                    {needsReply ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Needs reply</span>
                    ) : (
                      <StatusPill status={application.status} />
                    )}
                  </div>
                    {latestMessage && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/60">
                        <span className="text-white/35">{latestMessage.senderRole === "CLIENT" ? "You: " : "Creator: "}</span>
                        {latestMessage.text}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })
          )}
        </ul>

        {focused ? (
          <section className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">{focused.creator.name}</h2>
                <p className="text-sm text-white/60">
                  @{focused.creator.username} · {focused.campaignTitle}
                </p>
              </div>
              <ApplicationStatusForm applicationId={focused.id} currentStatus={focused.status} />
            </div>
            <div className="grid gap-3 border-b border-white/10 py-4 text-sm text-white/70 md:grid-cols-[minmax(0,1fr)_auto]">
              <p className="line-clamp-2 leading-6">{focused.coverLetter}</p>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {focused.proposedBudget && <span className="de-chip">Budget: {focused.proposedBudget}</span>}
                <Link href={`/${focused.creator.username}`} className="de-chip">
                  View profile
                </Link>
              </div>
            </div>
            <div className="min-h-0 flex-1 pt-4">
              <ApplicationChatBox
                key={focused.id}
                applicationId={focused.id}
                initialMessages={focused.messages.map((m) => ({
                  id: m.id,
                  senderRole: m.senderRole,
                  text: m.text,
                  createdAt: m.createdAt.toISOString(),
                }))}
                viewerRole="CLIENT"
              />
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-white/15 bg-[#141416] p-8 text-center text-sm text-white/50">
            Select an application to open the thread.
          </section>
        )}
      </div>
    </>
  );
}
