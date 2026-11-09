import type { ContainerKind } from "@/data/containers";

/** Technical side-elevation drawing of a container type (not to exact scale). */
export function ContainerDiagram({ kind, length, className = "" }: { kind: ContainerKind; length: 20 | 40; className?: string }) {
  const W = length === 20 ? 190 : 360;
  const H = kind === "hc" ? 112 : 100;
  const ox = (400 - W) / 2;
  const base = 150;
  const top = base - H;
  const ribs = Math.round(W / 11);
  const body = "#1f4f82";
  const edge = "#0a1c36";
  return (
    <svg viewBox="0 0 400 180" className={className} aria-hidden="true">
      <line x1="10" y1={base + 8} x2="390" y2={base + 8} stroke="#c9d2de" strokeWidth="1" strokeDasharray="4 4" />
      {kind === "fr" ? (
        <g>
          <rect x={ox} y={base - 12} width={W} height="12" fill={body} stroke={edge} strokeWidth="1.5" />
          <rect x={ox} y={top + 10} width="10" height={H - 22} fill={body} stroke={edge} strokeWidth="1.5" />
          <rect x={ox + W - 10} y={top + 10} width="10" height={H - 22} fill={body} stroke={edge} strokeWidth="1.5" />
          <rect x={ox + 40} y={base - 62} width={W - 80} height="50" rx="3" fill="#e6ebf1" stroke="#8a9bb0" strokeWidth="1.2" />
          <path d={`M${ox + 40} ${base - 62} L${ox + 12} ${base - 12} M${ox + W - 40} ${base - 62} L${ox + W - 12} ${base - 12}`} stroke="#c8963e" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
      ) : (
        <g>
          <rect x={ox} y={top} width={W} height={H} fill={kind === "rf" ? "#e9eef4" : body} stroke={edge} strokeWidth="1.5" />
          {Array.from({ length: ribs }).map((_, i) => (
            <line key={i} x1={ox + 8 + i * ((W - 16) / ribs)} y1={top + 6} x2={ox + 8 + i * ((W - 16) / ribs)} y2={base - 6} stroke={kind === "rf" ? "#b7c3d2" : "#173f6b"} strokeWidth="2" />
          ))}
          <rect x={ox} y={top} width={W} height="6" fill={edge} />
          <rect x={ox} y={base - 6} width={W} height="6" fill={edge} />
          {kind === "ot" && (
            <g>
              <path d={`M${ox} ${top} Q${ox + W / 2} ${top - 16} ${ox + W} ${top}`} fill="none" stroke="#c8963e" strokeWidth="1.6" strokeDasharray="4 3" />
              <rect x={ox + 2} y={top - 1} width={W - 4} height="5" fill="#c8963e" opacity=".85" />
            </g>
          )}
          {kind === "rf" && <rect x={ox + W - 34} y={top + 14} width="26" height={H - 28} fill="#cfd8e3" stroke="#8a9bb0" />}
          {kind === "hc" && <text x={ox + 10} y={top + 22} fill="#d8ad5f" fontSize="11" fontWeight="700" fontFamily="var(--font-sans)">HIGH CUBE</text>}
        </g>
      )}
      {[ox, ox + W - 12].map((x) => <rect key={x} x={x} y={base - 6} width="12" height="6" fill="#c8963e" />)}
      <g fontFamily="var(--font-sans)" fontSize="11" fill="#4a5b71" textAnchor="middle">
        <line x1={ox} y1="168" x2={ox + W} y2="168" stroke="#8a9bb0" />
        <line x1={ox} y1="164" x2={ox} y2="172" stroke="#8a9bb0" />
        <line x1={ox + W} y1="164" x2={ox + W} y2="172" stroke="#8a9bb0" />
        <rect x={200 - 26} y="161" width="52" height="14" fill="#fff" />
        <text x="200" y="172">{length === 20 ? "20 ft" : "40 ft"}</text>
      </g>
    </svg>
  );
}

