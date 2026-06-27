import { BrandDashboardShell } from "@/components/dashboard/brand-dashboard-shell";
import { requireClientProfile } from "@/lib/dashboard-context";
import { getSeenNotifications, isNotificationSeen } from "@/lib/notification-seen";

export default async function BrandDashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireClientProfile();
  const seen = await getSeenNotifications();
  const avatar = profile.avatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const applicationCount = profile.campaigns.reduce(
    (sum, campaign) =>
      sum +
      campaign.applications.filter((application) => {
        const latestMessage = application.messages[application.messages.length - 1];
        const time = latestMessage?.senderRole === "CREATOR" ? latestMessage.createdAt : application.updatedAt;
        const shouldNotify = application.status === "APPLIED" || (application.status === "IN_CHAT" && latestMessage?.senderRole === "CREATOR");
        return shouldNotify && !isNotificationSeen(seen, `application:${application.id}`, time);
      }).length,
    0,
  );
  const dealRequestCount = profile.dealRequests.filter(
    (request) =>
      (request.status === "ACCEPTED" || request.status === "IN_DISCUSSION" || request.status === "ACTIVE") &&
      !isNotificationSeen(seen, `deal-request:${request.id}`, request.createdAt),
  ).length;

  return (
    <BrandDashboardShell avatar={avatar} applicationCount={applicationCount} dealRequestCount={dealRequestCount}>
      {children}
    </BrandDashboardShell>
  );
}
