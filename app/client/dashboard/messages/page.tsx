import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-ui";
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

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Creator applications & messages</h1>
        <p className="mt-1 text-sm text-white/65">
          Review applications, update status, and chat with creators. {threadsNeedingReply > 0 ? `${threadsNeedingReply} ${threadsNeedingReply === 1 ? "thread needs" : "threads need"} your attention.` : "No open replies right now."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
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
          <section className="rounded-2xl border border-white/10 bg-[#141416] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-white">{focused.creator.name}</h2>
                <p className="text-sm text-white/60">
                  @{focused.creator.username} · {focused.campaignTitle}
                </p>
              </div>
              <ApplicationStatusForm applicationId={focused.id} currentStatus={focused.status} />
            </div>
            {(focused.status === "APPLIED" || (focused.status === "IN_CHAT" && focused.messages[focused.messages.length - 1]?.senderRole === "CREATOR")) && (
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${focused.status === "APPLIED" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-100" : "border-white/10 bg-white/[0.04] text-white/75"}`}>
                {focused.status === "APPLIED" ? "New application received. Approve it, reject it, or send a message before deciding." : "This thread is waiting on you. Review the application, update its status, or send a reply to keep the campaign moving."}
              </div>
            )}
            <p className="mt-4 text-sm leading-6 text-white/75">{focused.coverLetter}</p>
            {focused.proposedBudget && (
              <p className="mt-2 text-sm text-white/60">Proposed budget: {focused.proposedBudget}</p>
            )}
            <Link href={`/${focused.creator.username}`} className="mt-3 inline-block text-xs font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white">
              View creator profile
            </Link>
            <div className="mt-5 border-t border-white/10 pt-5">
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
