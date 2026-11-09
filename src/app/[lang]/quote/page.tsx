import { containerOptions } from "@/data/containers";
import { allDestinationPorts } from "@/data/routes";
import { resolve } from "@/i18n/page";
import { formText } from "@/i18n/formText";
import { pageMeta, breadcrumbLd, faqLd } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ContactCard } from "@/components/ContactCard";
import { Faq } from "@/components/Faq";
import { Check, Section, SectionHeading } from "@/components/ui";

type P = { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: P) {
  const { lang, t } = await resolve(params);
  return pageMeta({ lang, ...t.meta.quote, path: "/quote" });
}

export default async function QuotePage({ params, searchParams }: P) {
  const { lang, t } = await resolve(params);
  const Q = t.quotePage;
  const sp = await searchParams;
  const defaults: Record<string, string> = {};
  if (typeof sp.destination === "string" && allDestinationPorts.some((p) => p.slug === sp.destination)) defaults.destinationPort = sp.destination;
  if (typeof sp.container === "string" && (containerOptions as readonly string[]).includes(sp.container)) defaults.containerType = sp.container;

  return (
    <>
      <PageHero lang={lang} t={t} eyebrow={Q.eyebrow} title={Q.title} intro={Q.intro} image="vessel" crumbs={[{ href: "/quote", label: Q.crumb }]} />
      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr]">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
            <h2 className="text-2xl font-bold">{Q.formTitle}</h2>
            <p className="mt-2 text-sm text-slate">{Q.formIntro}</p>
            <div className="mt-8"><InquiryForm kind="quote" ft={formText(t)} lang={lang} defaults={defaults} /></div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl bg-navy-900 p-7 text-white">
              <h2 className="text-lg font-bold !text-white">{Q.nextTitle}</h2>
              <ul className="mt-5 space-y-4 text-sm text-white/80">
                {Q.next.map((x) => <li key={x} className="flex gap-3"><Check className="h-5 w-5 text-gold-400" />{x}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-gold-500/40 bg-gold-100/50 p-6 text-sm text-navy-900">
              <strong className="font-display uppercase tracking-wider">{Q.fclStrong}</strong> {Q.fclText}
            </div>
            <ContactCard t={t} className="bg-white" />
          </aside>
        </div>
      </Section>
      <Section id="faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow={Q.faqEyebrow} title={Q.faqTitle} />
          <Faq items={t.faqs} />
        </div>
      </Section>
      <JsonLd data={[breadcrumbLd(lang, t.nav.home, [{ name: Q.crumb, path: "/quote" }]), faqLd(lang, t.faqs)]} />
    </>
  );
}
