"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/config/site";
import { href, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/en";


const WaIcon = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.2c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.5 9.9 10.2 5.3 16 5.3s10.5 4.6 10.5 10.4S21.8 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.8 1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.7 5 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.7-.4Z" />
  </svg>
);

/**
 * Floating WhatsApp button with a chat pop-up. A short greeting bubble
 * appears once per visit after a few seconds. Until a verified number is
 * configured (NEXT_PUBLIC_WHATSAPP), the pop-up points visitors to the quote
 * and contact forms instead.
 */
export function WhatsAppFloat({ lang, t, quoteLabel, contactLabel }: { lang: Locale; t: Dict["wa"]; quoteLabel: string; contactLabel: string }) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const hasNumber = !!site.whatsapp;

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("wa-teaser") === "1"; } catch {}
    if (seen) return;
    const t = setTimeout(() => {
      setTeaser(true);
      try { sessionStorage.setItem("wa-teaser", "1"); } catch {}
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-end gap-3" data-wa-root>
      {/* Chat panel */}
      <div
        id="wa-panel"
        data-wa-panel
        role="dialog"
        aria-label={t.dialog}
        hidden={!open}
        className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgb(6_18_36/.45)] ring-1 ring-black/5"
      >
        <div className="flex items-center gap-3 bg-[#075E54] px-5 py-4 text-white">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <span className="font-display text-lg font-extrabold">M</span>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold leading-tight">Malir Int’l Logistics</p>
            <p className="text-xs text-white/75">{t.subtitle}</p>
          </div>
          <button type="button" data-wa-close onClick={() => setOpen(false)} aria-label={t.close} className="rounded p-1 text-white/80 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="bg-[#ECE5DD] px-4 py-5">
          <div className="max-w-[85%] rounded-xl rounded-tl-none bg-white px-4 py-3 text-sm text-ink shadow-sm">
            {t.greeting}
          </div>
        </div>
        <div className="space-y-2 p-4">
          {hasNumber ? (
            t.topics.map((tp) => (
              <a
                key={tp.label}
                href={whatsappLink(tp.text)!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-3 text-sm font-medium text-navy-900 transition hover:border-[#25D366] hover:bg-[#25D366]/5"
              >
                {tp.label}
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#25D366] rtl:-scale-x-100" aria-hidden="true"><path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            ))
          ) : (
            <>
              <p className="rounded-lg border border-dashed border-gold-600/50 bg-gold-100/50 px-4 py-3 text-xs text-gold-600">
                {t.pending}
              </p>
              <Link href={href(lang, "/quote")} onClick={() => setOpen(false)} className="flex items-center bg-gold-500 hover:bg-gold-400 justify-center rounded-lg px-4 py-3 text-sm font-semibold text-navy-950">{quoteLabel}</Link>
              <Link href={href(lang, "/contact")} onClick={() => setOpen(false)} className="flex items-center justify-center rounded-lg border border-line px-4 py-3 text-sm font-semibold text-navy-900 hover:border-navy-900">{contactLabel}</Link>
            </>
          )}
        </div>
      </div>

      {/* Greeting bubble */}
      {teaser && !open && (
        <div data-wa-teaser className="relative max-w-[15rem] rounded-xl bg-white px-4 py-3 text-sm text-ink shadow-lift ring-1 ring-black/5">
          <button type="button" onClick={() => setTeaser(false)} aria-label={t.dismiss} className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-xs text-white">×</button>
          <button type="button" onClick={() => { setOpen(true); setTeaser(false); }} className="text-start">
            <strong className="block text-navy-900">{t.teaserTitle}</strong>
            {t.teaserText}
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        data-wa-toggle
        aria-expanded={open}
        aria-controls="wa-panel"
        aria-label={open ? t.close : t.open}
        onClick={() => { setOpen((v) => !v); setTeaser(false); }}
        className="group relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-6px_rgb(37_211_102/.6)] transition-transform hover:scale-105"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" aria-hidden="true" />}
        <WaIcon className="relative h-8 w-8" />
      </button>
    </div>
  );
}
