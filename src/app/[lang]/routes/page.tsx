import Link from "next/link";
import { destinations, originPorts } from "@/data/routes";
import { fmt, href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { RouteMap } from "@/components/RouteMap";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, LinkButton, Section, SectionHeading } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.routes, path: "/routes" });
}

export default async function RoutesPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const R = t.routesPage;
  const D = t.destinations as Record<string, { country: string; summary: string; ports: Record<string, { name: string }> }>;
  const O = t.originPorts as Record<string, { name: string; province: string }>;
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={R.eyebrow} title={R.title} intro={R.intro} image="vessel" crumbs={[{ href: "/routes", label: R.crumb }]}>
        <LinkButton href={href(lang, "/quote")}>{t.common.requestQuote} <Arrow /></LinkButton>
      </PageHero>

      <Section>
        <RouteMap lang={lang} t={t} />
        <p className="mt-5 max-w-3xl text-sm text-slate">{R.mapNote}</p>
      </Section>

      <Section tone="mist">
        <SectionHeading eyebrow={R.originEyebrow} title={R.originTitle} intro={R.originIntro} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {originPorts.map((o) => (
            <li key={o.slug} data-reveal className="rounded-xl border border-line bg-white p-5">
              <p className="font-display text-lg font-bold text-navy-900">{O[o.slug].name}</p>
              <p className="mt-1 text-sm text-slate">{O[o.slug].province} · <span className="font-mono text-xs" dir="ltr">{o.locode}</span></p>
            </li>
          ))}
        </ul>
      </Section>

      {(["gulf", "redsea"] as const).map((r) => (
        <Section key={r} tone={r === "gulf" ? "white" : "mist"} id={r}>
          <SectionHeading eyebrow={R.destEyebrow} title={r === "gulf" ? R.regionGulf : R.regionRedsea} />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {destinations.filter((d) => d.region === r).map((d) => (
              <article key={d.slug} data-reveal className="flex flex-col rounded-xl border border-line bg-white p-7 shadow-card">
                <h3 className="text-2xl font-bold">{fmt(R.chinaTo, { country: D[d.slug].country })}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{D[d.slug].summary}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                  {d.ports.map((p) => (
                    <li key={p.slug} className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-navy-900">{D[d.slug].ports[p.slug].name}</span>
                      <span className="font-mono text-xs text-slate" dir="ltr">{p.locode}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm font-semibold">
                  <Link href={href(lang, `/routes/${d.slug}`)} className="inline-flex items-center gap-2 text-ocean-600 hover:text-navy-900">{R.details} <Arrow /></Link>
                  <Link href={`${href(lang, "/quote")}?destination=${d.ports[0].slug}`} className="text-gold-600 hover:text-navy-900">{R.getQuote}</Link>
                </div>
              </article>
            ))}
          </div>
        </Section>
      ))}

      <CtaBand lang={lang} t={t} />
      <JsonLd data={breadcrumbLd(lang, t.nav.home, [{ name: R.crumb, path: "/routes" }])} />
    </>
  );
}
