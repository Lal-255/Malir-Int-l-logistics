import { NextResponse } from "next/server";
import { forms, validate, type InquiryKind, type Values } from "@/lib/inquiry";
import { en } from "@/i18n/en";
import { formText, summarize } from "@/i18n/formText";

const formTitles: Record<InquiryKind, string> = { quote: "Freight Quote Request", partner: "Partnership Inquiry", contact: "Business Inquiry" };
const ftEn = formText(en);
const label = (f: { labelKey: string }) => (ftEn.form.fields as Record<string, { label: string }>)[f.labelKey].label;
const display = (f: { options?: string; name: string }, v: string) => (f.options ? ftEn.options[f.options as keyof typeof ftEn.options].find((o) => o.value === v)?.label ?? v : v);

/**
 * Inquiry delivery endpoint.
 *
 * Delivery channels (configure at least one in the hosting environment):
 *   A) Resend email  — RESEND_API_KEY + INQUIRY_TO_EMAIL + INQUIRY_FROM_EMAIL
 *   B) Webhook       — INQUIRY_WEBHOOK_URL (receives JSON; Zapier/Make/n8n/CRM)
 *
 * If neither is configured the endpoint answers 503 and the website offers the
 * visitor a pre-filled email / WhatsApp alternative. Inquiries are never
 * silently discarded or "faked" as sent.
 */

export const runtime = "nodejs";

const KINDS: InquiryKind[] = ["quote", "partner", "contact"];
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > LIMIT;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });

  let body: { kind?: string; values?: Record<string, unknown>; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const kind = body.kind as InquiryKind;
  if (!KINDS.includes(kind) || typeof body.values !== "object" || body.values === null) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Keep only known fields, as strings
  const values: Values = {};
  for (const f of forms[kind]) {
    const v = body.values[f.name];
    if (typeof v === "string") values[f.name] = v.trim().slice(0, 4000);
  }

  // Honeypot: pretend success to bots, deliver nothing
  if (typeof body.values._hp === "string" && body.values._hp.length > 0) {
    return NextResponse.json({ ok: true, reference: "MIL-0000" });
  }

  const errors = validate(kind, values);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const reference = `MIL-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const siteLang = typeof body.lang === "string" ? body.lang.slice(0, 5) : "en";
  const countryField = forms[kind].find((f) => f.name === "country")!;
  const subject = `[${reference}] ${formTitles[kind]} — ${values.company} (${display(countryField, values.country)})`;
  const text = `${summarize(kind, values, ftEn, formTitles[kind])}\nWebsite language: ${siteLang}\n\nReference: ${reference}\nSubmitted: ${new Date().toISOString()}`;

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const webhook = process.env.INQUIRY_WEBHOOK_URL;

  if (!(resendKey && to && from) && !webhook) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const tasks: Promise<Response>[] = [];
  if (resendKey && to && from) {
    const rows = forms[kind]
      .filter((f) => values[f.name])
      .map((f) => `<tr><td style="padding:6px 12px 6px 0;color:#4a5b71;vertical-align:top;white-space:nowrap">${esc(label(f))}</td><td style="padding:6px 0;color:#0d1a2b">${esc(display(f, values[f.name])).replace(/\n/g, "<br>")}</td></tr>`)
      .join("");
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: to.split(",").map((s) => s.trim()),
          reply_to: values.email,
          subject,
          text,
          html: `<div style="font-family:Arial,sans-serif;font-size:14px"><h2 style="color:#0a1c36">${esc(formTitles[kind])}</h2><table>${rows}</table><p style="color:#4a5b71">Reference: ${reference}</p></div>`,
        }),
        signal: AbortSignal.timeout(10000),
      }),
    );
  }
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, kind, title: formTitles[kind], subject, language: siteLang, values, text, submittedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(10000),
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value.ok);
  if (!delivered) {
    console.error("[inquiry] delivery failed", reference, results.map((r) => (r.status === "fulfilled" ? r.value.status : String(r.reason))));
    return NextResponse.json({ error: "We could not send your inquiry right now. Please try again shortly or contact us by email or WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, reference });
}
