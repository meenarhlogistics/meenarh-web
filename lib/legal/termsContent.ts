import { LEGAL_CONTACT_EMAIL, type LegalSection } from "./shared";

export const TERMS_PAGE = {
  title: "Terms of Service",
  subtitle:
    "These terms govern your use of Meenarh Logistics services and our booking platform. By creating an account or placing a booking, you agree to them.",
  intro: [
    "Meenarh Logistics provides courier and delivery services primarily within Lagos, Nigeria, through our website and customer dashboard. These Terms of Service (“Terms”) apply to all bookings, shipments, and use of our platform.",
    "You must provide accurate information when registering and when booking pickups or deliveries. You are responsible for ensuring that anyone whose details you submit (senders, receivers, or third parties) has agreed to share their information with us for the purpose of completing the shipment.",
    "Our operational policies below form part of your agreement with us. Where a booking is made through the platform, payment confirms your booking as described in Section 1.",
    `We may update these Terms from time to time. Material changes will be posted on this page with an updated effective date. Questions: ${LEGAL_CONTACT_EMAIL}. These Terms are governed by the laws of the Federal Republic of Nigeria.`,
  ],
  sections: [
    {
      id: "payment",
      title: "1. Payment Confirms Booking",
      paragraphs: [
        "Your delivery is only confirmed after payment is made. No payment, no dispatch.",
      ],
    },
    {
      id: "failed-pickup",
      title: "2. Failed Pickup or Delivery Attracts Charges",
      paragraphs: [
        "If a sender or receiver is unavailable, unreachable, or delays the rider, it is considered a failed trip and a fee based on location will apply. Rider wait time is 20 minutes.",
      ],
    },
    {
      id: "same-day",
      title: "3. Same-Day Delivery Within Lagos",
      paragraphs: [
        "We offer same-day delivery to most parts of Lagos. Pickups happen in the morning to mid-day, and deliveries start from afternoon till evening. Express delivery costs extra.",
        "Same-day delivery takes a minimum of 8–12 hours after pickup.",
      ],
    },
    {
      id: "no-pickup-locations",
      title: "4. We Don’t Pick Up from These Locations",
      paragraphs: ["We do not pick up from the following locations:"],
      bullets: ["Lagos Island", "Trade Fair", "Alaba", "Opic Isheri", "Ikorodu"],
    },
    {
      id: "no-same-day-outskirts",
      title: "5. No Same-Day Delivery to These Outskirts",
      paragraphs: [
        "Same-day delivery is not available for these areas due to traffic and distance:",
      ],
      bullets: [
        "Ikorodu",
        "Ogba – Fagba / Egbeda",
        "Ojo / Alaba / Iyana Iba",
        "Abule Egba / Alakuko / Ayobo",
        "Berger / Opic Berger / Opic Isheri",
        "Festac / Apapa",
      ],
    },
    {
      id: "restricted-items",
      title: "6. Restricted Items",
      paragraphs: [
        "We do not deliver cooked food.",
        "Items such as skincare, perfume, or medicine must have valid NAFDAC registration.",
        "Meenarh Logistics will not be responsible for fines, seizures, or recovery costs for unregistered or restricted items.",
      ],
    },
    {
      id: "address-responsibility",
      title: "7. Address & Booking Responsibility",
      paragraphs: [
        "Customers must confirm that their delivery location is within our service areas before booking.",
        "Full and correct address details must be provided at the point of booking.",
        "Any delay or failed delivery caused by wrong, incomplete, or unclear address details is the customer’s responsibility.",
      ],
    },
    {
      id: "special-requests",
      title: "8. Special Requests (Returns, POD, Multiple Stops)",
      paragraphs: [
        "Kindly notify us ahead for return pickups, payment on delivery (POD), or multiple drop-offs. Additional charges apply.",
      ],
    },
    {
      id: "no-delivery-areas",
      title: "9. Areas We Do NOT Deliver To",
      paragraphs: [
        "Meenarh Logistics does not offer delivery services from the following areas:",
      ],
      bullets: [
        "Badagry axis (Agbara, Mowo, Aradagun, Ijanikin)",
        "Epe & environs (Epe, Ibeju, Eleko, Lakowe, Sangotedo outskirts)",
        "Mowe / Ibafo",
        "Ayetoro",
        "Alimosho outskirts",
        "Okokomaiko / Igbo-Elerin / Iyana-Era / Iyana Ishashi",
        "Olambe / Akute / Ojodu-Berger outskirts",
        "Sango-Toll Gate / Ijoko",
        "Sending an address from a non-service area without confirmation may result in delays or cancellation.",
      ],
    },
    {
      id: "unclaimed",
      title: "10. Unclaimed / Delayed Items",
      paragraphs: [
        "Any item left with the company for more than 7 days due to customer unavailability, incorrect address, or lack of response is entirely at the customer’s risk.",
        "Once a receiver is contacted for pickup at a delivery location or park, items must be picked up within 3–7 days. Beyond this, Meenarh Logistics will not be responsible for loss or damage.",
      ],
    },
    {
      id: "interstate",
      title: "11. Interstate Pickups",
      paragraphs: [
        "Free inter-state pickup applies only when a vendor has up to 5 Lagos-bound orders.",
        "Pickup time is morning to noon. Late pickup requests may be scheduled for the next working day.",
      ],
    },
    {
      id: "accountability",
      title: "12. Accountability",
      paragraphs: [
        "We take responsibility for confirmed service failures on our end.",
        "However, Meenarh Logistics will not absorb losses resulting from customer negligence, misinformation, or booking without confirmation.",
      ],
    },
  ] satisfies LegalSection[],
};
