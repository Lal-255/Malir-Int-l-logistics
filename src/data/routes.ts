/**
 * Origin gateways and destination markets (structure only — names and copy
 * live in the language dictionaries under src/i18n).
 *
 * IMPORTANT: Listing a port does NOT mean a scheduled service exists. Every
 * route is quoted case by case. Never add transit times, frequencies or rates.
 */
export type Region = "gulf" | "redsea";
export type Port = { slug: string; locode: string };
export type Destination = { slug: string; region: Region; ports: Port[] };

export const originPorts = [
  { slug: "shanghai", locode: "CNSHA" },
  { slug: "ningbo", locode: "CNNGB" },
  { slug: "shenzhen", locode: "CNSZX" },
  { slug: "guangzhou", locode: "CNCAN" },
  { slug: "xiamen", locode: "CNXMN" },
  { slug: "qingdao", locode: "CNTAO" },
  { slug: "tianjin", locode: "CNTXG" },
] as const;

export const destinations: Destination[] = [
  { slug: "saudi-arabia", region: "gulf", ports: [{ slug: "jeddah", locode: "SAJED" }, { slug: "king-abdullah-port", locode: "SAKAC" }, { slug: "dammam", locode: "SADMM" }] },
  { slug: "uae", region: "gulf", ports: [{ slug: "jebel-ali", locode: "AEJEA" }] },
  { slug: "iraq", region: "gulf", ports: [{ slug: "umm-qasr", locode: "IQUQR" }] },
  { slug: "oman", region: "gulf", ports: [{ slug: "sohar", locode: "OMSOH" }] },
  { slug: "qatar", region: "gulf", ports: [{ slug: "hamad-port", locode: "QAHMD" }] },
  { slug: "kuwait", region: "gulf", ports: [{ slug: "shuwaikh", locode: "KWSWK" }] },
  { slug: "bahrain", region: "gulf", ports: [{ slug: "khalifa-bin-salman", locode: "BHKBS" }] },
  { slug: "egypt", region: "redsea", ports: [{ slug: "ain-sokhna", locode: "EGSOK" }, { slug: "port-said", locode: "EGPSD" }] },
  { slug: "jordan", region: "redsea", ports: [{ slug: "aqaba", locode: "JOAQJ" }] },
  { slug: "sudan", region: "redsea", ports: [{ slug: "port-sudan", locode: "SDPZU" }] },
  { slug: "yemen", region: "redsea", ports: [{ slug: "aden", locode: "YEADE" }] },
];

export const allDestinationPorts = destinations.flatMap((d) => d.ports.map((p) => ({ ...p, countrySlug: d.slug, region: d.region })));
export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
