import { notFound } from "next/navigation";
import { getDict, isLocale, type Locale } from "./index";

export type LangParams = { params: Promise<{ lang: string }> };

/** Resolve the language for a page, 404 for unknown prefixes. */
export async function resolve(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang: lang as Locale, t: getDict(lang as Locale) };
}
