import Link from "next/link";
import { getPublicProfileUrls, requireCreatorProfile } from "@/lib/dashboard-context";

export default async function CreatorRequestsPage() {
  const { profile } = await requireCreatorProfile();
  const urls = await getPublicProfileUrls(profile.username);

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Brand deal requests</h1>
        <p className="mt-1 text-sm text-white/65">Direct requests from brands who found your public page.</p>
      </div>

      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#141416]">
        {profile.dealRequests.length === 0 ? (
          <li className="px-5 py-8 text-sm text-white/60">
            No requests yet. Share your bio link{" "}
            <span className="font-mono text-white/80">{urls.display}</span> on TikTok.
          </li>
        ) : (
          profile.dealRequests.map((request) => (
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
            </li>
          ))
        )}
      </ul>
    </>
  );
}
