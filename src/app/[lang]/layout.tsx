import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource-variable/vazirmatn";
import "../globals.css";
import { site } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd } from "@/lib/seo";
import { locales, localeInfo } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { t } = await resolve(params);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${t.meta.defaultTitle} | ${site.shortName}`, template: `%s | ${site.shortName}` },
    description: t.meta.siteDescription,
    applicationName: site.shortName,
    robots: site.domainConfirmed ? { index: true, follow: true } : { index: false, follow: false },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = { themeColor: "#0a1c36", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children, params }: { children: React.ReactNode } & LangParams) {
  const { lang, t } = await resolve(params);
  const info = localeInfo[lang];
  return (
    <html lang={info.htmlLang} dir={info.dir}>
      <body>
        <Header lang={lang} nav={t.nav} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
        <WhatsAppFloat lang={lang} t={t.wa} quoteLabel={t.nav.quoteLong} contactLabel={t.wa.contact} />
        <Reveal />
        <JsonLd data={organizationLd(t.meta.siteDescription)} />
      </body>
    </html>
  );
}
