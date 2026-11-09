/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  COMPANY DETAILS — EDIT THIS FILE BEFORE PUBLICATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every value set to `null` is shown on the site as a clearly marked
 *  "pending verification" placeholder. Replace with verified information only.
 *  Do not add registration numbers, certifications, addresses or contact
 *  details that have not been verified.
 *
 *  Contact details can also be supplied through environment variables
 *  (see .env.example) so they can be changed without a code edit.
 */

// Literal process.env.NEXT_PUBLIC_* references are required so Next.js can inline them in the browser bundle.
const clean = (v: string | undefined) => (v && v.trim().length > 0 ? v.trim() : null);
const ENV = {
  url: clean(process.env.NEXT_PUBLIC_SITE_URL),
  legalNameCn: clean(process.env.NEXT_PUBLIC_LEGAL_NAME_CN),
  registrationNumber: clean(process.env.NEXT_PUBLIC_REGISTRATION_NO),
  address: clean(process.env.NEXT_PUBLIC_OFFICE_ADDRESS),
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP),
};

export const site = {
  /** Public brand name */
  name: "MALIR INT’L LOGISTICS",
  shortName: "Malir Int’l Logistics",
  tagline: "Connecting China with the Middle East",
  altTagline: "Your Trusted China–Middle East Shipping Partner",
  description:
    "International FCL ocean freight solutions connecting Chinese ports with importers, exporters, and logistics partners across the Middle East and Red Sea region.",

  /** Production URL, e.g. https://www.malirlogistics.com  (placeholder until the domain is confirmed) */
  url: (ENV.url ?? "https://malirlogistics.com").replace(/\/$/, ""),
  domainConfirmed: true,

  /** Legal Chinese registered name, e.g. "深圳市……有限公司" */
  legalNameCn: ENV.legalNameCn as string | null,
  /** Unified Social Credit Code / business licence reference */
  registrationNumber: ENV.registrationNumber as string | null,
  /** Verified office address (Shenzhen / China). The map on the contact page appears only when this is set. */
  address: ENV.address as string | null,
  /** Official business email */
  email: ENV.email as string | null,
  /** WhatsApp number in international format, digits only, e.g. 8613800000000. The floating WhatsApp button appears only when set. */
  whatsapp: (ENV.whatsapp ?? "8615323482585") as string | null,

  registeredCountry: "China",
};

export const hasVerified = {
  email: site.email !== null,
  whatsapp: site.whatsapp !== null,
  address: site.address !== null,
  registration: site.registrationNumber !== null,
  legalName: site.legalNameCn !== null,
};

export const whatsappLink = (text?: string) =>
  site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}` : null;

export const mailtoLink = (subject?: string, body?: string) => {
  if (!site.email) return null;
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${qs ? `?${qs}` : ""}`;
};

export const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/routes", label: "Routes" },
  { href: "/containers", label: "Containers" },
  { href: "/industries", label: "Industries" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
] as const;
