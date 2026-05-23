import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { PriceCalculator } from "@/components/marketing/PriceCalculator";
import { QuoteRequestForm } from "@/components/marketing/QuoteRequestForm";
import { PRICING_CONTENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing & Quotes | Meenarh Logistics",
  description:
    "Estimate delivery prices for Lagos routes and request a quote to book with Meenarh Logistics.",
};

export default function PricingPage() {
  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
        <MarketingPageHeader title={PRICING_CONTENT.title} subtitle={PRICING_CONTENT.subtitle} />

        <PriceCalculator
          title={PRICING_CONTENT.calculatorTitle}
          disclaimer={PRICING_CONTENT.calculatorDisclaimer}
        />

        <QuoteRequestForm
          title={PRICING_CONTENT.quoteTitle}
          subtitle={PRICING_CONTENT.quoteSubtitle}
          deliveryTypes={PRICING_CONTENT.deliveryTypes}
          packageSizes={PRICING_CONTENT.packageSizes}
        />
      </div>
    </div>
  );
}
