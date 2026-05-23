"use client";

import { usePathname } from "next/navigation";
import { Navigation, Footer } from "@/components/layout";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Navigation
        logo={SITE_CONFIG.name}
        links={NAV_LINKS}
        ctaText="Login"
        ctaHref="/login"
      />
      <div className={isHome ? undefined : "pt-28"}>{children}</div>
      {!isHome && (
        <Footer
          variant="compact"
          companyName={SITE_CONFIG.name}
          tagline={SITE_CONFIG.tagline}
          whatsappLink={SITE_CONFIG.whatsappLink}
          whatsappLabel={SITE_CONFIG.whatsappLabel}
        />
      )}
    </>
  );
}
