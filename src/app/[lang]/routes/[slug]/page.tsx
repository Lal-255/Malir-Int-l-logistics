import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, getDestination, originPorts } from "@/data/routes";
import { containers } from "@/data/containers";
import { fmt, href, locales } from "@/i18n/config";
import { resolve } from "@/i18n/page";
import { pageMeta, breadcrumbLd, serviceLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { RouteMap } from "@/components/RouteMap";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, Check, LinkButton, Section, SectionHeading } from "@/components/ui";

type P = { params: Promise<{ lang: string; slug: string }> };
type DD = Record<string, { country: string; summary: string; body: string[]; cargoFocus: string[]; ports: Record<string, { name: string; note: string }> }>;

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((lang) => destinations.map((d) => ({ lang, slug: d.slug })));
}

export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const { lang, t } = await resolve(params);
  const d = getDestination(slug);
  if (!d) return {};
  const dd = (t.destinations as DD)[slug];
  const ports = d.ports.map((p) => dd.ports[p.slug].name.split(/[,،]/)[0]).join(", ");
  return pageMeta({ lang, title: fmt(t.meta.dest.title, { country: dd.country }), description: fmt(t.meta.dest.description, { country: dd.country, ports }), path: `/routes/${slug}` });
}

export default async function DestinationPage({ params }: P) {
  const { slug } = await params;
  const { lang, t } = await resolve(params);
  const d = getDestination(slug);
  if (!d) notFound();
  const DP = t.destPage;
  const all = t.destinations as DD;
  const dd = all[slug];
  const country = dd.country;
  const O = t.originPorts as Record<string, { name: string }>;
  const C = t.containers as Record<string, { name: string }>;
  const others = destinations.filter((x) => x.slug !== slug);
  return (
    <>
      <PageHero
        lang={lang}
        t={t}
        eyebrow={d.region === "gulf" ? DP.eyebrowGulf : DP.eyebrowRedsea}
        title={fmt(DP.title, { country })}
        intro={dd.summary}
        image={d.region === "gulf" ? "harbor" : "vessel"}
        crumbs={[{ href: "/routes", label: DP.crumbRoutes }, { href: `/routes/${slug}`, label: country }]}
      >
        <LinkButton href={`${href(lang, "/quote")}?destination=${d.ports[0].slug}`}>{fmt(DP.quoteTo, { country })} <Arrow /></LinkButton>
        <LinkButton href={href(lang, "/partner")} variant="outline-light">{DP.forwarder}</LinkButton>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading eyebrow={DP.overviewEyebrow} title={fmt(DP.overviewTitle, { country })} />
            <div data-reveal className="prose-copy mt-6">
              {dd.body.map((p) => <p key={p}>{p}</p>)}
              <p>{fmt(DP.loadPorts, { ports: originPorts.slice(0, 5).map((o) => O[o.slug].name.split(" (")[0].split("（")[0]).join(lang === "zh" ? "、" : lang === "en" ? ", " : "، ") })}</p>
            </div>
          </div>
          <div data-reveal><RouteMap lang={lang} t={t} highlight={slug} /></div>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading eyebrow={DP.portsEyebrow} title={fmt(DP.portsTitle, { country })} intro={DP.portsIntro} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {d.ports.map((p) => (
            <article key={p.slug} data-reveal className="rounded-xl border border-line bg-white p-7 shadow-card">
              <p className="font-mono text-xs text-slate" dir="ltr">{p.locode}</p>
              <h3 className="mt-2 text-xl font-bold">{dd.ports[p.slug].name}</h3>
              <p className="mt-2 text-sm text-slate">{dd.ports[p.slug].note}</p>
              <Link href={`${href(lang, "/quote")}?destination=${p.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ocean-600 hover:text-navy-900">{fmt(DP.quotePort, { port: dd.ports[p.slug].name.split(/[,،]/)[0] })} <Arrow /></Link>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">{DP.containersTitle}</h2>
            <p className="mt-3 text-slate">{fmt(DP.containersText, { country })}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {containers.map((c) => (
                <li key={c.slug}><Link href={`${href(lang, "/containers")}#${c.slug}`} className="flex gap-3 rounded-lg border border-line p-4 text-sm font-medium text-navy-900 hover:border-navy-900"><Check />{C[c.slug].name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{DP.cargoTitle}</h2>
            <p className="mt-3 text-slate">{fmt(DP.cargoText, { country })}</p>
            <ul className="mt-6 space-y-3">
              {dd.cargoFocus.map((c) => <li key={c} className="flex gap-3 text-navy-900"><Check />{c}</li>)}
            </ul>
            <p className="mt-6 text-sm text-slate">{fmt(DP.cargoNote, { country })}</p>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading eyebrow={DP.processEyebrow} title={fmt(DP.processTitle, { country })} />
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {t.process.map((s, i) => (
            <li key={s.title} data-reveal className="rounded-xl bg-white p-6 shadow-card">
              <span className="font-display text-sm font-bold text-gold-600">{fmt(DP.step, { n: i + 1 })}</span>
              <h3 className="mt-2 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="text-xl font-bold">{DP.others}</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}><Link href={href(lang, `/routes/${o.slug}`)} className="inline-block rounded-full border border-line px-4 py-2 text-sm font-medium text-navy-900 hover:border-navy-900">{fmt(t.routesPage.chinaTo, { country: all[o.slug].country })}</Link></li>
          ))}
        </ul>
      </Section>

      <CtaBand lang={lang} t={t} title={fmt(DP.ctaTitle, { country })} text={fmt(DP.ctaText, { country })} />
      <JsonLd data={[breadcrumbLd(lang, t.nav.home, [{ name: DP.crumbRoutes, path: "/routes" }, { name: country, path: `/routes/${slug}` }]), serviceLd(lang, fmt(DP.title, { country }), dd.summary, [country])]} />
    </>
  );
}
