import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { LegalDocument } from "@/components/marketing/LegalDocument";
import { TERMS_PAGE } from "@/lib/legal/termsContent";

export const metadata: Metadata = {
  title: "Terms of Service | Meenarh Logistics",
  description:
    "Booking, payment, delivery areas, restricted items, and accountability rules for Meenarh Logistics courier services in Lagos.",
};

export default function TermsPage() {
  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <MarketingPageHeader title={TERMS_PAGE.title} subtitle={TERMS_PAGE.subtitle} />
        <LegalDocument intro={TERMS_PAGE.intro} sections={TERMS_PAGE.sections} />
      </div>
    </div>
  );
}
