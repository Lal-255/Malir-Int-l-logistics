import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { destinations } from "@/data/routes";
import { href, locales, localeInfo } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number][] = [
    ["/", 1], ["/quote", 0.9], ["/partner", 0.9], ["/services", 0.8], ["/routes", 0.8], ["/containers", 0.7],
    ["/industries", 0.6], ["/about", 0.6], ["/contact", 0.6],
    ...destinations.map((d) => [`/routes/${d.slug}`, 0.7] as [string, number]),
  ];
  const abs = (p: string) => `${site.url}${p === "/" ? "" : p}`;
  return pages.flatMap(([p, priority]) =>
    locales.map((l) => ({
      url: abs(href(l, p)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((x) => [localeInfo[x].htmlLang, abs(href(x, p))])) },
    })),
  );
}
