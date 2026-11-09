import { href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, LinkButton, Section, SectionHeading } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.industries, path: "/industries" });
}

export default async function IndustriesPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const I = t.industriesPage;
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={I.eyebrow} title={I.title} intro={I.intro} image="warehouse" crumbs={[{ href: "/industries", label: I.crumb }]} />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {t.industries.map((ind, i) => (
            <article key={ind.title} data-reveal className="flex gap-6 rounded-xl border border-line p-8">
              <span className="font-display text-3xl font-extrabold text-gold-500/70">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-xl font-bold">{ind.title}</h2>
                <p className="mt-2 leading-relaxed text-slate">{ind.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading eyebrow={I.notListedEyebrow} title={I.notListedTitle} intro={I.notListedText} />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <LinkButton href={href(lang, "/quote")}>{t.common.requestQuote} <Arrow /></LinkButton>
            <LinkButton href={href(lang, "/containers")} variant="outline">{I.containerOptions}</LinkButton>
          </div>
        </div>
      </Section>
      <CtaBand lang={lang} t={t} />
      <JsonLd data={breadcrumbLd(lang, t.nav.home, [{ name: I.crumb, path: "/industries" }])} />
    </>
  );
}
