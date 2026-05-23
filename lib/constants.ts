// Content constants for Meenarh Logistics marketing site

import { trackLoginUrl } from "@/lib/auth/trackLogin";

/** Official company contact channels (used when API settings are empty). */
export const COMPANY_CONTACT = {
  whatsappNumber: "2349048795414",
  whatsappLink: "https://wa.me/2349048795414",
  instagramLink:
    "https://www.instagram.com/meenarhlogistics?igsh=cXUybmMzeHMycTc1&utm_source=qr",
  instagramLabel: "Instagram",
};

export const SITE_CONFIG = {
  name: "Meenarh Logistics",
  tagline: "Fast, trackable deliveries across Lagos.",
  whatsappLink: COMPANY_CONTACT.whatsappLink,
  whatsappLabel: "Chat on WhatsApp",
};

export const FOOTER_LANDING_CONTENT = {
  headline: "Let's talk about your deliveries and the next steps.",
  primaryCta: { label: "Get a quote", href: "/pricing#quote" },
  secondaryCta: {
    label: "Contact us",
    href: "/contact",
  },
  quickContactLabel: "Quick contact",
  quickContactLinkLabel: "WhatsApp",
  socialLabel: "Social media",
  socialLinks: [
    { label: COMPANY_CONTACT.instagramLabel, href: COMPANY_CONTACT.instagramLink },
  ],
  privacyHref: undefined as string | undefined,
  attribution: undefined as string | undefined,
};

/** Header navigation — FAQ is footer-only */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Track", href: "/dashboard/track", guestHref: trackLoginUrl() },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export type NavLink = {
  label: string;
  href: string;
  guestHref?: string;
};

/** Footer sitemap — includes FAQ */
export const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

/** Staff-only entry point (footer only, not in main nav). */
export const FOOTER_STAFF_LINK = {
  label: "Staff login",
  href: "/admin/login",
};

export const HERO_CONTENT = {
  headline: "Lagos Logistics You Can Track End to End",
  subheadline:
    "Same-day delivery, express options, and business plans — with real-time tracking from pickup to drop-off across Lagos.",
  primaryCta: "Track Shipment",
  quoteCta: "Get a Quote",
  quoteHref: "/pricing#quote",
  contactCta: "Contact Us",
  contactHref: "/contact",
  inputPlaceholder: "Enter tracking code (e.g. MN-2026-0001)",
  cursiveAccent: "Track",
};

export const HOW_IT_WORKS_CONTENT = {
  title: "How it works",
  steps: [
    {
      id: 1,
      title: "Book a Pickup",
      description: "Sign in, choose your route, and add package details.",
      imageSrc: "/Book-a-pickup.png",
      imageAlt: "Illustration of booking a package pickup on your phone",
    },
    {
      id: 2,
      title: "We Handle the Delivery",
      description: "A rider picks up and moves your package across Lagos.",
      imageSrc: "/we-handle-delivery.png",
      imageAlt: "Illustration of a delivery rider handling your package",
    },
    {
      id: 3,
      title: "Track in Real Time",
      description: "Follow clear status updates until delivery is complete.",
      imageSrc: "/track-in-realtime.png",
      imageAlt: "Illustration of real-time package tracking on a mobile device",
    },
  ],
};

export const TRACKING_PREVIEW_CONTENT = {
  title: "Real-Time Delivery Updates",
  description:
    "Sign in to track your shipment with clear status updates at every stage — from pickup to delivery.",
  events: [
    { status: "Order Created", isActive: true, isCompleted: true },
    { status: "Picked Up", isActive: true, isCompleted: true },
    { status: "In Transit", isActive: true, isCompleted: false },
    { status: "Out for Delivery", isActive: false, isCompleted: false },
    { status: "Delivered", isActive: false, isCompleted: false },
  ],
};

