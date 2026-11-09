import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { images, type ImageKey } from "@/data/images";

/**
 * Renders a local photo from /public/images when available, otherwise a
 * restrained navy placeholder so layouts never show a broken image.
 */
export function Photo({ name, className = "", imgClassName = "", priority = false, sizes = "100vw", overlay = false }: { name: ImageKey; className?: string; imgClassName?: string; priority?: boolean; sizes?: string; overlay?: boolean }) {
  const img = images[name];
  const available = existsSync(join(process.cwd(), "public", img.file));
  return (
    <div className={`relative overflow-hidden bg-navy-800 ${className}`}>
      {available ? (
        <Image src={img.file} alt={img.alt} fill priority={priority} sizes={sizes} className={`object-cover ${imgClassName}`} />
      ) : (
        <div role="img" aria-label={img.alt} className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_10%,#1f4f82_0%,#0f2a4d_45%,#061224_100%)]">
          <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
            <defs>
              <pattern id={`grid-${name}`} width="56" height="28" patternUnits="userSpaceOnUse">
                <rect x="1" y="1" width="54" height="26" fill="none" stroke="#fff" strokeWidth="1" />
                <path d="M10 1v26M19 1v26M28 1v26M37 1v26M46 1v26" stroke="#fff" strokeWidth=".5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${name})`} />
          </svg>
        </div>
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/10" />}
    </div>
  );
}
