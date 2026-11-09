export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.02rem] font-semibold text-navy-900">
            <h3 className="text-[1.02rem]">{f.q}</h3>
            <span className="relative h-5 w-5 shrink-0 text-gold-600" aria-hidden="true">
              <span className="absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-current transition-transform group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
