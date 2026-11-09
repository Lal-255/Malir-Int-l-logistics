"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { mailtoLink, site, whatsappLink } from "@/config/site";
import { forms, validate, type Errors, type FieldDef, type InquiryKind, type Values } from "@/lib/inquiry";
import { summarize, type FormText } from "@/i18n/formText";
import { fmt } from "@/i18n/config";
import { Arrow, Button, Pending } from "../ui";

type Status = { state: "idle" | "submitting" | "success" | "unavailable" | "error"; message?: string; ref?: string };

export function InquiryForm({ kind, ft, lang, defaults = {} }: { kind: InquiryKind; ft: FormText; lang: string; defaults?: Values }) {
  const T = ft.form;
  const fields = forms[kind];
  const labels = T.fields as Record<string, { label: string; placeholder: string; hint?: string }>;
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [lastValues, setLastValues] = useState<Values>({});

  const sections = useMemo(() => {
    const out: { title?: FieldDef["section"]; fields: FieldDef[] }[] = [];
    for (const f of fields) {
      const last = out[out.length - 1];
      if (!last || last.title !== f.section) out.push({ title: f.section, fields: [f] });
      else last.fields.push(f);
    }
    return out;
  }, [fields]);

  const errText = (f: FieldDef, code: string) => {
    const E = T.errors as Record<string, string>;
    return fmt(E[code] ?? E.required, { n: f.max ?? "", min: f.min ?? "", max: f.max ?? "" });
  };

  const read = (): Values => {
    const fd = new FormData(formRef.current!);
    const v: Values = {};
    fd.forEach((val, key) => { v[key] = String(val); });
    return v;
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const values = read();
    const errs = validate(kind, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = fields.find((f) => errs[f.name]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
    setLastValues(values);
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, values, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ state: "success", ref: data.reference });
        formRef.current?.reset();
        window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
      } else if (res.status === 503) {
        setStatus({ state: "unavailable" });
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus({ state: "idle" });
      } else {
        setStatus({ state: "error", message: T.genericError });
      }
    } catch {
      setStatus({ state: "error", message: T.networkError });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-8">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true"><path d="M5 10.5 8.3 13.8 15 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div>
            <h3 className="text-xl font-bold">{fmt(T.successTitle, { title: T.titles[kind] })}</h3>
            <p className="mt-2 text-slate">
              {T.successText} {status.ref && <>{T.reference} <strong className="text-navy-900" dir="ltr">{status.ref}</strong>.</>}
            </p>
            <button type="button" className="mt-5 text-sm font-semibold text-ocean-600 underline-offset-4 hover:underline" onClick={() => setStatus({ state: "idle" })}>
              {T.another}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-10" aria-describedby={`${kind}-form-note`}>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this field empty<input type="text" name="_hp" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {sections.map((sec, si) => (
        <fieldset key={si} className="space-y-5">
          {sec.title && <legend className="mb-5 font-display text-sm font-bold uppercase tracking-[0.16em] text-gold-600">{sec.title === "details" ? T.sectionDetails : T.sectionShipment}</legend>}
          <div className="grid gap-5 sm:grid-cols-2">
            {sec.fields.map((f) => {
              const id = `${kind}-${f.name}`;
              const L = labels[f.labelKey];
              const err = errors[f.name];
              const common = {
                id,
                name: f.name,
                "aria-invalid": err ? true : undefined,
                "aria-describedby": [err ? `${id}-err` : "", L.hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined,
                "aria-required": f.required || undefined,
                defaultValue: defaults[f.name] ?? "",
                className: "field",
                autoComplete: f.autoComplete,
                onChange: err ? () => setErrors((prev) => { const next = { ...prev }; delete next[f.name]; return next; }) : undefined,
              };
              const ltrField = f.type === "email" || f.type === "tel" || f.name === "website";
              return (
                <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
                  <label htmlFor={id} className="field-label">
                    {L.label} {f.required ? <span className="text-gold-600" aria-hidden="true">*</span> : <span className="font-normal text-slate/70">{T.optional}</span>}
                  </label>
                  {f.type === "select" ? (
                    <select {...common}>
                      <option value="">{T.select}</option>
                      {f.options === "destPort"
                        ? ft.destGroups.map((g) => (
                            <optgroup key={g.label} label={g.label}>
                              {g.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </optgroup>
                          ))
                        : ft.options[f.options!].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea {...common} rows={4} maxLength={f.max} placeholder={L.placeholder || undefined} />
                  ) : (
                    <input
                      {...common}
                      dir={ltrField ? "ltr" : undefined}
                      type={f.type}
                      inputMode={f.type === "number" ? "numeric" : f.type === "tel" ? "tel" : undefined}
                      min={f.type === "number" ? f.min : f.type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
                      max={f.type === "number" ? f.max : undefined}
                      maxLength={f.type !== "number" && f.type !== "date" ? f.max : undefined}
                      placeholder={L.placeholder || undefined}
                    />
                  )}
                  {L.hint && !err && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate/80">{L.hint}</p>}
                  {err && <p id={`${id}-err`} className="field-error">{errText(f, err)}</p>}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{fmt(T.reviewErrors, { n: Object.keys(errors).length })}</p>
      )}
      {status.state === "error" && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{status.message}</p>}
      {status.state === "unavailable" && <Fallback kind={kind} values={lastValues} ft={ft} />}

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${kind}-form-note`} className="max-w-md text-xs leading-relaxed text-slate">{T.required}</p>
        <Button type="submit" disabled={status.state === "submitting"} className="min-w-56">
          {status.state === "submitting" ? T.sending : <>{T.submit[kind]} <Arrow /></>}
        </Button>
      </div>
    </form>
  );
}

function Fallback({ kind, values, ft }: { kind: InquiryKind; values: Values; ft: FormText }) {
  const T = ft.form;
  const text = summarize(kind, values, ft, T.titles[kind]);
  const mail = mailtoLink(`${T.titles[kind]} — ${values.company ?? ""}`.trim(), text);
  const wa = whatsappLink(text);
  const [copied, setCopied] = useState(false);
  return (
    <div role="status" className="rounded-xl border border-gold-500/40 bg-gold-100/50 p-6">
      <h3 className="text-lg font-bold">{T.unavailableTitle}</h3>
      <p className="mt-2 text-sm text-slate">{T.unavailableText}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {mail ? <a className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700" href={mail}>{T.sendEmail}</a> : <Pending label="Email" />}
        {wa ? <a className="inline-flex items-center gap-2 rounded-md bg-[#1f9d55] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#188046]" href={wa} target="_blank" rel="noopener noreferrer">{T.sendWhatsapp}</a> : <Pending label="WhatsApp" />}
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-navy-900/20 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-navy-900" onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); } }}>
          {copied ? T.copied : T.copy}
        </button>
      </div>
      {!site.email && !site.whatsapp && <p className="mt-3 text-xs text-slate">{T.detailsSoon}</p>}
    </div>
  );
}
