import Link from "next/link";
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

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Creator applications & messages</h1>
        <p className="mt-1 text-sm text-white/65">Review applications, update status, and chat with creators.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ul className="max-h-[70vh] divide-y divide-white/5 overflow-y-auto rounded-2xl border border-white/10 bg-[#141416]">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-sm text-white/60">No applications yet.</li>
          ) : (
            filtered.map((application) => (
              <li key={application.id}>
                <Link
                  href={`/client/dashboard/messages?application=${application.id}`}
                  className={`block px-4 py-3 transition hover:bg-white/[0.03] ${focused?.id === application.id ? "bg-white/[0.06]" : ""}`}
                >
                  <p className="text-sm font-bold text-white">{application.creator.name}</p>
                  <p className="text-xs text-white/55">{application.campaignTitle}</p>
                  <p className="mt-1 text-[11px] text-white/45">{application.status.replace("_", " ")}</p>
                </Link>
              </li>
            ))
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
            <p className="mt-4 text-sm leading-6 text-white/75">{focused.coverLetter}</p>
            {focused.proposedBudget && (
              <p className="mt-2 text-sm text-white/60">Proposed budget: {focused.proposedBudget}</p>
            )}
            <Link href={`/@${focused.creator.username}`} className="mt-3 inline-block text-xs font-semibold text-[#25F4EE] underline">
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
