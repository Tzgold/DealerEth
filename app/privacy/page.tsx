import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "DealerEth privacy policy describing how creator and brand information is handled.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      updatedAt="June 27, 2026"
      intro="This policy explains what information DealerEth collects, how it is used, and how creators and brands can understand the data involved in using the platform."
    >
      <LegalSection title="1. Information we collect">
        <p>
          DealerEth may collect account information such as email address, account role, login provider, and authentication identifiers. Creators may provide profile information including name, username, TikTok handle, avatar, niche, bio, follower count, rate range, and portfolio links.
        </p>
        <p>
          Brands may provide company information including company name, website, contact name, industry, brand description, logo or avatar, campaign briefs, budgets, deliverables, deadlines, and direct collaboration requests.
        </p>
      </LegalSection>

      <LegalSection title="2. Information from Google or TikTok">
        <p>
          If you choose to sign in with Google or TikTok, DealerEth may receive basic account or profile information from that provider, such as account identifiers, display name, avatar, email address when available, username, and profile details allowed by the scopes you approve.
        </p>
        <p>
          DealerEth uses this information to create or sign in to your account, prefill profile details when appropriate, and improve the creator-brand collaboration experience.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <p>
          We use collected information to operate the platform, authenticate users, display creator and brand profiles, publish campaign briefs, support discovery filters, process applications and direct requests, show notifications, and maintain message threads connected to collaboration activity.
        </p>
      </LegalSection>

      <LegalSection title="4. Public profile information">
        <p>
          Creator public pages are designed to be shareable. Information you add to a public creator profile, such as your name, username, bio, niche, follower count, portfolio links, avatar, and rate range, may be visible to visitors and brands.
        </p>
      </LegalSection>

      <LegalSection title="5. Messages, requests, and campaign activity">
        <p>
          DealerEth stores campaign applications, direct requests, statuses, and messages so creators and brands can manage collaboration history. These records are shown only to the relevant creator, brand, or authorized account context.
        </p>
      </LegalSection>

      <LegalSection title="6. File uploads">
        <p>
          If you upload an avatar or profile image, DealerEth stores that file so it can be displayed on your dashboard, profile, public page, or campaign-related views.
        </p>
      </LegalSection>

      <LegalSection title="7. Data sharing">
        <p>
          DealerEth does not sell personal information. Information is shared only as needed to provide the platform experience, display public profile content, support creator-brand collaboration, comply with legal obligations, or work with service providers that help operate the application.
        </p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          DealerEth uses session cookies and access controls to protect account areas. No online service can guarantee perfect security, so users should keep credentials private and avoid sharing sensitive payment or personal information in unsecured messages.
        </p>
      </LegalSection>

      <LegalSection title="9. Your choices">
        <p>
          You can update profile information through your dashboard. You can also choose not to connect third-party login providers or remove optional profile fields where the platform allows.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          For privacy questions or data-related requests, contact the DealerEth team through the official contact channel provided on the platform or project repository.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
