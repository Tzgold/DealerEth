import Link from "next/link";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-ui";
import { NotificationSeenMarker } from "@/components/dashboard/notification-seen-marker";
import { requireClientProfile } from "@/lib/dashboard-context";

const statusValues = ["NEW", "ACCEPTED", "IN_DISCUSSION", "ACTIVE", "COMPLETED", "DECLINED"] as const;

const filterLabels: Record<(typeof statusValues)[number], string> = {
  NEW: "Sent",
  ACCEPTED: "Accepted",
  IN_DISCUSSION: "Discussion",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  DECLINED: "Declined",
};

const nextCopy: Record<(typeof statusValues)[number], string> = {
  NEW: "Waiting for the creator to review.",
  ACCEPTED: "The creator accepted. Reply by email and align the details.",
  IN_DISCUSSION: "You are discussing scope, timing, and deliverables.",
  ACTIVE: "The collaboration is active.",
  COMPLETED: "This direct request is completed.",
  DECLINED: "The creator declined this request.",
};

export default async function BrandDirectRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { profile } = await requireClientProfile();
  const normalizedStatus = status?.toUpperCase();
  const activeFilter = statusValues.find((value) => value === normalizedStatus) ?? "NEW";
  const requests = profile.dealRequests.filter((request) => request.status === activeFilter);
  const openRequests = profile.dealRequests.filter((request) => request.status === "ACCEPTED" || request.status === "IN_DISCUSSION" || request.status === "ACTIVE").length;
  const seenItems = profile.dealRequests
    .filter((request) => request.status === "ACCEPTED" || request.status === "IN_DISCUSSION" || request.status === "ACTIVE")
    .map((request) => ({ key: `deal-request:${request.id}`, time: request.createdAt.toISOString() }));

  return (
    <>
      <NotificationSeenMarker items={seenItems} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Direct requests</h1>
          <p className="mt-1 text-sm text-white/65">
            Track collaboration requests you sent directly from creator profiles. {openRequests > 0 ? `${openRequests} open ${openRequests === 1 ? "deal needs" : "deals need"} follow-up.` : "No open direct deals right now."}
          </p>
        </div>
        <Link href="/client/dashboard/creators" className="de-btn de-btn-primary">
          Discover creators
        </Link>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Direct request filters">
        {statusValues.map((value) => (
          <Link
            key={value}
            href={value === "NEW" ? "/client/dashboard/requests" : `/client/dashboard/requests?status=${value.toLowerCase()}`}
            className={`de-chip ${activeFilter === value ? "de-chip-active" : ""}`}
          >
            {filterLabels[value]} ({profile.dealRequests.filter((request) => request.status === value).length})
          </Link>
        ))}
      </nav>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#141416]">
        {requests.length === 0 ? (
          <li className="p-4">
            <DashboardEmptyState
              title={`No ${filterLabels[activeFilter].toLowerCase()} direct requests`}
              description="Open a creator profile, attach one of your live campaigns, and send a clear collaboration message."
              href="/client/dashboard/creators"
              action="Find creators"
            />
          </li>
        ) : (
          requests.map((request) => (
            <li key={request.id} className="px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-white">{request.creator.name}</p>
                  <p className="mt-1 text-xs text-white/55">
                    @{request.creator.username} · {request.creator.niche}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                  {request.status.replace("_", " ")}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-white/80">{request.description}</p>
              <p className="mt-2 text-sm font-semibold text-white/70">{request.budget}</p>
              <p className="mt-1 text-xs text-white/50">Deliverables: {request.deliverables}</p>

              {request.campaign && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Attached campaign</p>
                  <p className="mt-1 text-sm font-bold text-white">{request.campaign.title}</p>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    Budget: {request.campaign.budget}
                    {request.campaign.deadline ? ` · Deadline: ${request.campaign.deadline}` : ""}
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                <p className="text-xs font-semibold text-white/50">{nextCopy[request.status]}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${request.creator.username}`} className="de-btn de-btn-secondary min-h-9 py-2 text-xs">
                    View creator
                  </Link>
                  <a href={`mailto:${request.creator.user.email}?subject=${encodeURIComponent("DealerEth collaboration follow-up")}`} className="de-btn de-btn-primary min-h-9 py-2 text-xs">
                    Follow up by email
                  </a>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
