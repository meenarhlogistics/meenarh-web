import type { Metadata } from "next";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { Card } from "@/components/ui";
import { ABOUT_CONTENT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Meenarh Logistics",
  description:
    "Learn about Meenarh Logistics — Lagos-focused delivery with transparent pricing and real-time tracking.",
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <MarketingPageHeader title={ABOUT_CONTENT.title} />

        <p className="text-lg text-muted-foreground leading-relaxed mb-12">{ABOUT_CONTENT.story}</p>

        <h2 className="text-xl font-semibold text-foreground mb-6">Our values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {ABOUT_CONTENT.values.map((v) => (
            <Card key={v.title} className="p-5">
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">{ABOUT_CONTENT.trustTitle}</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          {ABOUT_CONTENT.trustPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
