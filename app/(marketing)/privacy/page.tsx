import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { PRIVACY_PAGE } from "@/lib/legal/privacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Meenarh Logistics",
  description:
    "How Meenarh Logistics collects, uses, and protects personal data in line with the Nigeria Data Protection Act (NDPA).",
};

export default function PrivacyPage() {
  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <MarketingPageHeader title={PRIVACY_PAGE.title} subtitle={PRIVACY_PAGE.subtitle} />
        <LegalDocument intro={PRIVACY_PAGE.intro} sections={PRIVACY_PAGE.sections} />
      </div>
    </div>
  );
}
