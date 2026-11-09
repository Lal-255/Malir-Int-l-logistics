import type { Locale } from "./config";
import { en, type Dict } from "./en";
import { ar } from "./ar";
import { fa } from "./fa";
import { zh } from "./zh";

const dicts: Record<Locale, Dict> = { en, ar, fa, zh };
export const getDict = (lang: Locale): Dict => dicts[lang] ?? en;
export type { Dict };
export * from "./config";
