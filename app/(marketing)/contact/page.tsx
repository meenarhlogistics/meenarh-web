import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact | Meenarh Logistics",
  description: "Phone, email, WhatsApp, and business hours for Meenarh Logistics in Lagos.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
