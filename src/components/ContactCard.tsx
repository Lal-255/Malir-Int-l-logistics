import { mailtoLink, site, whatsappLink } from "@/config/site";
import type { Dict } from "@/i18n/en";
import { Pending } from "./ui";

export function ContactCard({ t, className = "" }: { t: Dict; className?: string }) {
  const C = t.contactCard;
  const mail = mailtoLink("FCL shipping inquiry");
  const wa = whatsappLink(t.wa.topics[0].text);
  const rows = [
    { label: C.email, icon: <path d="M3 6.5h18v11H3zM3 7l9 6 9-6" />, value: mail ? <a href={mail} dir="ltr" className="font-semibold text-navy-900 hover:text-ocean-600">{site.email}</a> : <Pending label={`${C.officialEmail} — ${t.common.pending}`} /> },
    { label: C.whatsapp, icon: <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />, value: wa ? <a href={wa} dir="ltr" target="_blank" rel="noopener noreferrer" className="font-semibold text-navy-900 hover:text-ocean-600">+{site.whatsapp}</a> : <Pending label={`${C.whatsappNumber} — ${t.common.pending}`} /> },
    { label: C.office, icon: <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />, value: site.address ? <span className="text-navy-900">{site.address}</span> : <Pending label={`${C.officeAddress} — ${t.common.pending}`} /> },
  ];
  return (
    <div className={`rounded-xl bg-mist p-7 ${className}`}>
      <h3 className="text-base font-bold">{C.title}</h3>
      <dl className="mt-5 space-y-5">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-4">
            <dt className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gold-600 shadow-sm">
              <span className="sr-only">{r.label}</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">{r.icon}</svg>
            </dt>
            <dd className="text-sm">
              <span className="block text-xs font-medium uppercase tracking-wider text-slate">{r.label}</span>
              <span className="mt-1 block">{r.value}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-slate">{C.tz}</p>
    </div>
  );
}
