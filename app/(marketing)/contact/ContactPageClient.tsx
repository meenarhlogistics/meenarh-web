"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MarketingPageHeader } from "@/components/marketing/MarketingPageHeader";
import { Card } from "@/components/ui";
import { COMPANY_CONTACT, CONTACT_CONTENT, SITE_CONFIG } from "@/lib/constants";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export function ContactPageClient() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${baseUrl}/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSettings(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const phone = settings.phone || settings.support_phone;
  const email = settings.email || settings.support_email;
  const address = settings.address || settings.company_address;
  const whatsappLink = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`
    : SITE_CONFIG.whatsappLink;

  return (
    <div className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <MarketingPageHeader title={CONTACT_CONTENT.title} subtitle={CONTACT_CONTENT.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-foreground">Get in touch</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading contact details…</p>
            ) : (
              <ul className="space-y-4 list-none p-0 m-0">
                {phone ? (
                  <li className="flex gap-3 text-sm">
                    <Phone className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    <a href={`tel:${phone}`} className="text-foreground hover:text-primary">
                      {phone}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li className="flex gap-3 text-sm">
                    <Mail className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    <a href={`mailto:${email}`} className="text-foreground hover:text-primary">
                      {email}
                    </a>
                  </li>
                ) : null}
                {address ? (
                  <li className="flex gap-3 text-sm">
                    <MapPin className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="text-muted-foreground">{address}</span>
                  </li>
                ) : null}
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
                <li className="flex gap-3 text-sm">
                  <Instagram className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden />
                  <a
                    href={COMPANY_CONTACT.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary"
                  >
                    @meenarhlogistics on Instagram
                  </a>
                </li>
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-foreground mb-4">{CONTACT_CONTENT.hoursTitle}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
              {CONTACT_CONTENT.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Ready to book?{" "}
          <Link href="/pricing#quote" className="text-primary font-medium hover:underline">
            Request a quote
          </Link>
        </p>
      </div>
    </div>
  );
}
