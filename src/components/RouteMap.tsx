import Link from "next/link";
import map from "@/data/map.generated.json";
import { allDestinationPorts, destinations, originPorts } from "@/data/routes";
import { fmt, href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";

type Pt = [number, number];
const P = map.points as unknown as Record<string, Pt>;
const L = map.lanes as Record<"trunk" | "gulf" | "redsea", string>;

/** Join the trunk lane with a branch so a ship can sail the whole route. */
const join = (a: string, b: string) => `${a} ${b.replace(/^M[^C]*/, "")}`;
const toGulf = join(L.trunk, L.gulf);
const toRedSea = join(L.trunk, L.redsea);

/** Hubs that always show a label (others appear on hover / focus). */
const hubLabels: Record<string, "l" | "r" | "t" | "b"> = {
  shanghai: "l", shenzhen: "b", qingdao: "l",
  "jebel-ali": "b", jeddah: "l", "umm-qasr": "t", aden: "b", "ain-sokhna": "t",
};

/**
 * Animated regional route map (Natural Earth data, Mercator).
 * Sea lanes are indicative of the corridor only, not a specific carrier service.
 */
export function RouteMap({ lang, t, highlight, className = "" }: { lang: Locale; t: Dict; highlight?: string; className?: string }) {
  const M = t.map;
  const D = t.destinations as Record<string, { country: string; ports: Record<string, { name: string }> }>;
  const O = t.originPorts as Record<string, { name: string }>;
  const portName = (c: string, p: string) => D[c].ports[p].name;
  const rtl = lang === "ar" || lang === "fa";
  /** Approximate label width at 17px: CJK glyphs are roughly full-width. */
  const textW = (str: string) => [...str].reduce((w, ch) => w + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 17.5 : 10.4), 0) + 28;
  const origins = originPorts.filter((o) => P[o.slug]);
  const dests = allDestinationPorts.filter((d) => P[d.slug]);
  const lbl = (k: string) => P[`lbl-${k}`];
  const hl = dests.filter((d) => d.countrySlug === highlight).sort((a, b) => P[a.slug][1] - P[b.slug][1]);
  const labelY: Record<string, number> = {};
  let lastY = -Infinity;
  for (const d of hl) { const y = Math.max(P[d.slug][1], lastY + 40); labelY[d.slug] = y; lastY = y; }

  const hubText = (key: string, name: string, color: string) => {
    const [x, y] = P[key];
    const pos = hubLabels[key];
    const o = { l: [-12, 5, "end"], r: [12, 5, "start"], t: [0, -14, "middle"], b: [0, 24, "middle"] }[pos] as [number, number, "start" | "end" | "middle"];
    return (
      <text x={x + o[0]} y={y + o[1]} textAnchor={o[2]} fontSize="15" fontWeight="700" fill={color} fontFamily="var(--font-sans)" paintOrder="stroke" stroke="#061224" strokeWidth="4" strokeLinejoin="round" className="pointer-events-none">
        {name}
      </text>
    );
  };

  return (
    <figure dir="ltr" className={`relative overflow-hidden rounded-2xl bg-navy-950 shadow-lift ring-1 ring-white/10 ${className}`}>
      <svg viewBox={`0 0 ${map.width} ${map.height}`} className="block h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">{M.title}</title>
        <desc id="map-desc">{M.desc}</desc>
        <defs>
          <radialGradient id="sea" cx="50%" cy="70%" r="80%">
            <stop offset="0" stopColor="#0f2a4d" />
            <stop offset="1" stopColor="#061224" />
          </radialGradient>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#132f52" />
            <stop offset="1" stopColor="#122b4b" />
          </linearGradient>
          <linearGradient id="destLand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f4f82" />
            <stop offset="1" stopColor="#1c4372" />
          </linearGradient>
          <linearGradient id="chinaLand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2d659e" />
            <stop offset="1" stopColor="#24507f" />
          </linearGradient>
          <linearGradient id="lane" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor="#c8963e" />
            <stop offset="1" stopColor="#d8ad5f" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <path id="ship-to-gulf" d={toGulf} />
          <path id="ship-to-redsea" d={toRedSea} />
          {/* Container ship icon, pointing along +x */}
          <g id="ship">
            <path d="M-22,-7 L16,-7 L26,0 L16,7 L-22,7 Z" fill="#ffffff" />
            <rect x="-18" y="-5" width="6" height="10" fill="#c8963e" />
            <rect x="-11" y="-5" width="6" height="10" fill="#2d659e" />
            <rect x="-4" y="-5" width="6" height="10" fill="#d8ad5f" />
            <rect x="3" y="-5" width="6" height="10" fill="#1f6fb2" />
            <rect x="-24" y="-4" width="4" height="8" fill="#0a1c36" />
          </g>
        </defs>

        <rect width={map.width} height={map.height} fill="url(#sea)" />
        {/* nautical graticule */}
        <g fill="none" stroke="#8fb3dc" strokeOpacity=".07" strokeWidth="1" strokeDasharray="2 6">
          {map.graticule.map((d, i) => <path key={i} d={d} />)}
        </g>

        <g fill="url(#land)" stroke="#2a527c" strokeWidth=".6">
          {map.land.map((d, i) => <path key={i} d={d} />)}
        </g>
        {/* destination markets & China with glow */}
        <g fill="url(#destLand)" stroke="#2c5a8e" strokeWidth=".7">
          {map.dest.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="url(#chinaLand)" stroke="#3a6aa0" strokeWidth=".7">
          {map.china.map((d, i) => <path key={i} d={d} />)}
        </g>

        {/* region labels */}
        <g fontFamily="var(--font-display)" fontWeight="800" textAnchor="middle" className="pointer-events-none">
          <text x={lbl("china")[0]} y={lbl("china")[1]} fontSize="34" letterSpacing="12" fill="#ffffff" opacity=".9">{M.china}</text>
          <text x={lbl("china")[0]} y={lbl("china")[1] + 24} fontSize="12" letterSpacing="5" fill="#d8ad5f" opacity=".9">{M.origin}</text>
          <text x={lbl("arabia")[0]} y={lbl("arabia")[1]} fontSize="15" letterSpacing="6" fill="#ffffff" opacity=".85">{M.middleEast}</text>
          <text x={lbl("arabia")[0]} y={lbl("arabia")[1] + 20} fontSize="11" letterSpacing="4" fill="#d8ad5f" opacity=".9">{M.destination}</text>
        </g>
        <g fill="#8fb3dc" fontFamily="var(--font-sans)" fontStyle="italic" opacity=".75" textAnchor="middle" fontSize="14" letterSpacing="3" className="pointer-events-none">
          <text x={lbl("arabian-sea")[0]} y={lbl("arabian-sea")[1]}>{M.arabianSea}</text>
          <text x={lbl("indian-ocean")[0]} y={lbl("indian-ocean")[1]} fontSize="18" letterSpacing="8">{M.indianOcean}</text>
          <text x={lbl("scs")[0]} y={lbl("scs")[1]}>{M.southChinaSea}</text>
          <text x={lbl("red-sea")[0]} y={lbl("red-sea")[1]} transform={`rotate(58 ${lbl("red-sea")[0]} ${lbl("red-sea")[1]})`}>{M.redSea}</text>
        </g>

        {/* sea lanes: glow + gradient line + flowing dashes */}
        <g fill="none" strokeLinecap="round">
          {Object.values(L).map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#c8963e" strokeOpacity=".2" strokeWidth="8" />
              <path d={d} stroke="url(#lane)" strokeWidth="3" className="route-draw" />
              <path d={d} stroke="#ffffff" strokeWidth="2.2" strokeDasharray="1 18" className="lane-flow" />
            </g>
          ))}
        </g>

        {/* strait chokepoints */}
        {[
          ["malacca", M.malacca, 0, 34],
          ["hormuz", M.hormuz, 0, -16],
          ["bab", M.bab, 0, 30],
        ].map(([k, name, dx, dy]) => {
          const [x, y] = lbl(k as string);
          return (
            <g key={k as string} className="pointer-events-none">
              <circle cx={x} cy={y} r="9" fill="none" stroke="#d8ad5f" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x={x + (dx as number)} y={y + (dy as number)} textAnchor="middle" fontSize="12" fontWeight="600" fill="#d8ad5f" fontFamily="var(--font-sans)" letterSpacing="1" paintOrder="stroke" stroke="#061224" strokeWidth="4">{name}</text>
            </g>
          );
        })}

        {/* animated ships */}
        <g className="ship-motion">
          <use href="#ship">
            <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" calcMode="linear">
              <mpath href="#ship-to-gulf" />
            </animateMotion>
          </use>
          <use href="#ship">
            <animateMotion dur="18s" begin="-7s" repeatCount="indefinite" rotate="auto" calcMode="linear">
              <mpath href="#ship-to-redsea" />
            </animateMotion>
          </use>
          <use href="#ship">
            <animateMotion dur="16s" begin="-11s" repeatCount="indefinite" rotate="auto" calcMode="linear">
              <mpath href="#ship-to-gulf" />
            </animateMotion>
          </use>
        </g>

        {/* origin ports */}
        {origins.map((o) => {
          const [x, y] = P[o.slug];
          const name = O[o.slug].name.split(" (")[0].split("（")[0];
          const w = textW(name);
          return (
            <g key={o.slug} className="group" tabIndex={0} aria-label={fmt(M.originPortAria, { port: O[o.slug].name })}>
              <circle cx={x} cy={y} r="7" fill="#c8963e" className="pulse-ring" />
              <circle cx={x} cy={y} r="6.5" fill="#d8ad5f" stroke="#061224" strokeWidth="2" />
              {hubLabels[o.slug] && hubText(o.slug, name, "#ffffff")}
              {!hubLabels[o.slug] && (
                <g className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                  <rect x={x - 14 - w} y={y - 17} width={w} height="34" rx="17" fill="#061224" stroke="#c8963e" strokeOpacity=".7" />
                  <text x={x - 14 - w / 2} y={y + 6} fill="#fff" fontSize="17" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">{name}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* destination ports */}
        {dests.map((d) => {
          const [x, y] = P[d.slug];
          const active = !highlight || highlight === d.countrySlug;
          const pname = portName(d.countrySlug, d.slug);
          const label = highlight ? pname : `${pname} · ${D[d.countrySlug].country}`;
          const w = textW(label);
          const ly = labelY[d.slug] ?? y;
          const short = pname.split(/[,،]/)[0].replace(" Islamic Port", "");
          return (
            <Link key={d.slug} href={href(lang, `/routes/${d.countrySlug}`)} className="group outline-none" aria-label={fmt(M.destAria, { port: pname, country: D[d.countrySlug].country })}>
              <circle cx={x} cy={y} r="14" fill="transparent" />
              {active && <circle cx={x} cy={y} r="6" fill="#c8963e" className="pulse-ring" />}
              <circle cx={x} cy={y} r={active ? 6 : 4} fill={active ? "#ffffff" : "#6c8db5"} stroke="#c8963e" strokeWidth={active ? 3 : 1.5} className="transition-all group-hover:fill-[#d8ad5f] group-focus:fill-[#d8ad5f]" />
              {!highlight && hubLabels[d.slug] && hubText(d.slug, short, "#ffffff")}
              <g className={`pointer-events-none transition-opacity ${highlight === d.countrySlug ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"}`}>
                {ly !== y && <line x1={x} y1={y} x2={x + 14} y2={ly} stroke="#c8963e" strokeOpacity=".7" />}
                <rect x={x + 14} y={ly - 17} width={w} height="34" rx="17" fill="#061224" stroke="#c8963e" strokeOpacity=".7" />
                <text x={x + 14 + w / 2} y={ly + 6} fill="#fff" fontSize="17" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">{label}</text>
              </g>
            </Link>
          );
        })}

        {/* compass rose */}
        <g transform={`translate(${map.width - 70} ${map.height - 80})`} className="pointer-events-none" opacity=".85">
          <circle r="34" fill="#061224" fillOpacity=".55" stroke="#c8963e" strokeOpacity=".5" />
          <path d="M0,-28 L6,0 L0,28 L-6,0 Z" fill="#c8963e" />
          <path d="M-28,0 L0,-5 L28,0 L0,5 Z" fill="#8fb3dc" opacity=".7" />
          <text y="-38" textAnchor="middle" fontSize="12" fontWeight="800" fill="#d8ad5f" fontFamily="var(--font-display)">N</text>
        </g>
      </svg>

      {/* overlay chips */}
      <div dir={rtl ? "rtl" : "ltr"} className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 sm:left-5 sm:top-5">
        <span className="rounded-full bg-navy-900/90 ring-1 ring-gold-500/50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow sm:text-xs">{fmt(M.chipGateways, { n: originPorts.length })}</span>
        <span className="rounded-full bg-navy-900/90 ring-1 ring-gold-500/50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow sm:text-xs">{fmt(M.chipPorts, { n: allDestinationPorts.length })}</span>
        <span className="hidden rounded-full bg-navy-900/90 ring-1 ring-gold-500/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow sm:inline">{fmt(M.chipMarkets, { n: destinations.length })}</span>
      </div>

      <figcaption dir={rtl ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 px-5 py-3 text-xs text-white/70">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold-400" /> {M.legendOrigin}</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border-2 border-gold-500 bg-white" /> {M.legendDest}</span>
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded bg-gradient-to-r from-gold-500 to-gold-400" /> {M.legendLanes}</span>
        <span className="ms-auto">{M.note}</span>
      </figcaption>
    </figure>
  );
}
