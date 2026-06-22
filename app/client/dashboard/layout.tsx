import { BrandDashboardShell } from "@/components/dashboard/brand-dashboard-shell";
import { requireClientProfile } from "@/lib/dashboard-context";

export default async function BrandDashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireClientProfile();
  const avatar = profile.avatarUrl ?? profile.user.googleAvatarUrl ?? "/next.svg";
  const applicationCount = profile.campaigns.reduce(
    (sum, campaign) => sum + campaign.applications.filter((application) => application.status === "APPLIED").length,
    0,
  );

  return (
    <BrandDashboardShell avatar={avatar} liveCampaigns={profile.campaigns.filter((campaign) => campaign.status === "LIVE").length} applicationCount={applicationCount}>
      {children}
    </BrandDashboardShell>
  );
}
