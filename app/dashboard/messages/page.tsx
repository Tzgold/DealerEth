import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-ui";
import { requireCreatorProfile } from "@/lib/dashboard-context";

export default async function CreatorMessagesPage() {
  const { profile } = await requireCreatorProfile();

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Messages</h1>
        <p className="mt-1 text-sm text-white/65">Campaign threads with brands after you apply.</p>
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
          profile.applications.map((application) => (
            <li key={application.id}>
              <Link href={`/dashboard/messages/${application.id}`} className="block px-5 py-4 transition hover:bg-white/[0.03]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white">{application.campaign.client.companyName}</p>
                  <span className="text-xs font-semibold text-white/50">{application.status.replace("_", " ")}</span>
                </div>
                <p className="mt-1 text-xs text-white/60">Campaign application</p>
                {application.messages[0] && (
                  <p className="mt-2 line-clamp-1 text-sm text-white/70">{application.messages[0].text}</p>
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
