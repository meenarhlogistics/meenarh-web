import { Footer } from "@/components/layout";
import {
  Hero,
  HeroVisual,
  HowItWorks,
  TrackingPreview,
  Coverage,
  WhyUs,
  Testimonials,
  CallToAction,
  ServicesOverview,
} from "@/components/sections";
import {
  SITE_CONFIG,
  HERO_CONTENT,
  HOW_IT_WORKS_CONTENT,
  TRACKING_PREVIEW_CONTENT,
  COVERAGE_CONTENT,
  WHY_US_CONTENT,
  TESTIMONIALS_CONTENT,
  CTA_CONTENT,
  SERVICES_OVERVIEW_CONTENT,
} from "@/lib/constants";

export default function Home() {
  return (
    <>
      <main>
        <Hero
          headline={HERO_CONTENT.headline}
          subheadline={HERO_CONTENT.subheadline}
          primaryCta={HERO_CONTENT.primaryCta}
          quoteCta={HERO_CONTENT.quoteCta}
          quoteHref={HERO_CONTENT.quoteHref}
          contactCta={HERO_CONTENT.contactCta}
          contactHref={HERO_CONTENT.contactHref}
          inputPlaceholder={HERO_CONTENT.inputPlaceholder}
          cursiveAccent={HERO_CONTENT.cursiveAccent}
        />

        <HeroVisual />

        <ServicesOverview
          title={SERVICES_OVERVIEW_CONTENT.title}
          subtitle={SERVICES_OVERVIEW_CONTENT.subtitle}
          services={SERVICES_OVERVIEW_CONTENT.services}
        />

        <HowItWorks
          title={HOW_IT_WORKS_CONTENT.title}
          steps={HOW_IT_WORKS_CONTENT.steps}
        />

        <TrackingPreview
          title={TRACKING_PREVIEW_CONTENT.title}
          description={TRACKING_PREVIEW_CONTENT.description}
          events={TRACKING_PREVIEW_CONTENT.events}
        />

        <Coverage
          title={COVERAGE_CONTENT.title}
          description={COVERAGE_CONTENT.description}
          regions={COVERAGE_CONTENT.regions}
        />

        <WhyUs title={WHY_US_CONTENT.title} points={WHY_US_CONTENT.points} />

        <Testimonials
          title={TESTIMONIALS_CONTENT.title}
          subtitle={TESTIMONIALS_CONTENT.subtitle}
          testimonials={TESTIMONIALS_CONTENT.testimonials}
        />

        <CallToAction
          headline={CTA_CONTENT.headline}
          description={CTA_CONTENT.description}
          buttonText={CTA_CONTENT.buttonText}
          helperText={CTA_CONTENT.helperText}
          primaryHref={CTA_CONTENT.primaryHref}
          secondaryButtonText={CTA_CONTENT.secondaryButtonText}
          secondaryHref={CTA_CONTENT.secondaryHref}
          appStoreHref={CTA_CONTENT.appStoreHref}
          googlePlayHref={CTA_CONTENT.googlePlayHref}
        />
      </main>

      <Footer
        variant="fullPage"
        companyName={SITE_CONFIG.name}
        tagline={SITE_CONFIG.tagline}
        whatsappLink={SITE_CONFIG.whatsappLink}
        whatsappLabel={SITE_CONFIG.whatsappLabel}
      />
    </>
  );
}