export const COVERAGE_CONTENT = {
  title: "Serving Key Areas Across Lagos",
  description:
    "We currently operate across major Lagos zones to ensure fast and reliable deliveries.",
  regions: [
    {
      name: "Mainland",
      areas: ["Yaba", "Surulere", "Ikeja"],
      variant: "sage" as const,
    },
    {
      name: "Island",
      areas: ["Lekki", "Victoria Island", "Ikoyi"],
      variant: "lavender" as const,
    },
    {
      name: "Expanding",
      areas: ["Ajah", "Sangotedo", "Alimosho"],
      variant: "white" as const,
    },
  ],
};

export const WHY_US_CONTENT = {
  title: "Why Meenarh Logistics",
  points: [
    {
      title: "Real-time package tracking",
      description: "Know where your package is at every moment.",
      icon: "tracking",
    },
    {
      title: "Event-based delivery status updates",
      description: "Get notified at every stage of delivery.",
      icon: "notification",
    },
    {
      title: "Lagos-focused operations",
      description: "Built specifically for Lagos delivery needs.",
      icon: "location",
    },
    {
      title: "Reliable and transparent process",
      description: "No hidden fees, no surprises.",
      icon: "shield",
    },
  ],
};

export const SERVICES_OVERVIEW_CONTENT = {
  title: "Delivery options for every need",
  subtitle: "Choose the service that fits your timeline and budget.",
  services: [
    {
      id: "standard",
      title: "Standard Same-Day",
      description: "Reliable same-day delivery across supported Lagos routes.",
      href: "/services#standard",
    },
    {
      id: "express",
      title: "Express Delivery",
      description: "Priority handling when speed matters most.",
      href: "/services#express",
    },
    {
      id: "business",
      title: "Business & Vendor Plans",
      description: "Flat-rate options for shops and regular senders.",
      href: "/services#business",
    },
  ],
};

export const SERVICES_CONTENT = {
  title: "Our delivery services",
  intro:
    "Meenarh Logistics helps individuals and businesses move packages across Lagos with transparent pricing and trackable deliveries.",
  tiers: [
    {
      id: "standard",
      title: "Standard Same-Day Delivery",
      tagline: "Not time-guaranteed — dependable same-day service",
      whoFor:
        "Individuals and businesses sending within Lagos who need a cost-effective option with tracking.",
      expect:
        "Pickup and delivery within our operating window for your route. ETA is shown when you book based on pickup and delivery areas.",
      conditions: [
        "Delivery windows vary by route and are indicative, not guaranteed to the minute.",
        "Receiver must be reachable at the delivery address.",
        "Some areas may have limited same-day availability — check pricing for your route.",
      ],
    },
    {
      id: "express",
      title: "Express Delivery",
      tagline: "Premium priority service",
      whoFor:
        "Urgent documents, time-sensitive parcels, and customers who need faster handling.",
      expect:
        "Priority processing and the quickest available window on your route. Pricing reflects the premium service level.",
      conditions: [
        "Subject to rider availability and route coverage.",
        "Not a fixed-time guarantee unless agreed separately in writing.",
        "Fragile or high-value items should be declared when booking.",
      ],
    },
    {
      id: "business",
      title: "Business / Vendor Delivery Plans",
      tagline: "Flat-rate style pricing for regular senders",
      whoFor:
        "Online sellers, vendors, and businesses with recurring deliveries between fixed areas.",
      expect:
        "Simplified pricing on supported routes when you book through your account. Ideal for high-volume senders.",
      conditions: [
        "Rates depend on configured pickup and delivery zones.",
        "Account registration required to book and track.",
        "Contact us for custom volume arrangements beyond standard routes.",
      ],
    },
  ],
};

