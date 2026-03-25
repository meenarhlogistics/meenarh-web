import { Navigation, Footer } from "@/components/layout";
import {
  Hero,
  HowItWorks,
  TrackingPreview,
  Coverage,
  WhyUs,
  Testimonials,
  CallToAction,
} from "@/components/sections";
import {
  SITE_CONFIG,
  NAV_LINKS,
  HERO_CONTENT,
  HOW_IT_WORKS_CONTENT,
  TRACKING_PREVIEW_CONTENT,
  COVERAGE_CONTENT,
  WHY_US_CONTENT,
  TESTIMONIALS_CONTENT,
  CTA_CONTENT,
} from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Navigation
        logo={SITE_CONFIG.name}
        links={NAV_LINKS}
        ctaText="Login"
        ctaHref="/login"
      />

      <main>
        {/* 1. Hero Section */}
        <Hero
          headline={HERO_CONTENT.headline}
          subheadline={HERO_CONTENT.subheadline}
          primaryCta={HERO_CONTENT.primaryCta}
          secondaryCta={HERO_CONTENT.secondaryCta}
          inputPlaceholder={HERO_CONTENT.inputPlaceholder}
          cursiveAccent={HERO_CONTENT.cursiveAccent}
        />

        {/* 2. How It Works */}
        <HowItWorks
          title={HOW_IT_WORKS_CONTENT.title}
          steps={HOW_IT_WORKS_CONTENT.steps}
        />

        {/* 3. Tracking Transparency Preview */}
        <TrackingPreview
          title={TRACKING_PREVIEW_CONTENT.title}
          description={TRACKING_PREVIEW_CONTENT.description}
          events={TRACKING_PREVIEW_CONTENT.events}
        />

        {/* 4. Lagos Coverage */}
        <Coverage
          title={COVERAGE_CONTENT.title}
          description={COVERAGE_CONTENT.description}
          regions={COVERAGE_CONTENT.regions}
        />

        {/* 5. Why Meenarh */}
        <WhyUs title={WHY_US_CONTENT.title} points={WHY_US_CONTENT.points} />

        {/* 6. Testimonials */}
        <Testimonials
          title={TESTIMONIALS_CONTENT.title}
          subtitle={TESTIMONIALS_CONTENT.subtitle}
          testimonials={TESTIMONIALS_CONTENT.testimonials}
        />

        {/* 7. Call to Action */}
        <CallToAction
          headline={CTA_CONTENT.headline}
          description={CTA_CONTENT.description}
          buttonText={CTA_CONTENT.buttonText}
          helperText={CTA_CONTENT.helperText}
        />
      </main>

      {/* 8. Footer */}
      <Footer
        companyName={SITE_CONFIG.name}
        tagline={SITE_CONFIG.tagline}
        whatsappLink={SITE_CONFIG.whatsappLink}
        whatsappLabel={SITE_CONFIG.whatsappLabel}
      />
    </>
  );
}
