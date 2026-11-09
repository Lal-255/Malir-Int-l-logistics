export const locales = ["en", "ar", "fa", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeInfo: Record<Locale, { label: string; short: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }> = {
  en: { label: "English", short: "EN", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  ar: { label: "العربية", short: "ع", dir: "rtl", htmlLang: "ar", ogLocale: "ar_AR" },
  fa: { label: "فارسی", short: "فا", dir: "rtl", htmlLang: "fa", ogLocale: "fa_IR" },
  zh: { label: "中文", short: "中", dir: "ltr", htmlLang: "zh-CN", ogLocale: "zh_CN" },
};

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

/** Localised internal link. English lives at the root (/about); others are prefixed (/ar/about). */
export function href(lang: Locale, path: string) {
  if (!path.startsWith("/")) return path;
  if (lang === defaultLocale) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Strip a locale prefix from a pathname: /ar/about -> /about */
export function stripLocale(pathname: string) {
  const m = pathname.match(/^\/(en|ar|fa|zh)(?=\/|$)/);
  if (!m) return { lang: defaultLocale as Locale, path: pathname || "/" };
  const rest = pathname.slice(m[0].length) || "/";
  return { lang: m[1] as Locale, path: rest };
}

/** Fill {placeholders} in a string. */
export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
