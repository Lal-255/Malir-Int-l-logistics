/* eslint-disable @next/next/no-img-element */
/** Company logo (circular badge) with the name set beside it for legibility at small sizes. */
export function Logo({ light = false, size = "md", className = "" }: { light?: boolean; size?: "md" | "lg"; className?: string }) {
  const px = size === "lg" ? 88 : 52;
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <img
        src={size === "lg" ? "/brand/logo-256.png" : "/brand/logo-128.png"}
        alt="Malir Int’l Logistics logo"
        width={px}
        height={px}
        className="shrink-0 rounded-full bg-white shadow-sm ring-1 ring-black/5"
        style={{ width: px, height: px }}
      />
      <span className="leading-none">
        <span className={`block font-display text-[1.05rem] font-extrabold tracking-[0.14em] ${light ? "text-white" : "text-navy-900"}`}>MALIR</span>
        <span className={`mt-1 block text-[0.58rem] font-semibold tracking-[0.28em] ${light ? "text-gold-400" : "text-gold-600"}`}>INT’L LOGISTICS</span>
      </span>
    </span>
  );
}
