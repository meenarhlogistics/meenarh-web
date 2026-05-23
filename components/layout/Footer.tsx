"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  COMPANY_CONTACT,
  FOOTER_LANDING_CONTENT,
  FOOTER_LINKS,
  FOOTER_STAFF_LINK,
  SITE_CONFIG,
} from "@/lib/constants";

const linkFocus =
  "cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted transition-colors";

export type FooterVariant = "compact" | "fullPage";

interface FooterProps {
  variant?: FooterVariant;
  companyName?: string;
  tagline?: string;
  whatsappLink?: string;
  whatsappLabel?: string;
}

export function Footer({
  variant = "compact",
  companyName: propName,
  tagline: propTagline,
  whatsappLink: propWhatsapp,
  whatsappLabel = "Chat on WhatsApp",
}: FooterProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${baseUrl}/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSettings(data.data);
      })
      .catch(() => {});
  }, []);

  const companyName = propName || settings.company_name || "Meenarh Logistics";
  const tagline = propTagline || settings.tagline || "Fast, trackable deliveries across Lagos.";
  const whatsappLink =
    propWhatsapp ||
    (settings.whatsapp
      ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
      : SITE_CONFIG.whatsappLink);
  const currentYear = new Date().getFullYear();

  const { headline, primaryCta, secondaryCta, quickContactLabel, quickContactLinkLabel, socialLabel, socialLinks, privacyHref, attribution } =
    FOOTER_LANDING_CONTENT;

  const sitemapLinks = (
    <nav aria-label="Site links" className="flex flex-col gap-2">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
        Explore
      </p>
      <ul className="flex flex-col gap-1 list-none p-0 m-0">
        {FOOTER_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-sm font-medium text-foreground hover:text-primary ${linkFocus} inline-flex min-h-10 items-center`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={FOOTER_STAFF_LINK.href}
            className={`text-sm font-medium text-muted-foreground hover:text-foreground ${linkFocus} inline-flex min-h-10 items-center`}
          >
            {FOOTER_STAFF_LINK.label}
          </Link>
        </li>
      </ul>
    </nav>
  );

  if (variant === "fullPage") {
    return (
      <footer className="bg-muted min-h-[100dvh] flex flex-col px-4 sm:px-8 lg:px-12">
        <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto py-12 lg:py-16 min-h-0">
          <div className="flex-1 grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div className="flex justify-center items-center order-2 lg:order-1 py-4 lg:py-0">
              <Image
                src="/meenarh logo.svg"
                alt={`${companyName} logo`}
                width={320}
                height={320}
                className="w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain select-none"
                priority={false}
              />
            </div>

            <div className="order-1 lg:order-2 flex flex-col gap-8 lg:gap-10 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-0">
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl font-semibold text-foreground leading-snug max-w-prose tracking-tight">
                {headline}
              </h2>

              <div className="flex flex-wrap gap-3">
                <a
                  href={primaryCta.href}
                  className={`inline-flex min-h-11 items-center justify-center px-6 py-2.5 text-sm font-semibold uppercase tracking-wide bg-primary text-primary-foreground hover:opacity-90 ${linkFocus}`}
                >
                  {primaryCta.label}
                </a>
                <a
                  href={secondaryCta.href}
                  className={`inline-flex min-h-11 items-center justify-center px-6 py-2.5 text-sm font-semibold uppercase tracking-wide border border-border bg-background text-foreground hover:bg-accent/50 ${linkFocus}`}
                >
                  {secondaryCta.label}
                </a>
              </div>

              <div className="flex flex-col gap-8 sm:gap-10">
                {sitemapLinks}

                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,10rem)_1fr] gap-x-8 gap-y-2 items-start text-left">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-0.5">
                    {quickContactLabel}
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-base font-medium text-foreground hover:text-primary underline-offset-4 hover:underline ${linkFocus} inline-flex w-fit min-h-11 items-center`}
                  >
                    {quickContactLinkLabel}
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,10rem)_1fr] gap-x-8 gap-y-2 items-start text-left">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground pt-0.5">
                    {socialLabel}
                  </p>
                  <ul className="flex flex-col gap-2 list-none p-0 m-0">
                    {socialLinks.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-base font-medium text-foreground hover:text-primary underline-offset-4 hover:underline ${linkFocus} inline-flex min-h-11 items-center`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-12 lg:pt-16 shrink-0 border-t border-border/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground gap-y-3">
              <p className="text-center sm:text-left">
                © {currentYear} {companyName}. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
                {privacyHref ? (
                  <a href={privacyHref} className={`hover:text-foreground ${linkFocus}`}>
                    Privacy policy
                  </a>
                ) : null}
                {attribution ? <span className="text-center sm:text-right max-w-xs sm:max-w-none">{attribution}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-muted py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/meenarh logo.svg"
                alt={companyName}
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-semibold text-foreground">{companyName}</span>
            </div>
            <p className="text-sm text-muted-foreground">{tagline}</p>
          </div>

          {sitemapLinks}

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Connect
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors ${linkFocus}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {whatsappLabel}
            </a>
            <a
              href={COMPANY_CONTACT.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center text-sm font-medium text-foreground hover:text-primary transition-colors ${linkFocus}`}
            >
              {COMPANY_CONTACT.instagramLabel}
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center sm:text-left border-t border-border/70 pt-6">
          © {currentYear} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
