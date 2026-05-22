import type { Metadata } from "next";
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-serif",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meenarh Logistics | Fast, Trackable Deliveries Across Lagos",
  description:
    "Send packages and track them in real time—from pickup to delivery. Lagos-focused logistics with real-time tracking and transparent delivery updates.",
  keywords: [
    "Lagos delivery",
    "package tracking",
    "logistics Lagos",
    "same day delivery",
    "Meenarh Logistics",
  ],
  openGraph: {
    title: "Meenarh Logistics | Fast, Trackable Deliveries Across Lagos",
    description:
      "Send packages and track them in real time—from pickup to delivery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <ToastProvider />
        <GrainOverlay />
      </body>
    </html>
  );
}
