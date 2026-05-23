"use client";

import * as React from "react";
import {
  FloatingIconsHero,
  type FloatingIconsHeroProps,
} from "@/components/ui/floating-icons-hero-section";
import {
  Truck,
  MapPin,
  Package,
  Clock,
  Bike,
  Building2,
  Route,
  Navigation,
  MapPinned,
  Timer,
  Warehouse,
  Box,
  Send,
  LocateFixed,
  CircleDot,
  ShieldCheck,
} from "lucide-react";

const LucideIcon = (Icon: React.FC<React.SVGProps<SVGSVGElement>>) => Icon;

const demoIcons: FloatingIconsHeroProps["icons"] = [
  { id: 1, icon: LucideIcon(Truck), className: "top-[10%] left-[10%]" },
  { id: 2, icon: LucideIcon(MapPin), className: "top-[20%] right-[8%]" },
  { id: 3, icon: LucideIcon(Package), className: "top-[80%] left-[10%]" },
  { id: 4, icon: LucideIcon(Clock), className: "bottom-[10%] right-[10%]" },
  { id: 5, icon: LucideIcon(Bike), className: "top-[5%] left-[30%]" },
  { id: 6, icon: LucideIcon(Building2), className: "top-[5%] right-[30%]" },
  { id: 7, icon: LucideIcon(Route), className: "bottom-[8%] left-[25%]" },
  { id: 8, icon: LucideIcon(Navigation), className: "top-[40%] left-[15%]" },
  { id: 9, icon: LucideIcon(MapPinned), className: "top-[75%] right-[25%]" },
  { id: 10, icon: LucideIcon(Timer), className: "top-[90%] left-[70%]" },
  { id: 11, icon: LucideIcon(Warehouse), className: "top-[50%] right-[5%]" },
  { id: 12, icon: LucideIcon(Box), className: "top-[55%] left-[5%]" },
  { id: 13, icon: LucideIcon(Send), className: "top-[5%] left-[55%]" },
  { id: 14, icon: LucideIcon(LocateFixed), className: "bottom-[5%] right-[45%]" },
  { id: 15, icon: LucideIcon(CircleDot), className: "top-[25%] right-[20%]" },
  { id: 16, icon: LucideIcon(ShieldCheck), className: "top-[60%] left-[30%]" },
];

export { demoIcons };

export default function FloatingIconsHeroDemo() {
  return (
    <FloatingIconsHero
      title="Lagos Deliveries, Right On Time"
      subtitle="From Yaba to Lekki, Ikeja to Ajah — track every package across Lagos in real time."
      ctaText="Start Shipping in Lagos"
      icons={demoIcons}
    />
  );
}
