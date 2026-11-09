import { resolve, type LangParams } from "@/i18n/page";
import { formText } from "@/i18n/formText";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ContactCard } from "@/components/ContactCard";
import { Arrow, Check, LinkButton, Section, SectionHeading } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.partner, path: "/partner" });
}

export default async function PartnerPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const P = t.partnerPage;
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={P.eyebrow} title={P.title} intro={P.intro} image="cranes" crumbs={[{ href: "/partner", label: P.crumb }]}>
        <LinkButton href="#partner-form">{P.start} <Arrow /></LinkButton>
      </PageHero>

      <Section>
        <SectionHeading eyebrow={P.whoEyebrow} title={P.whoTitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {P.audiences.map((a) => (
            <article key={a.t} data-reveal className="rounded-xl border border-line p-7">
              <h3 className="text-lg font-bold">{a.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{a.d}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <SectionHeading light eyebrow={P.bringEyebrow} title={P.bringTitle} />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {P.offer.map((o) => (
            <div key={o.t} data-reveal className="bg-navy-900 p-8">
              <Check className="h-6 w-6 text-gold-400" />
              <h3 className="mt-4 text-lg font-bold !text-white">{o.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{o.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={P.stepsEyebrow} title={P.stepsTitle} />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {P.steps.map((s, i) => (
            <li key={s.t} data-reveal className="rounded-xl bg-mist p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 font-display font-bold text-gold-400">{i + 1}</span>
              <h3 className="mt-4 font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="mist" id="partner-form">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr]">
          <div>
            <SectionHeading eyebrow={P.formEyebrow} title={P.formTitle} intro={P.formIntro} />
            <ContactCard t={t} className="mt-10 bg-white" />
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
            <InquiryForm kind="partner" ft={formText(t)} lang={lang} />
          </div>
        </div>
      </Section>
      <JsonLd data={breadcrumbLd(lang, t.nav.home, [{ name: P.crumb, path: "/partner" }])} />
    </>
  );
}
