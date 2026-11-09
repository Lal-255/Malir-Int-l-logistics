import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "gold" | "navy" | "teal" | "coral" | "outline" | "outline-light" | "ghost-light";
const variants: Record<Variant, string> = {
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-sm",
  teal: "bg-navy-900 text-white hover:bg-navy-700 shadow-sm",
  coral: "bg-navy-900 text-white hover:bg-navy-700 shadow-sm",
  navy: "bg-navy-900 text-white hover:bg-navy-700 shadow-sm",
  outline: "border border-navy-900/20 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
  "outline-light": "border border-white/40 text-white hover:bg-white hover:text-navy-900",
  "ghost-light": "text-white/90 hover:text-white underline-offset-4 hover:underline",
};
const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export function LinkButton({ href, variant = "gold", className = "", children, ...rest }: { href: string; variant?: Variant; className?: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, "href">) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({ variant = "gold", className = "", ...rest }: { variant?: Variant } & ComponentProps<"button">) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`rtl:-scale-x-100 ${className}`} aria-hidden="true">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Section({ id, className = "", children, tone = "white" }: { id?: string; className?: string; children: ReactNode; tone?: "white" | "mist" | "sand" | "teal" | "navy" }) {
  const tones = { white: "bg-white", mist: "bg-mist", sand: "bg-mist", teal: "bg-mist", navy: "bg-navy-900 text-white" };
  return (
    <section id={id} className={`${tones[tone]} py-20 sm:py-24 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, light = false, align = "left", as: Tag = "h2" }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; light?: boolean; align?: "left" | "center"; as?: "h1" | "h2" }) {
  return (
    <div data-reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${light ? "eyebrow-light" : ""} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>}
      <Tag className={`mt-4 font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] ${light ? "!text-white" : ""}`}>{title}</Tag>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/75" : "text-slate"}`}>{intro}</p>}
    </div>
  );
}

/** Visible marker for information that must be verified before publication. */
export function Pending({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border border-dashed px-2 py-0.5 text-xs font-medium ${light ? "border-gold-400/60 text-gold-400" : "border-gold-600/60 bg-gold-100/50 text-gold-600"}`}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 4.5v4M8 10.8v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      {label}
    </span>
  );
}

export function Check({ className = "h-5 w-5 text-gold-500" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M5 10.5 8.3 13.8 15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
