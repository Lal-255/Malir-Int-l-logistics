import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "Malir Int'l Logistics — Connecting China with the Middle East";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/logo-512.png")).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 48, padding: 64, background: "linear-gradient(135deg,#061224 0%,#0f2a4d 60%,#1f4f82 100%)", color: "#fff", fontFamily: "sans-serif" }}>
        <img src={logo} width={380} height={380} alt="" style={{ borderRadius: 400, background: "#fff" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.05 }}>CONNECTING CHINA</div>
          <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.05, color: "#d8ad5f" }}>WITH THE MIDDLE EAST</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "rgba(255,255,255,.8)" }}>FCL ocean freight · China to the Gulf & Red Sea</div>
          <div style={{ marginTop: 18, fontSize: 24, color: "#d8ad5f" }}>malirlogistics.com</div>
        </div>
      </div>
    ),
    size,
  );
}
