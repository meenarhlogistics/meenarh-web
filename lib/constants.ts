// Content constants for Meenarh Logistics Landing Page
// All copy is centralized here for easy updates

export const SITE_CONFIG = {
  name: "Meenarh Logistics",
  tagline: "Fast, trackable deliveries across Lagos.",
  whatsappLink: "https://wa.me/2348000000000", // Placeholder
  whatsappLabel: "Chat on WhatsApp",
};

/** Full-viewport home footer copy (layout in Footer variant="fullPage") */
export const FOOTER_LANDING_CONTENT = {
  headline: "Let's talk about your deliveries and the next steps.",
  primaryCta: { label: "Get started", href: "/signup" },
  secondaryCta: {
    label: "hello@meenarh.com",
    href: "mailto:hello@meenarh.com",
  },
  quickContactLabel: "Quick contact",
  /** Shown next to quick contact label; href still comes from WhatsApp settings / props */
  quickContactLinkLabel: "WhatsApp",
  socialLabel: "Social media",
  socialLinks: [
    { label: "X (Twitter)", href: "https://x.com/meenarh" },
    { label: "Instagram", href: "https://instagram.com/meenarh" },
  ],
  /** Set when a privacy page exists; omitted from UI when falsy */
  privacyHref: undefined as string | undefined,
  /** Optional right-side credit line in the bottom bar */
  attribution: undefined as string | undefined,
};

export const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
  { label: "Track", href: "/dashboard/track" },
  { label: "Blog", href: "/blog" },
];

export const HERO_CONTENT = {
  headline: "Fast, Trackable Deliveries Across Lagos",
  subheadline:
    "From Yaba to Lekki, Ikeja to Ajah — we keep every Lagos delivery trackable in real time.",
  primaryCta: "Track a Package",
  /** Base path for hero “Track” submit (query `tracking` appended when code entered) */
  trackHref: "/dashboard/track",
  secondaryCta: "Request a Pickup",
  inputPlaceholder: "Enter tracking code (e.g. MN-2026-0001)",
  cursiveAccent: "Trackable",
};

export const HOW_IT_WORKS_CONTENT = {
  title: "How it works",
  steps: [
    {
      id: 1,
      title: "Book a Pickup",
      description: "Provide pickup and delivery details.",
      imageSrc: "/Book-a-pickup.png",
    },
    {
      id: 2,
      title: "We Handle the Delivery",
      description: "A rider picks up and moves your package.",
      imageSrc: "/we-handle-delivery.png",
    },
    {
      id: 3,
      title: "Track in Real Time",
      description: "Receive live status updates until delivery.",
      imageSrc: "/track-in-realtime.png",
    },
  ],
};

export const TRACKING_PREVIEW_CONTENT = {
  title: "Real-Time Delivery Updates",
  description:
    "Every delivery is tracked through clear status updates, so you always know what's happening.",
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
  headline: "Ready to Send a Package?",
  description:
    "Sign in to request a pickup and start tracking your deliveries in real time.",
  buttonText: "Get Started",
  helperText: "New to Meenarh? Create an account to begin",
  primaryHref: "/login",
  /** Set when iOS app is published; row hidden if both store URLs are unset */
  appStoreHref: undefined as string | undefined,
  googlePlayHref: undefined as string | undefined,
};
