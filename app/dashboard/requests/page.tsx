import Link from "next/link";
import { DealRequestActions } from "@/components/dashboard/deal-request-actions";
import { getPublicProfileUrls, requireCreatorProfile } from "@/lib/dashboard-context";

export default async function CreatorRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { profile } = await requireCreatorProfile();
  const urls = await getPublicProfileUrls(profile.username);
  const activeFilter = status === "accepted" || status === "declined" ? status.toUpperCase() : "NEW";
  const requests = profile.dealRequests.filter((request) => request.status === activeFilter);

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Brand deal requests</h1>
        <p className="mt-1 text-sm text-white/65">Direct requests from brands who found your public page.</p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Request filters">
        {[["NEW", "Inbox"], ["ACCEPTED", "Accepted"], ["DECLINED", "Declined"]].map(([value, label]) => (
          <Link
            key={value}
            href={value === "NEW" ? "/dashboard/requests" : `/dashboard/requests?status=${value.toLowerCase()}`}
            className={`de-chip ${activeFilter === value ? "de-chip-active" : ""}`}
          >
            {label} ({profile.dealRequests.filter((request) => request.status === value).length})
          </Link>
        ))}
      </nav>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#141416]">
        {requests.length === 0 ? (
          <li className="px-5 py-8 text-sm text-white/60">
            No {activeFilter.toLowerCase()} requests. Share your bio link{" "}
            <span className="font-mono text-white/80">{urls.display}</span> on TikTok.
          </li>
        ) : (
          requests.map((request) => (
            <li key={request.id} className="px-5 py-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-bold text-white">{request.name}</p>
                <p className="text-sm font-semibold text-[#25F4EE]">{request.budget}</p>
              </div>
              <a href={`mailto:${request.email}`} className="mt-1 text-xs text-white/55 hover:text-white">
                {request.email}
              </a>
              <p className="mt-3 text-sm leading-7 text-white/80">{request.description}</p>
              <p className="mt-2 text-xs text-white/50">Deliverables: {request.deliverables}</p>
              <p className="mt-3 text-xs text-white/40">{new Date(request.createdAt).toLocaleDateString()}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                <DealRequestActions requestId={request.id} currentStatus={request.status} />
                <a href={`mailto:${request.email}?subject=${encodeURIComponent("Your DealerEth collaboration request")}`} className="de-btn de-btn-secondary">
                  Reply by email
                </a>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
