import { headers } from "next/headers";
import { getDict, href, stripLocale } from "@/i18n";
import { Arrow, LinkButton } from "@/components/ui";

export default async function NotFound() {
  const h = await headers();
  const path = h.get("x-invoke-path") ?? h.get("next-url") ?? "/";
  const { lang } = stripLocale(path);
  const t = getDict(lang).notFound;
  return (
    <section className="flex min-h-[90vh] items-center bg-navy-950 pt-[4.5rem] text-white">
      <div className="container-x text-center">
        <p className="eyebrow eyebrow-light justify-center">404</p>
        <h1 className="mt-4 text-5xl font-extrabold uppercase !text-white">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">{t.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href={href(lang, "/")} variant="outline-light">{t.home}</LinkButton>
          <LinkButton href={href(lang, "/quote")}>{t.quote} <Arrow /></LinkButton>
        </div>
      </div>
    </section>
  );
}
