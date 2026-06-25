import { CreatorDashboardShell } from "@/components/dashboard/creator-dashboard-shell";
import { getPublicProfileUrls, requireCreatorProfile } from "@/lib/dashboard-context";

export default async function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireCreatorProfile();
  const avatar = profile.avatarUrl ?? profile.user.tiktokAvatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const urls = await getPublicProfileUrls(profile.username);
  const messageCount = profile.applications.filter((application) => application.messages[0]?.senderRole === "CLIENT").length;

  return (
    <CreatorDashboardShell
      avatar={avatar}
      publicProfilePath={urls.path}
      newOffers={profile.dealRequests.filter((request) => request.status === "NEW").length}
      messageCount={messageCount}
    >
      {children}
    </CreatorDashboardShell>
  );
}
