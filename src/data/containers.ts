/** Container types (structure only — names, descriptions and specs live in the dictionaries). */
export type ContainerKind = "dry" | "hc" | "ot" | "fr" | "rf";
export const containers: { slug: string; kind: ContainerKind; length: 20 | 40; special: boolean; quoteOption: string; image: string; interior?: string }[] = [
  { slug: "20ft-standard", kind: "dry", length: 20, special: false, quoteOption: "20FT Standard", image: "/images/containers/20ft-standard.jpg", interior: "/images/containers/20ft-standard-interior.jpg" },
  { slug: "40ft-standard", kind: "dry", length: 40, special: false, quoteOption: "40FT Standard", image: "/images/containers/40ft-standard.jpg" },
  { slug: "40ft-high-cube", kind: "hc", length: 40, special: false, quoteOption: "40FT High Cube", image: "/images/containers/40ft-high-cube.jpg", interior: "/images/containers/40ft-high-cube-interior.jpg" },
  { slug: "open-top", kind: "ot", length: 40, special: true, quoteOption: "40FT Open Top", image: "/images/containers/open-top.jpg" },
  { slug: "flat-rack", kind: "fr", length: 40, special: true, quoteOption: "40FT Flat Rack", image: "/images/containers/flat-rack.jpg" },
  { slug: "reefer", kind: "rf", length: 40, special: true, quoteOption: "Reefer", image: "/images/containers/reefer.jpg", interior: "/images/containers/reefer-interior.jpg" },
];
/** Stable option values submitted by the quote form (labels are translated). */
export const containerOptions = ["20FT Standard", "40FT Standard", "40FT High Cube", "20FT Open Top", "40FT Open Top", "20FT Flat Rack", "40FT Flat Rack", "Reefer", "Not sure — please advise"] as const;
