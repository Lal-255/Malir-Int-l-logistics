import Link from "next/link";
import { site, mailtoLink, whatsappLink } from "@/config/site";
import { destinations } from "@/data/routes";
import { href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { Logo } from "./Logo";
import { Pending } from "./ui";

export function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  const email = mailtoLink();
  const wa = whatsappLink();
  const F = t.footer;
  const D = t.destinations as Record<string, { country: string }>;
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light size="lg" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{F.blurb}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">{F.fclOnly}</p>
        </div>
        <nav aria-label={F.services} className="lg:col-span-3">
          <h2 className="text-sm font-semibold !text-white">{F.services}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {t.services.map((s) => <li key={s.slug}><Link className="hover:text-white" href={`${href(lang, "/services")}#${s.slug}`}>{s.title}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label={F.destinations} className="lg:col-span-2">
          <h2 className="text-sm font-semibold !text-white">{F.destinations}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm lg:grid-cols-1">
            {destinations.map((d) => <li key={d.slug}><Link className="hover:text-white" href={href(lang, `/routes/${d.slug}`)}>{D[d.slug].country}</Link></li>)}
          </ul>
        </nav>
        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold !text-white">{F.company}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href={href(lang, "/about")}>{F.aboutUs}</Link></li>
            <li><Link className="hover:text-white" href={href(lang, "/containers")}>{F.containerSolutions}</Link></li>
            <li><Link className="hover:text-white" href={href(lang, "/industries")}>{t.nav.industries}</Link></li>
            <li><Link className="hover:text-white" href={href(lang, "/partner")}>{t.nav.partner}</Link></li>
            <li><Link className="hover:text-white" href={href(lang, "/quote")}>{t.nav.quote}</Link></li>
            <li><Link className="hover:text-white" href={href(lang, "/contact")}>{t.nav.contact}</Link></li>
          </ul>
          <div className="mt-6 space-y-2 text-sm">
            <p>{email ? <a className="hover:text-white" href={email} dir="ltr">{site.email}</a> : <Pending light label={`${F.email} — ${t.common.pending}`} />}</p>
            <p>{wa ? <a className="hover:text-white" href={wa} target="_blank" rel="noopener noreferrer">{F.whatsapp} <span dir="ltr">+{site.whatsapp}</span></a> : <Pending light label={`${F.whatsapp} — ${t.common.pending}`} />}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. {F.rights}</p>
          <p className="text-white/50">{F.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
