import Link from "next/link";
import { containers } from "@/data/containers";
import { allDestinationPorts, destinations, originPorts } from "@/data/routes";
import { href } from "@/i18n/config";
import { resolve, type LangParams } from "@/i18n/page";
import { pageMeta } from "@/lib/seo";
import { Photo } from "@/components/Photo";
import { RouteMap } from "@/components/RouteMap";
import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { Arrow, LinkButton } from "@/components/ui";
import type { ImageKey } from "@/data/images";

export async function generateMetadata({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, title: t.meta.home.title, description: t.meta.home.description, path: "/", absoluteTitle: true });
}

const lanes: [string, string, string][] = [
  ["shanghai", "uae", "jebel-ali"], ["ningbo", "saudi-arabia", "jeddah"], ["shenzhen", "saudi-arabia", "dammam"], ["qingdao", "iraq", "umm-qasr"],
  ["guangzhou", "qatar", "hamad-port"], ["tianjin", "oman", "sohar"], ["xiamen", "jordan", "aqaba"], ["shanghai", "egypt", "ain-sokhna"],
  ["ningbo", "kuwait", "shuwaikh"], ["shenzhen", "sudan", "port-sudan"], ["qingdao", "yemen", "aden"],
];

const tiles: { path: string; img: ImageKey; key: "fcl" | "import" | "export" | "special" | "forwarding"; cls: string }[] = [
  { path: "/services#fcl-ocean-freight", img: "vessel", key: "fcl", cls: "md:col-span-2 md:row-span-2 min-h-[22rem] md:min-h-[36rem]" },
  { path: "/services#middle-east-import-shipping", img: "harbor", key: "import", cls: "min-h-[17rem]" },
  { path: "/services#china-export-shipping", img: "warehouse", key: "export", cls: "min-h-[17rem]" },
  { path: "/services#special-container-arrangements", img: "stack", key: "special", cls: "min-h-[17rem]" },
  { path: "/services#international-freight-forwarding", img: "yard", key: "forwarding", cls: "min-h-[17rem]" },
];