export const FAQ_CONTENT = {
  title: "Frequently asked questions",
  subtitle: "Quick answers about how Meenarh deliveries work.",
  items: [
    {
      id: "same-day-express",
      question: "What is the difference between same-day and express delivery?",
      answer:
        "Standard same-day is our regular service for supported routes — you get a clear ETA when you book, but we do not guarantee an exact minute. Express is a premium option with priority handling for urgent shipments. Both are booked through your account with route-based pricing.",
    },
    {
      id: "pickup-wait",
      question: "How long will the rider wait at pickup?",
      answer:
        "Riders allow a short window for handover at pickup (typically a few minutes). Please have the package ready and contact details available. Extended waits may delay your delivery or require rescheduling.",
    },
    {
      id: "unavailable",
      question: "What happens if the customer is unavailable at delivery?",
      answer:
        "We will attempt to reach the receiver by phone. If delivery cannot be completed, the package may be returned to sender or held for redelivery depending on the situation. Additional fees may apply for return trips.",
    },
    {
      id: "areas",
      question: "Which areas do you serve?",
      answer:
        "We operate across major Lagos zones including mainland and island areas, with ongoing expansion. Check our coverage section on the home page or use the pricing calculator to see if your route is supported.",
    },
  ],
};

export const ABOUT_CONTENT = {
  title: "About Meenarh Logistics",
  story:
    "Meenarh Logistics was built for Lagos — a city where deliveries need to be fast, honest, and easy to follow. We combine local operations know-how with simple technology so senders and receivers always know what is happening.",
  values: [
    {
      title: "Transparency",
      description: "Clear pricing at booking and status updates you can trust.",
    },
    {
      title: "Reliability",
      description: "Consistent processes from pickup to proof of delivery.",
    },
    {
      title: "Local focus",
      description: "Routes, riders, and support designed for Lagos realities.",
    },
  ],
  trustTitle: "Why customers trust us",
  trustPoints: [
    "Track every shipment from your account",
    "Route-based pricing shown before you pay",
    "Responsive support via phone, email, and WhatsApp",
  ],
};

export const CONTACT_CONTENT = {
  title: "Contact us",
  subtitle: "Reach our team for quotes, partnerships, or delivery support.",
  hoursTitle: "Business hours",
  hours: [
    "Monday – Friday: 8:00 AM – 6:00 PM",
    "Saturday: 9:00 AM – 2:00 PM",
    "Sunday & public holidays: Closed (urgent support via WhatsApp where available)",
  ],
};

export const PRICING_CONTENT = {
  title: "Pricing & quotes",
  subtitle: "See indicative prices for your route, then request a full quote when you are ready to book.",
  calculatorTitle: "Price calculator",
  calculatorDisclaimer:
    "Prices shown are indicative for the selected route. Final amount is confirmed at checkout in your account.",
  quoteTitle: "Request a quote",
  quoteSubtitle:
    "Fill in your delivery details. We will take you to sign up or sign in, then pre-fill your booking form.",
  deliveryTypes: [
    { value: "standard", label: "Standard same-day" },
    { value: "express", label: "Express" },
    { value: "business", label: "Business / vendor" },
  ],
  packageSizes: [
    { value: "small", label: "Small (envelope / small parcel)" },
    { value: "medium", label: "Medium (shoebox size)" },
    { value: "large", label: "Large (requires confirmation)" },
  ],
};

export const TESTIMONIALS_CONTENT = {
  title: "What Early Customers Are Saying",
  subtitle: "Feedback from pilot deliveries across Lagos.",
  testimonials: [
    {
      id: 1,
      quote:
        "The tracking updates made it easy to know exactly where my package was. No stress.",
      author: "Small business owner",
      location: "Yaba",
    },
    {
      id: 2,
      quote:
        "Pickup was smooth and delivery happened faster than I expected.",
      author: "Online seller",
      location: "Lekki",
    },
    {
      id: 3,
      quote:
        "I liked that I didn't have to keep calling the rider. The status updates were clear.",
      author: "Customer",
      location: "Surulere",
    },
  ],
};

export const CTA_CONTENT = {
  headline: "Ready to send a package?",
  description:
    "Create an account to get a quote, book pickups, and track every delivery in real time.",
  buttonText: "Get a quote",
  helperText: "Already have an account? Sign in to continue",
  primaryHref: "/pricing#quote",
  secondaryButtonText: "Sign in",
  secondaryHref: "/login",
  appStoreHref: undefined as string | undefined,
  googlePlayHref: undefined as string | undefined,
};
