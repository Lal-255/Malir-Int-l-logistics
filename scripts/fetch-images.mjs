// Downloads free-licence Unsplash photos listed in src/data/images.ts into public/images.
// Safe to run repeatedly: existing files are kept. Never fails the build.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const manifest = readFileSync(join(root, "src/data/images.ts"), "utf8");
const entries = [...manifest.matchAll(/file:\s*"([^"]+)",\s*unsplash:\s*"([^"]+)"/g)].map((m) => ({ file: m[1], id: m[2] }));
mkdirSync(join(root, "public/images"), { recursive: true });

let sharp = null;
try { sharp = (await import("sharp")).default; } catch { /* optional */ }

let ok = 0;
for (const { file, id } of entries) {
  const dest = join(root, "public", file);
  if (existsSync(dest)) { ok++; continue; }
  try {
    const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true`, { redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let buf = Buffer.from(await res.arrayBuffer());
    if (sharp) buf = await sharp(buf).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    writeFileSync(dest, buf);
    ok++;
    console.log(`  ✓ ${file}`);
  } catch (e) {
    console.warn(`  ! could not download ${file} (${e.message}) — the site will show a designed placeholder instead`);
  }
}
console.log(`images: ${ok}/${entries.length} available`);
