import type { Dict } from "./en";
import { destinations, originPorts } from "@/data/routes";
import { optionValues, forms, type InquiryKind, type OptionSource, type Values } from "@/lib/inquiry";

export type Opt = { value: string; label: string };
export type FormText = {
  form: Dict["form"];
  options: Record<OptionSource, Opt[]>;
  destGroups: { label: string; options: Opt[] }[];
};

/** Serializable, translated labels for the inquiry forms. */
export function formText(t: Dict): FormText {
  const o = t.form.options;
  const lbl = (v: string) => o[v] ?? v;
  const countryName = (slug: string) => (t.destinations as Record<string, { country: string }>)[slug]?.country ?? slug;
  const portName = (cSlug: string, pSlug: string) =>
    (t.destinations as Record<string, { ports: Record<string, { name: string }> }>)[cSlug]?.ports[pSlug]?.name ?? pSlug;
  const destGroups = [
    ...destinations.map((d) => ({ label: countryName(d.slug), options: d.ports.map((p) => ({ value: p.slug, label: portName(d.slug, p.slug) })) })),
    { label: lbl("Other"), options: [{ value: "other", label: lbl("Other / not sure — please advise") }] },
  ];
  const options: Record<OptionSource, Opt[]> = {
    country: [...destinations.map((d) => ({ value: d.slug, label: countryName(d.slug) })), { value: "china", label: lbl("China") }, { value: "other", label: lbl("Other") }],
    originPort: [...originPorts.map((p) => ({ value: p.slug, label: (t.originPorts as Record<string, { name: string }>)[p.slug].name })), { value: "other", label: lbl("Other / not sure — please advise") }],
    destPort: destGroups.flatMap((g) => g.options),
    container: optionValues.container.map((v) => ({ value: v, label: lbl(v) })),
    customerType: optionValues.customerType.map((v) => ({ value: v, label: lbl(v) })),
    partnerType: optionValues.partnerType.map((v) => ({ value: v, label: lbl(v) })),
    subject: optionValues.subject.map((v) => ({ value: v, label: lbl(v) })),
  };
  return { form: t.form, options, destGroups };
}

/** Plain-text summary (used for notifications in English and for email/WhatsApp fallbacks). */
export function summarize(kind: InquiryKind, values: Values, ft: FormText, title: string) {
  const fields = ft.form.fields as Record<string, { label: string }>;
  const lines = forms[kind]
    .filter((f) => (values[f.name] ?? "").trim())
    .map((f) => {
      const raw = values[f.name].trim();
      const label = f.options ? ft.options[f.options].find((x) => x.value === raw)?.label ?? raw : raw;
      return `${fields[f.labelKey].label}: ${label}`;
    });
  return `${title}\n\n${lines.join("\n")}`;
}
