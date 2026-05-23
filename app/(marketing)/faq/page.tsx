import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { FAQ_CONTENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ | Meenarh Logistics",
  description: "Answers about same-day delivery, express service, pickup windows, and Lagos coverage.",
};

export default function FAQPage() {
  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <MarketingPageHeader title={FAQ_CONTENT.title} subtitle={FAQ_CONTENT.subtitle} />

        <FAQAccordion items={FAQ_CONTENT.items} />

        <p className="mt-10 text-center text-sm text-muted-foreground">
          See our{" "}
          <Link href="/#coverage" className="text-primary font-medium hover:underline">
            coverage areas
          </Link>{" "}
          or read about{" "}
          <Link href="/services" className="text-primary font-medium hover:underline">
            delivery services
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
