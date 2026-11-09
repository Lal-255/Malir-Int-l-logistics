import Image from "next/image";
import { containers } from "@/data/containers";
import { fmt, href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { ContainerDiagram } from "@/components/ContainerDiagram";
import { Photo } from "@/components/Photo";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, Check, LinkButton, Section, SectionHeading } from "@/components/ui";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.containers, path: "/containers" });
}

type CT = Record<string, { name: string; short: string; description: string; bestFor: string[]; specs: { label: string; value: string }[] }>;

export default async function ContainersPage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const P = t.containersPage;
  const C = t.containers as CT;
  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={P.eyebrow} title={P.title} intro={P.intro} image="stack" crumbs={[{ href: "/containers", label: P.crumb }]}>
        <LinkButton href={href(lang, "/quote")}>{t.common.requestQuote} <Arrow /></LinkButton>
      </PageHero>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <SectionHeading eyebrow={P.svsEyebrow} title={P.svsTitle} />
          <div data-reveal className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-card"><h3 className="font-bold">{P.stdTitle}</h3><p className="mt-2 text-sm text-slate">{P.stdText}</p></div>
            <div className="rounded-xl bg-white p-6 shadow-card"><h3 className="font-bold">{P.spTitle}</h3><p className="mt-2 text-sm text-slate">{P.spText}</p></div>
          </div>
        </div>
      </Section>

      {containers.map((c, i) => {
        const x = C[c.slug];
        return (
          <Section key={c.slug} id={c.slug} tone={i % 2 ? "mist" : "white"}>
            <div className="grid gap-12 lg:grid-cols-2">
              <div data-reveal>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold">{x.name}</h2>
                  {c.special && <span className="rounded bg-gold-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gold-600">{t.common.subjectToAvailability}</span>}
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate">{x.description}</p>
                <div className="relative mt-8">
                  <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                    <Image src={c.image} alt={x.name} width={800} height={600} sizes="(min-width:1024px) 40vw, 100vw" className="h-auto w-full transition-transform duration-700 hover:scale-[1.03]" />
                  </div>
                  {c.interior && (
                    <figure className="absolute -bottom-6 end-4 w-32 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lift sm:w-44">
                      <Image src={c.interior} alt={`${x.name} — ${P.interior}`} width={800} height={600} sizes="180px" className="h-auto w-full" />
                      <figcaption className="bg-navy-900 px-2 py-1 text-center text-[0.65rem] font-semibold text-white">{P.interior}</figcaption>
                    </figure>
                  )}
                </div>
                <h3 className={`${c.interior ? "mt-14" : "mt-8"} font-bold`}>{P.suitedTo}</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {x.bestFor.map((b) => <li key={b} className="flex gap-2 text-sm text-navy-900"><Check className="h-4 w-4 text-gold-500" />{b}</li>)}
                </ul>
              </div>
              <div data-reveal>
                <table className="w-full overflow-hidden rounded-xl border border-line bg-white text-sm">
                  <caption className="sr-only">{x.name}</caption>
                  <thead className="bg-navy-900 text-start text-white">
                    <tr><th scope="col" className="px-5 py-3 text-start font-semibold">{P.specCol}</th><th scope="col" className="px-5 py-3 text-start font-semibold">{P.valueCol}</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {x.specs.map((s) => (
                      <tr key={s.label}><th scope="row" className="px-5 py-3 text-start font-normal text-slate">{s.label}</th><td className="px-5 py-3 font-medium text-navy-900">{s.value}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 rounded-xl border border-line bg-white p-4" dir="ltr">
                  <ContainerDiagram kind={c.kind} length={c.length} className="mx-auto h-24 w-full" />
                </div>
                <LinkButton href={`${href(lang, "/quote")}?container=${encodeURIComponent(c.quoteOption)}`} variant="navy" className="mt-6">{fmt(P.quoteWith, { name: x.short })} <Arrow /></LinkButton>
              </div>
            </div>
          </Section>
        );
      })}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Photo name="yard" className="min-h-72 rounded-2xl" sizes="(min-width:1024px) 50vw, 100vw" />
          <div>
            <h2 className="text-2xl font-bold">{P.noteTitle}</h2>
            <p className="mt-4 leading-relaxed text-slate">{t.specFootnote}</p>
            <p className="mt-4 leading-relaxed text-slate">{P.noteText2}</p>
          </div>
        </div>
      </Section>

      <CtaBand lang={lang} t={t} />
      <JsonLd data={breadcrumbLd(lang, t.nav.home, [{ name: P.crumb, path: "/containers" }])} />
    </>
  );
}
