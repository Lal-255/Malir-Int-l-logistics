import Link from "next/link";
import type { ReactNode } from "react";
import type { ImageKey } from "@/data/images";
import { href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { Photo } from "./Photo";

export function PageHero({ lang, t, eyebrow, title, intro, image = "harbor", crumbs, children }: { lang: Locale; t: Dict; eyebrow: string; title: ReactNode; intro?: ReactNode; image?: ImageKey; crumbs: { href: string; label: string }[]; children?: ReactNode }) {
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-navy-950 pt-[4.5rem] text-white">
      <Photo name={image} priority className="!absolute inset-0 -z-20" imgClassName="kenburns" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10 rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-950/90 to-transparent" />
      <div className="container-x w-full pb-16 pt-24 sm:pb-20">
        <nav aria-label={t.common.breadcrumb} className="text-xs text-white/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={href(lang, "/")} className="hover:text-white">{t.nav.home}</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {i === crumbs.length - 1 ? <span aria-current="page" className="text-white/90">{c.label}</span> : <Link href={href(lang, c.href)} className="hover:text-white">{c.label}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        <p className="rise rise-1 eyebrow eyebrow-light mt-8">{eyebrow}</p>
        <h1 className="rise rise-2 mt-5 max-w-5xl font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] !text-white">{title}</h1>
        {intro && <p className="rise rise-3 mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>}
        {children && <div className="rise rise-4 mt-9 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
