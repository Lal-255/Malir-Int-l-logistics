import { site } from "@/config/site";
import { href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { formText } from "@/i18n/formText";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ContactCard } from "@/components/ContactCard";
import { Arrow, LinkButton, Section } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.contact, path: "/contact" });
}

export default async function ContactPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const C = t.contactPage;
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={C.eyebrow} title={C.title} intro={C.intro} image="terminal" crumbs={[{ href: "/contact", label: C.crumb }]}>
        <LinkButton href={href(lang, "/quote")}>{C.rateBtn} <Arrow /></LinkButton>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">{site.name}</h2>
              <p className="mt-3 leading-relaxed text-slate">{C.blurb}</p>
            </div>
            <ContactCard t={t} />
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
            <h2 className="text-2xl font-bold">{C.formTitle}</h2>
            <p className="mt-2 text-sm text-slate">{C.formIntroA} <a className="font-semibold text-ocean-600 underline-offset-4 hover:underline" href={href(lang, "/quote")}>{C.formIntroLink}</a> {C.formIntroB}</p>
            <div className="mt-8"><InquiryForm kind="contact" ft={formText(t)} lang={lang} /></div>
          </div>
        </div>
      </Section>

      {site.address && (
        <section aria-label={C.mapLabel} className="h-[420px] w-full bg-mist">
          <iframe title={site.address} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`} />
        </section>
      )}
      <JsonLd data={breadcrumbLd(lang, t.nav.home, [{ name: C.crumb, path: "/contact" }])} />
    </>
  );
}
