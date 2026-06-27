import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "DealerEth terms of service for creators, brands, and visitors.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updatedAt="June 27, 2026"
      intro="These terms explain the rules for using DealerEth as a creator, brand, or visitor. By using the platform, you agree to use it responsibly and follow the collaboration standards described below."
    >
      <LegalSection title="1. About DealerEth">
        <p>
          DealerEth is a creator-brand collaboration platform that helps creators present their work, helps brands discover creator talent, and supports campaign applications, direct requests, and message-based collaboration workflows.
        </p>
      </LegalSection>

      <LegalSection title="2. Accounts and eligibility">
        <p>
          You are responsible for the information you provide when creating an account or profile. You agree that your account details, creator profile, brand profile, campaign briefs, and collaboration requests will be accurate and not misleading.
        </p>
        <p>
          You are responsible for keeping your login credentials secure and for all activity that occurs through your account.
        </p>
      </LegalSection>

      <LegalSection title="3. Creator profiles and brand campaigns">
        <p>
          Creators may publish profile information such as name, username, TikTok handle, avatar, niche, audience size, rate range, bio, and portfolio links. Brands may publish campaign briefs, budgets, deliverables, deadlines, and related company information.
        </p>
        <p>
          You must not post unlawful, abusive, deceptive, infringing, or harmful content. DealerEth may remove content or restrict access if platform use appears unsafe, fraudulent, or inconsistent with these terms.
        </p>
      </LegalSection>

      <LegalSection title="4. Collaborations and payments">
        <p>
          DealerEth helps organize discovery, requests, applications, statuses, and communication. Unless a separate written agreement says otherwise, users are responsible for confirming final campaign terms, deliverables, payment details, timelines, approvals, and legal obligations with each other.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-party services">
        <p>
          DealerEth may integrate with third-party services such as Google or TikTok for authentication and profile-related information. Your use of those services is also governed by their own terms and policies.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>
          You agree not to misuse the platform, attempt unauthorized access, interfere with platform security, scrape data without permission, impersonate another person or company, or use DealerEth to send spam or harmful content.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and changes">
        <p>
          DealerEth may change, improve, suspend, or discontinue parts of the platform as the product evolves. We aim to keep the service reliable, but we do not guarantee uninterrupted availability.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          For questions about these terms, contact the DealerEth team through the official contact channel provided on the platform or project repository.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
