import { href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { pageMeta, breadcrumbLd, serviceLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, Check, LinkButton, Section } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.services, path: "/services" });
}

export default async function ServicesPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const S = t.servicesPage;
  const countries = Object.values(t.destinations as Record<string, { country: string }>).map((d) => d.country);
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={S.eyebrow} title={S.title} intro={S.intro} image="yard" crumbs={[{ href: "/services", label: S.crumb }]}>
        <LinkButton href={href(lang, "/quote")}>{t.common.requestQuote} <Arrow /></LinkButton>
      </PageHero>

      <div className="sticky top-[4.5rem] z-30 border-b border-line bg-white/95 backdrop-blur">
        <nav aria-label={S.crumb} className="container-x flex gap-6 overflow-x-auto py-3 text-sm font-medium text-slate [scrollbar-width:none]">
          {t.services.map((s) => <a key={s.slug} href={`#${s.slug}`} className="shrink-0 hover:text-navy-900">{s.title}</a>)}
        </nav>
      </div>

      <div className="bg-gold-100/60">
        <div className="container-x flex flex-col gap-2 py-5 text-sm text-navy-900 sm:flex-row sm:items-center">
          <strong className="font-display uppercase tracking-wider">{S.scopeStrong}</strong>
          <span className="text-slate">{S.scopeText}</span>
        </div>
      </div>

      {t.services.map((s, i) => (
        <Section key={s.slug} id={s.slug} tone={i % 2 ? "mist" : "white"}>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal>
              <span className="font-display text-sm font-bold text-gold-600" dir="ltr">{String(i + 1).padStart(2, "0")} / {String(t.services.length).padStart(2, "0")}</span>
              <h2 className="mt-3 text-3xl font-bold">{s.title}</h2>
              <p className="mt-4 text-lg font-medium text-navy-700">{s.lead}</p>
            </div>
            <div data-reveal>
              <p className="leading-relaxed text-slate">{s.body}</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {s.points.map((p) => <li key={p} className="flex gap-3 rounded-lg border border-line bg-white p-4 text-sm text-navy-900"><Check />{p}</li>)}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                {s.slug === "logistics-partner-cooperation" ? (
                  <LinkButton href={href(lang, "/partner")} variant="navy">{S.becomePartner} <Arrow /></LinkButton>
                ) : s.slug === "special-container-arrangements" ? (
                  <LinkButton href={href(lang, "/containers")} variant="navy">{S.viewContainers} <Arrow /></LinkButton>
                ) : (
                  <LinkButton href={href(lang, "/quote")} variant="navy">{S.requestQuote} <Arrow /></LinkButton>
                )}
              </div>
            </div>
          </div>
        </Section>
      ))}

      <CtaBand lang={lang} t={t} />
      <JsonLd data={[breadcrumbLd(lang, t.nav.home, [{ name: S.crumb, path: "/services" }]), ...t.services.map((s) => serviceLd(lang, s.title, s.body, countries))]} />
    </>
  );
}
