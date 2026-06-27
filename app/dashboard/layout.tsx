import { CreatorDashboardShell } from "@/components/dashboard/creator-dashboard-shell";
import { getPublicProfileUrls, requireCreatorProfile } from "@/lib/dashboard-context";
import { getSeenNotifications, isNotificationSeen } from "@/lib/notification-seen";

export default async function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireCreatorProfile();
  const seen = await getSeenNotifications();
  const avatar = profile.avatarUrl ?? profile.user.tiktokAvatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const urls = await getPublicProfileUrls(profile.username);
  const messageCount = profile.applications.filter((application) => {
    const latestMessage = application.messages[0];
    return latestMessage?.senderRole === "CLIENT" && !isNotificationSeen(seen, `application:${application.id}`, latestMessage.createdAt);
  }).length;

  return (
    <CreatorDashboardShell
      avatar={avatar}
      publicProfilePath={urls.path}
      newOffers={profile.dealRequests.filter((request) => request.status === "NEW" && !isNotificationSeen(seen, `deal-request:${request.id}`, request.createdAt)).length}
      messageCount={messageCount}
    >
      {children}
    </CreatorDashboardShell>
  );
}
