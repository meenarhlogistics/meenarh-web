import { LEGAL_CONTACT_EMAIL, type LegalSection } from "./shared";

export const PRIVACY_PAGE = {
  title: "Privacy Policy",
  subtitle:
    "How Meenarh Logistics collects, uses, and protects personal data when you use our website, account, and delivery services.",
  intro: [
    `Meenarh Logistics (“we”, “us”, “our”) is the data controller for personal information processed through our platform and delivery operations. This Privacy Policy explains what we collect, why we use it, who we share it with, and your rights under the Nigeria Data Protection Act (NDPA) and related guidance from the Nigeria Data Protection Commission (NDPC).`,
    `For privacy requests or questions about this policy, contact us at ${LEGAL_CONTACT_EMAIL}.`,
  ],
  sections: [
    {
      id: "scope",
      title: "1. Scope",
      paragraphs: [
        "This policy applies to visitors of our marketing website, registered customers using the dashboard, public order tracking, payment flows, and related communications (email notifications).",
        "It also covers personal data we process about senders and receivers when you book a shipment on their behalf.",
      ],
    },
    {
      id: "data-we-collect",
      title: "2. Personal data we collect",
      paragraphs: ["Depending on how you use our services, we may collect:"],
      bullets: [
        "Account data: name, email address, phone number, optional default address, and password (stored only as a secure hash).",
        "Shipment data: sender and receiver names, phone numbers, pickup and delivery addresses, package description, quantity, fragile flag, declared item value, tracking number, delivery status, and regional pricing selections.",
        "Payment data: transaction references, amounts, currency, promo codes, and payment status. Card and bank details are processed by Paystack; we do not store full payment card numbers.",
        "Authentication data: session tokens issued via secure HTTP-only cookies and, where applicable, email verification or password-reset codes.",
        "Technical data: page URLs, a browser session identifier, and IP address when you use our site (including analytics page views).",
        "Communications: content needed to send transactional emails (order confirmations, status updates, verification, and password reset).",
      ],
    },
    {
      id: "how-we-use",
      title: "3. How we use your data",
      paragraphs: ["We use personal data to:"],
      bullets: [
        "Create and manage your account and authenticate you.",
        "Process bookings, calculate pricing, fulfil pickups and deliveries, and provide tracking.",
        "Process payments and reconcile transactions with Paystack.",
        "Send service-related emails (verification, confirmations, status updates, password reset).",
        "Operate our business, including internal admin tools, customer support, fraud prevention, and rate limiting.",
        "Understand site usage through aggregated analytics (visitors, page views, conversion trends).",
        "Comply with legal, regulatory, and tax obligations.",
      ],
    },
    {
      id: "legal-bases",
      title: "4. Legal bases for processing",
      paragraphs: [
        "We process personal data where necessary to perform our contract with you (account, booking, payment, delivery), where required by law, where we have a legitimate interest (security, analytics, improving our services) balanced against your rights, or where you have given consent (for example, agreeing to this policy at signup).",
      ],
    },
    {
      id: "courier",
      title: "5. Courier and logistics processing",
      paragraphs: [
        "As a courier and logistics operator, we create and retain shipment records (manifest-style data) including sender and receiver identity, contact details, and addresses. This is necessary to perform deliveries, handle disputes, and meet operational and regulatory expectations in the logistics sector.",
        "Contact details and addresses may be shared with pickup and delivery personnel or subcontractors strictly to complete the shipment.",
        "We may disclose information to regulators or authorities (including bodies such as NIPOST or the Courier & Logistics Regulatory Department, or law enforcement) when required by applicable Nigerian law or a lawful request.",
      ],
    },
    {
      id: "public-tracking",
      title: "6. Public order tracking",
      paragraphs: [
        "Anyone who has your tracking number can view certain shipment details through our public tracking feature without logging in. This may include sender and receiver names, phone numbers, addresses, package information, price, and delivery status.",
        "Do not share your tracking number with people you do not trust. If you book on behalf of others, inform them that their details may be visible to anyone with the tracking number.",
      ],
    },
    {
      id: "third-parties",
      title: "7. Third parties and processors",
      paragraphs: [
        "We use trusted service providers, including:",
        "We do not sell your personal data. Processors act on our instructions and only for the purposes described in this policy.",
      ],
      bullets: [
        "Paystack — payment processing and transaction verification.",
        "Resend — delivery of transactional emails.",
        "Hosting and infrastructure providers that store and run our applications and databases.",
        "When you contact us via WhatsApp or Instagram, those platforms process your data under their own privacy policies.",
      ],
    },
    {
      id: "cookies",
      title: "8. Cookies and browser storage",
      paragraphs: [
        "We use essential cookies to keep you signed in (for example, meenarh_customer_token) and to help protect against cross-site request forgery (csrf_token).",
        "We may store a session identifier in your browser (sessionStorage) for analytics and, before checkout, to remember quote or form draft information on your device.",
        "Admin users may have limited profile data cached in local storage for convenience. You can clear cookies and site data in your browser settings; some features may not work without essential cookies.",
      ],
    },
    {
      id: "retention",
      title: "9. Data retention",
      paragraphs: [
        "We keep account data while your account is active and for a reasonable period afterward unless you request deletion, subject to legal exceptions.",
        "Shipment and payment records are retained for longer periods where needed for customer support, dispute resolution, accounting, tax, and courier regulatory requirements.",
        "Password-reset and email-verification tokens are kept only until used or expired. Analytics and log data are retained for a limited operational period.",
      ],
    },
    {
      id: "rights",
      title: "10. Your rights",
      paragraphs: [
        "Under the NDPA, you may have the right to access, rectify, or erase your personal data, restrict or object to certain processing, withdraw consent where processing is consent-based, and lodge a complaint with the Nigeria Data Protection Commission.",
        `To exercise your rights, email ${LEGAL_CONTACT_EMAIL}. We will respond within the timeframes required by applicable law. We may need to verify your identity before fulfilling a request.`,
      ],
    },
    {
      id: "security",
      title: "11. Security",
      paragraphs: [
        "We use technical and organisational measures including password hashing, HTTPS, access controls for staff accounts, and signed payment webhooks. No method of transmission or storage is completely secure; we cannot guarantee absolute security.",
      ],
    },
    {
      id: "children",
      title: "12. Children",
      paragraphs: [
        "Our services are not directed at anyone under 18. We do not knowingly collect personal data from children. If you believe we have collected a child’s data, contact us and we will take appropriate steps to delete it.",
      ],
    },
    {
      id: "international",
      title: "13. International transfers",
      paragraphs: [
        "Some processors (such as email or payment providers) may process data outside Nigeria. Where this occurs, we rely on appropriate safeguards permitted under applicable law and contractual protections with those providers.",
      ],
    },
    {
      id: "changes",
      title: "14. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The effective date at the top of this page shows when it was last revised. Continued use of our services after changes constitutes notice of the updated policy where permitted by law.",
      ],
    },
    {
      id: "contact",
      title: "15. Contact",
      paragraphs: [
        `Meenarh Logistics — privacy and data protection enquiries: ${LEGAL_CONTACT_EMAIL}.`,
        "Postal or registered business address: Lagos, Nigeria (as published on our Contact page or company settings).",
      ],
    },
  ] satisfies LegalSection[],
};
