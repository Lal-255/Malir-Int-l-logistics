import { site } from "@/config/site";
import { fmt, href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, Check, LinkButton, Section, SectionHeading } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.about, path: "/about" });
}

export default async function AboutPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const A = t.about;
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={A.eyebrow} title={A.title} intro={A.intro} image="harbor" crumbs={[{ href: "/about", label: A.crumb }]} />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={A.companyEyebrow} title={A.companyTitle} />
            <div data-reveal className="prose-copy mt-6">
              <p>{fmt(A.p1, { name: site.shortName })}</p>
              <p>{A.p2}</p>
              <p>{A.p3}</p>
            </div>
          </div>
          <Photo name="rail" className="min-h-[28rem] rounded-2xl" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-3">
          {A.cards.map((x) => (
            <div key={x.t} data-reveal className="rounded-xl bg-white p-8 shadow-card">
              <h2 className="text-xl font-bold">{x.t}</h2>
              <p className="mt-3 leading-relaxed text-slate">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={A.howEyebrow} title={A.howTitle} />
        <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {t.reasons.map((r) => (
            <li key={r.title} data-reveal className="flex gap-4">
              <Check className="mt-1 h-5 w-5 text-gold-500" />
              <div>
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-slate">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mist">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 className="text-2xl font-bold">{A.closing}</h2>
          <LinkButton href={href(lang, "/contact")} variant="navy">{A.contactBtn} <Arrow /></LinkButton>
        </div>
      </Section>

      <CtaBand lang={lang} t={t} />
      <JsonLd data={breadcrumbLd(lang, t.nav.home, [{ name: A.crumb, path: "/about" }])} />
    </>
  );
}
