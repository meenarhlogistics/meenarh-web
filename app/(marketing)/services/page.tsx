import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { Card } from "@/components/ui";
import { SERVICES_CONTENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Delivery Services | Meenarh Logistics",
  description:
    "Standard same-day, express, and business delivery options across Lagos with transparent route-based pricing.",
};

export default function ServicesPage() {
  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <MarketingPageHeader title={SERVICES_CONTENT.title} subtitle={SERVICES_CONTENT.intro} />

        <div className="space-y-12">
          {SERVICES_CONTENT.tiers.map((tier) => (
            <section key={tier.id} id={tier.id} className="scroll-mt-28">
              <Card className="p-6 sm:p-8">
                <p className="text-sm font-medium text-primary mb-2">{tier.tagline}</p>
                <h2 className="text-2xl font-semibold text-foreground mb-4">{tier.title}</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Who it&apos;s for: </span>
                    {tier.whoFor}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">What to expect: </span>
                    {tier.expect}
                  </p>
                  <div>
                    <p className="font-medium text-foreground mb-2">Key conditions</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {tier.conditions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/pricing#quote"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Get a quote
                  </Link>
                  {tier.id === "business" ? (
                    <Link
                      href="/contact"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Contact us for volume plans
                    </Link>
                  ) : null}
                </div>
              </Card>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
