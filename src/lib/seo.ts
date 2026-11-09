import type { Metadata } from "next";
import { site } from "@/config/site";
import { href, locales, localeInfo, type Locale } from "@/i18n/config";

const abs = (p: string) => `${site.url}${p === "/" ? "" : p}`;

export function pageMeta({ lang, title, description, path, absoluteTitle = false }: { lang: Locale; title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeInfo[l].htmlLang] = href(l, path);
  languages["x-default"] = path;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: href(lang, path), languages },
    openGraph: { title, description, url: abs(href(lang, path)), siteName: site.shortName, type: "website", locale: localeInfo[lang].ogLocale },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const organizationLd = (description: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  description,
  slogan: site.tagline,
  logo: `${site.url}/brand/logo-512.png`,
  areaServed: ["Saudi Arabia", "United Arab Emirates", "Iraq", "Oman", "Qatar", "Kuwait", "Bahrain", "Egypt", "Jordan", "Sudan", "Yemen", "China"],
  address: { "@type": "PostalAddress", addressCountry: "CN", ...(site.address ? { streetAddress: site.address } : {}) },
  ...(site.email ? { email: site.email } : {}),
  ...(site.whatsapp ? { telephone: `+${site.whatsapp}` } : {}),
  knowsLanguage: ["en", "ar", "fa", "zh"],
});

export const breadcrumbLd = (lang: Locale, homeLabel: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: homeLabel, path: "/" }, ...items].map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(href(lang, it.path)) })),
});

export const serviceLd = (lang: Locale, name: string, description: string, areaServed: string[]) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "FCL ocean freight",
  name,
  description,
  inLanguage: localeInfo[lang].htmlLang,
  provider: { "@id": `${site.url}/#organization` },
  areaServed,
});

export const faqLd = (lang: Locale, items: readonly { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: localeInfo[lang].htmlLang,
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
