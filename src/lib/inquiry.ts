/**
 * Inquiry form structure + validation, shared by the browser and the API
 * route. Option values are language-independent (slugs / fixed codes); the
 * visible labels come from the active language dictionary.
 */
import { containerOptions } from "@/data/containers";
import { contactSubjects, customerTypes, partnerTypes } from "@/data/content";
import { allDestinationPorts, destinations, originPorts } from "@/data/routes";

export type InquiryKind = "quote" | "partner" | "contact";

export type OptionSource = "country" | "originPort" | "destPort" | "container" | "customerType" | "partnerType" | "subject";

export type FieldDef = {
  name: string;
  /** key into dict.form.fields */
  labelKey: string;
  type: "text" | "email" | "tel" | "select" | "number" | "date" | "textarea";
  required?: boolean;
  options?: OptionSource;
  max?: number;
  min?: number;
  autoComplete?: string;
  wide?: boolean;
  section?: "details" | "shipment";
};

const contactFields = (section?: FieldDef["section"]): FieldDef[] => [
  { name: "fullName", labelKey: "fullName", type: "text", required: true, max: 120, autoComplete: "name", section },
  { name: "company", labelKey: "company", type: "text", required: true, max: 160, autoComplete: "organization", section },
  { name: "email", labelKey: "email", type: "email", required: true, max: 160, autoComplete: "email", section },
  { name: "phone", labelKey: "phone", type: "tel", required: true, max: 40, autoComplete: "tel", section },
  { name: "country", labelKey: "country", type: "select", required: true, options: "country", section },
];

export const forms: Record<InquiryKind, FieldDef[]> = {
  quote: [
    ...contactFields("details"),
    { name: "customerType", labelKey: "customerType", type: "select", required: true, options: "customerType", section: "details" },
    { name: "originPort", labelKey: "originPort", type: "select", required: true, options: "originPort", section: "shipment" },
    { name: "destinationPort", labelKey: "destinationPort", type: "select", required: true, options: "destPort", section: "shipment" },
    { name: "containerType", labelKey: "containerType", type: "select", required: true, options: "container", section: "shipment" },
    { name: "containers", labelKey: "containers", type: "number", required: true, min: 1, max: 999, section: "shipment" },
    { name: "commodity", labelKey: "commodity", type: "textarea", required: true, max: 1000, wide: true, section: "shipment" },
    { name: "weight", labelKey: "weight", type: "text", max: 60, section: "shipment" },
    { name: "shipDate", labelKey: "shipDate", type: "date", section: "shipment" },
    { name: "notes", labelKey: "notes", type: "textarea", max: 2000, wide: true, section: "shipment" },
  ],
  partner: [
    ...contactFields(),
    { name: "partnerType", labelKey: "partnerType", type: "select", required: true, options: "partnerType" },
    { name: "website", labelKey: "website", type: "text", max: 200, autoComplete: "url" },
    { name: "message", labelKey: "partnerMessage", type: "textarea", required: true, max: 3000, wide: true },
  ],
  contact: [
    ...contactFields(),
    { name: "subject", labelKey: "subject", type: "select", required: true, options: "subject" },
    { name: "message", labelKey: "message", type: "textarea", required: true, max: 3000, wide: true },
  ],
};

/** Allowed option values per source (language-independent). */
export const optionValues: Record<OptionSource, readonly string[]> = {
  country: [...destinations.map((d) => d.slug), "china", "other"],
  originPort: [...originPorts.map((o) => o.slug), "other"],
  destPort: [...allDestinationPorts.map((p) => p.slug), "other"],
  container: containerOptions,
  customerType: customerTypes,
  partnerType: partnerTypes,
  subject: contactSubjects,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,40}$/;

export type Values = Record<string, string>;
/** Error codes: "required" | "max" | "email" | "phone" | "number" | "date" | "option" */
export type Errors = Record<string, string>;

export function validate(kind: InquiryKind, values: Values): Errors {
  const errors: Errors = {};
  for (const f of forms[kind]) {
    const v = (values[f.name] ?? "").trim();
    if (!v) {
      if (f.required) errors[f.name] = "required";
      continue;
    }
    if (f.max && f.type !== "number" && v.length > f.max) errors[f.name] = "max";
    else if (f.type === "email" && !EMAIL_RE.test(v)) errors[f.name] = "email";
    else if (f.type === "tel" && !PHONE_RE.test(v)) errors[f.name] = "phone";
    else if (f.type === "number") {
      const n = Number(v);
      if (!Number.isInteger(n) || n < (f.min ?? 0) || n > (f.max ?? Infinity)) errors[f.name] = "number";
    } else if (f.type === "date") {
      if (Number.isNaN(new Date(v).getTime())) errors[f.name] = "date";
    } else if (f.type === "select" && f.options && !optionValues[f.options].includes(v)) errors[f.name] = "option";
  }
  return errors;
}