export default async function HomePage({ params }: LangParams) {
  const { lang, t } = await resolve(params);
  const H = t.home;
  const D = t.destinations as Record<string, { country: string; ports: Record<string, { name: string }> }>;
  const O = t.originPorts as Record<string, { name: string }>;
  const C = t.containers as Record<string, { short: string }>;
  const L = (p: string) => href(lang, p);
  const short = (n: string) => n.split(" (")[0].split("（")[0];
  const sp = lang === "zh" ? "" : " ";
  return (
    <>
      {/* HERO — full-screen crossfading photography */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950 text-white">
        <div className="absolute inset-0 -z-20">
          {(["hero", "harbor", "terminal"] as const).map((k, i) => (
            <div key={k} className="slide absolute inset-0">
              <Photo name={k} priority={i === 0} className="h-full w-full" imgClassName="kenburns" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10 rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy-950 to-transparent" />

        <div className="container-x pb-24 pt-32">
          <p className="rise rise-1 eyebrow eyebrow-light">{H.eyebrow}</p>
          <h1 className="mt-6 font-display text-[clamp(2.25rem,5.6vw,5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em] !text-white">
            <span className="rise rise-2 block">{H.h1a}</span>
            <span className="rise rise-3 block">{H.h1b}{sp}{H.h1with && <span className="text-outline text-gold-400">{H.h1with}</span>}</span>
            <span className="rise rise-4 block text-gold-400">{H.h1c}</span>
          </h1>
          <div className="rise rise-5 mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <LinkButton href={L("/quote")} className="px-7 py-3.5">{t.common.requestQuote} <Arrow /></LinkButton>
            <p className="max-w-sm text-base leading-relaxed text-white/75">{H.sub}</p>
          </div>
        </div>

        <a href="#marquee" aria-label={H.scroll} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-white/60 sm:flex">
          {H.scroll}
          <span className="flex h-10 w-6 justify-center rounded-full border border-white/40 pt-2"><span className="scroll-cue h-2 w-1 rounded-full bg-gold-400" /></span>
        </a>
      </section>

      {/* LANE MARQUEE */}
      <div id="marquee" className="marquee overflow-hidden border-y border-white/10 bg-navy-950 py-5 text-white" aria-label={H.lanesLabel} dir="ltr">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
          {[...lanes, ...lanes].map(([o, c, p], i) => (
            <span key={i} className="flex items-center gap-4 font-display text-base font-bold uppercase tracking-wider sm:text-lg" aria-hidden={i >= lanes.length}>
              {short(O[o].name)}
              <svg viewBox="0 0 40 12" className="h-3 w-10 text-gold-400" aria-hidden="true"><path d="M0 6h36m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              <span className="text-gold-400">{short(D[c].ports[p].name).split(/[,،]/)[0]}</span>
              <span className="ml-8 h-1.5 w-1.5 rounded-full bg-white/30" />
            </span>
          ))}
        </div>
      </div>

      {/* STATEMENT + STATS */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <p data-reveal className="eyebrow">{H.whoEyebrow}</p>
          <h2 data-reveal className="mt-6 max-w-5xl font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {H.statementA}{sp}<span className="text-gold-500">{H.statementB}</span>{sp}{H.statementC}
          </h2>
          <div className="mt-16 grid gap-10 border-t border-line pt-12 sm:grid-cols-3">
            {[
              [originPorts.length, H.statGateways],
              [allDestinationPorts.length, H.statPorts],
              [destinations.length, H.statMarkets],
            ].map(([n, label]) => (
              <div key={label as string} data-reveal>
                <p className="font-display text-5xl font-extrabold tracking-tight text-navy-900 sm:text-6xl"><CountUp to={n as number} /></p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate">{label}</p>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-12">
            <Link href={L("/about")} className="inline-flex items-center gap-2 font-semibold text-navy-900 underline-offset-8 hover:underline">{H.moreAbout} <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* SERVICES — photo bento */}
      <section className="bg-navy-950 py-24 text-white sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 data-reveal className="max-w-2xl font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] !text-white">
              {H.moveA}{sp}<span className="text-gold-400">{H.moveB}</span>
            </h2>
            <LinkButton href={L("/services")} variant="outline-light" className="shrink-0">{t.common.allServices} <Arrow /></LinkButton>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4 md:grid-rows-2">
            {tiles.map((tile) => (
              <Link key={tile.path} href={L(tile.path)} data-reveal className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl p-7 ${tile.cls}`}>
                <Photo name={tile.img} className="!absolute inset-0 -z-20" imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-110" sizes="(min-width:768px) 50vw, 100vw" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/10 transition-colors group-hover:via-navy-950/70" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{H.tiles[tile.key].kicker}</p>
                <h3 className="mt-2 font-display text-xl font-extrabold !text-white sm:text-2xl">{H.tiles[tile.key].title}</h3>
                <span className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-navy-950">
                  <Arrow className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/50">{t.common.fclOnlyNote}</p>
        </div>
      </section>

      {/* MAP — full bleed */}
      <section className="relative bg-navy-950 pb-24 text-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-20 md:flex-row md:items-end">
            <h2 data-reveal className="max-w-3xl font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] !text-white">
              {H.mapA}{sp}<span className="block text-gold-400">{H.mapB}</span>
            </h2>
            <LinkButton href={L("/routes")} variant="outline-light" className="shrink-0">{H.routesBtn} <Arrow /></LinkButton>
          </div>
          <div data-reveal className="mt-12"><RouteMap lang={lang} t={t} /></div>
        </div>
      </section>

      {/* DESTINATIONS — big typographic list */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <p data-reveal className="eyebrow">{H.destEyebrow}</p>
          <ul className="mt-8 border-t border-navy-900">
            {destinations.map((d, i) => (
              <li key={d.slug} className="border-b border-line">
                <Link href={L(`/routes/${d.slug}`)} className="group flex items-center gap-5 py-3.5 transition-colors hover:bg-navy-950 sm:py-4">
                  <span className="w-10 shrink-0 pl-2 font-display text-xs font-bold text-gold-600 transition-colors group-hover:text-gold-400 sm:pl-4">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 font-display text-[clamp(1rem,1.5vw,1.3rem)] font-extrabold uppercase leading-none tracking-[-0.02em] text-navy-900 transition-all group-hover:translate-x-3 rtl:group-hover:-translate-x-3 group-hover:text-white">
                    {D[d.slug].country}
                  </span>
                  <span className="hidden text-right text-xs text-slate transition-colors group-hover:text-white/70 md:block">{d.ports.map((p) => D[d.slug].ports[p.slug].name.split(/[,،]/)[0]).join(" · ")}</span>
                  <span className="mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-900/20 text-navy-900 transition group-hover:border-gold-400 group-hover:bg-gold-400 group-hover:text-navy-950 sm:mr-4">
                    <Arrow className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate">{t.common.routeNote}</p>
        </div>
      </section>

      {/* CONTAINERS — horizontal strip */}
      <section className="overflow-hidden bg-mist py-24 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 data-reveal className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
              {H.boxA}{sp}<span className="text-gold-500">{H.boxB}</span>
            </h2>
            <LinkButton href={L("/containers")} variant="outline" className="shrink-0">{H.specsBtn} <Arrow /></LinkButton>
          </div>
        </div>
        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [scrollbar-width:thin]">
          {containers.map((c) => (
            <Link key={c.slug} href={`${L("/containers")}#${c.slug}`} className="group w-[19rem] shrink-0 snap-start rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <div className="-mx-6 -mt-6 overflow-hidden rounded-t-2xl bg-white"><Image src={c.image} alt={C[c.slug].short} width={800} height={600} sizes="304px" className="h-auto w-full transition-transform duration-700 group-hover:scale-105" /></div>
              <h3 className="mt-5 font-display text-xl font-extrabold">{C[c.slug].short}</h3>
              <p className="mt-1 text-sm text-slate">{c.special ? t.common.subjectToAvailability : t.common.standardEquipment}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <h2 data-reveal className="font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">
            {H.stepsA}{sp}<span className="text-gold-500">{H.stepsB}</span>
          </h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-4">
            {t.process.map((s, i) => (
              <li key={s.title} data-reveal className="bg-white p-8">
                <span className="font-display text-4xl font-extrabold text-gold-500/80">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PARTNER — full bleed */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-32 text-white sm:py-40">
        <Photo name="cranes" className="!absolute inset-0 -z-20" imgClassName="kenburns" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/50 to-transparent rtl:bg-gradient-to-l" />
        <div className="container-x">
          <p data-reveal className="eyebrow eyebrow-light">{H.partnerEyebrow}</p>
          <h2 data-reveal className="mt-6 max-w-4xl font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] !text-white">
            {H.partnerA}{sp}<span className="text-gold-400">{H.partnerB}</span>
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lg text-white/80">{H.partnerText}</p>
          <div data-reveal className="mt-10"><LinkButton href={`${L("/partner")}#partner-form`} className="px-7 py-3.5">{H.partnerBtn} <Arrow /></LinkButton></div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gold-500 py-20 text-navy-950">
        <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em]">{H.finalA}<br />{H.finalB}</h2>
          <LinkButton href={L("/quote")} variant="navy" className="px-7 py-3.5">{t.common.requestQuote} <Arrow /></LinkButton>
        </div>
      </section>
    </>
  );
}
