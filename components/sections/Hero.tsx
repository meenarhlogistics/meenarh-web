"use client";

import { FloatingIconsHero } from "@/components/ui/floating-icons-hero-section";
import type { FloatingIconsHeroProps } from "@/components/ui/floating-icons-hero-section";
import { MapPin } from "lucide-react";

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCta: string;
  quoteCta: string;
  quoteHref: string;
  contactCta: string;
  contactHref: string;
  inputPlaceholder: string;
  cursiveAccent?: string;
}

const heroIcons: FloatingIconsHeroProps["icons"] = [
  { id: 1, icon: MapPin, className: "top-[10%] left-[10%]", label: "Yaba" },
  { id: 2, icon: MapPin, className: "top-[20%] right-[8%]", label: "Lekki" },
  { id: 3, icon: MapPin, className: "top-[80%] left-[10%]", label: "Ikeja" },
  { id: 4, icon: MapPin, className: "bottom-[10%] right-[10%]", label: "Surulere" },
  { id: 5, icon: MapPin, className: "top-[5%] left-[30%]", label: "Ajah" },
  { id: 6, icon: MapPin, className: "top-[5%] right-[30%]", label: "Victoria Island" },
  { id: 7, icon: MapPin, className: "bottom-[8%] left-[25%]", label: "Ikoyi" },
  { id: 8, icon: MapPin, className: "top-[40%] left-[15%]", label: "Sangotedo" },
  { id: 9, icon: MapPin, className: "top-[75%] right-[25%]", label: "Alimosho" },
  { id: 10, icon: MapPin, className: "top-[90%] left-[70%]", label: "Mushin" },
  { id: 11, icon: MapPin, className: "top-[50%] right-[5%]", label: "Oshodi" },
  { id: 12, icon: MapPin, className: "top-[55%] left-[5%]", label: "Agege" },
  { id: 13, icon: MapPin, className: "top-[5%] left-[55%]", label: "Festac" },
  { id: 14, icon: MapPin, className: "bottom-[5%] right-[45%]", label: "Apapa" },
  { id: 15, icon: MapPin, className: "top-[25%] right-[20%]", label: "Epe" },
  { id: 16, icon: MapPin, className: "top-[60%] left-[30%]", label: "Badagry" },
];

export function Hero({
  headline,
  subheadline,
  primaryCta,
  quoteCta,
  quoteHref,
  contactCta,
  contactHref,
  inputPlaceholder,
  cursiveAccent,
}: HeroProps) {
  return (
    <FloatingIconsHero
      title={headline}
      subtitle={subheadline}
      ctaText={primaryCta}
      icons={heroIcons}
      cursiveAccent={cursiveAccent}
      quoteCta={quoteCta}
      quoteHref={quoteHref}
      contactCta={contactCta}
      contactHref={contactHref}
      inputPlaceholder={inputPlaceholder}
    />
  );
}
