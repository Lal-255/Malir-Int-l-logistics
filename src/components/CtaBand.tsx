import { href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { Arrow, LinkButton } from "./ui";

export function CtaBand({ lang, t, title, text }: { lang: Locale; t: Dict; title?: string; text?: string }) {
  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <div data-reveal className="relative overflow-hidden rounded-2xl bg-navy-900 px-8 py-14 sm:px-14">
          <svg className="absolute -end-20 -top-10 h-[130%] opacity-20" viewBox="0 0 400 400" aria-hidden="true">
            <circle cx="200" cy="200" r="198" fill="none" stroke="#c8963e" strokeWidth="1" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="#c8963e" strokeWidth="1" />
            <circle cx="200" cy="200" r="80" fill="none" stroke="#c8963e" strokeWidth="1" />
          </svg>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold !text-white sm:text-4xl">{title ?? t.cta.title}</h2>
              <p className="mt-4 max-w-xl text-lg text-white/75">{text ?? t.cta.text}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <LinkButton href={href(lang, "/quote")}>{t.common.requestQuote} <Arrow /></LinkButton>
              <LinkButton href={href(lang, "/partner")} variant="outline-light">{t.cta.partner}</LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
