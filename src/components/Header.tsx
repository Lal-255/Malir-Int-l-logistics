"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, locales, localeInfo, stripLocale, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { Logo } from "./Logo";

const items = [
  { path: "/about", key: "about" },
  { path: "/services", key: "services" },
  { path: "/routes", key: "routes" },
  { path: "/containers", key: "containers" },
  { path: "/industries", key: "industries" },
  { path: "/partner", key: "partner" },
  { path: "/contact", key: "contact" },
] as const;

function LangSwitcher({ lang, path, overlay, label }: { lang: Locale; path: string; overlay: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  return (
    <div ref={ref} className="relative" data-lang-switcher>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        data-lang-toggle
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-10 items-center gap-1.5 rounded-md border px-3 text-sm font-semibold transition ${overlay ? "border-white/30 text-white hover:bg-white/10" : "border-navy-900/15 text-navy-900 hover:border-navy-900/40"}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></svg>
        {localeInfo[lang].label}
      </button>
      <ul data-lang-menu hidden={!open} className="absolute end-0 top-12 z-50 w-40 overflow-hidden rounded-lg bg-white py-1 text-sm shadow-lift ring-1 ring-black/5">
        {locales.map((l) => (
          <li key={l}>
            <a
              href={href(l, path)}
              hrefLang={localeInfo[l].htmlLang}
              lang={localeInfo[l].htmlLang}
              dir={localeInfo[l].dir}
              aria-current={l === lang ? "true" : undefined}
              className={`block px-4 py-2.5 text-start hover:bg-mist ${l === lang ? "font-bold text-gold-600" : "text-navy-900"}`}
            >
              {localeInfo[l].label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Header({ lang, nav }: { lang: Locale; nav: Dict["nav"] }) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlay = !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (p: string) => path === p || path.startsWith(`${p}/`);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300 ${overlay ? "bg-gradient-to-b from-navy-950/70 to-transparent" : "bg-white/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-navy-900">{nav.skip}</a>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link href={href(lang, "/")} aria-label={`Malir Int’l Logistics — ${nav.home}`} className="shrink-0">
          <Logo light={overlay} />
        </Link>

        <nav aria-label={nav.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.path}>
                <Link
                  href={href(lang, item.path)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`relative rounded px-3 py-2 text-[0.84rem] font-medium transition-colors ${overlay ? "text-white/85 hover:text-white" : "text-navy-900/75 hover:text-navy-900"} ${isActive(item.path) ? (overlay ? "!text-white" : "!text-navy-900") : ""} ${item.path === "/partner" ? (overlay ? "!text-gold-400" : "!text-gold-600") : ""}`}
                >
                  {nav[item.key]}
                  {isActive(item.path) && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-gold-500" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitcher lang={lang} path={path} overlay={overlay} label={nav.language} />
          <Link href={href(lang, "/quote")} className="hidden rounded-md bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 sm:inline-flex">{nav.quote}</Link>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md xl:hidden ${overlay ? "text-white" : "text-navy-900"}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-white xl:hidden">
        <nav aria-label={nav.mobileNav} className="container-x py-6">
          <ul className="divide-y divide-line">
            <li><Link href={href(lang, "/")} className="block py-4 text-lg font-semibold text-navy-900">{nav.home}</Link></li>
            {items.map((item) => (
              <li key={item.path}>
                <Link href={href(lang, item.path)} aria-current={isActive(item.path) ? "page" : undefined} className={`block py-4 text-lg font-semibold ${item.path === "/partner" ? "text-gold-600" : "text-navy-900"}`}>{nav[item.key]}</Link>
              </li>
            ))}
          </ul>
          <Link href={href(lang, "/quote")} className="mt-6 flex w-full items-center justify-center rounded-md bg-gold-500 px-5 py-3.5 font-semibold text-navy-950">{nav.quoteLong}</Link>
        </nav>
      </div>
    </header>
  );
}
