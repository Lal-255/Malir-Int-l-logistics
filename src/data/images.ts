/**
 * Photography manifest — company-supplied photos in /public/images.
 * To replace a photo, drop a new file with the same filename into /public/images.
 * (Entries with an `unsplash` id are downloaded automatically by `npm run images` if missing.)
 */
export const images = {
  hero: { file: "/images/vessel-aerial-top.jpg", alt: "Aerial view of a container vessel loaded with colourful containers on turquoise water" },
  vessel: { file: "/images/vessel-wake.jpg", alt: "Container ship at full speed leaving a white wake across green sea" },
  harbor: { file: "/images/port-tugboats.jpg", alt: "Tugboats guiding a loaded container ship to berth beside gantry cranes" },
  stack: { file: "/images/container-yard-colourful.jpg", alt: "Colourful stacked containers and ship-to-shore cranes at a container terminal" },
  terminal: { file: "/images/terminal-night.jpg", alt: "Illuminated container terminal and cranes at dusk" },
  cranes: { file: "/images/cranes-sunset.jpg", alt: "Port cranes silhouetted against an orange sunset over the sea" },
  warehouse: { file: "/images/warehouse.jpg", alt: "Export warehouse with cartons and goods prepared for shipment" },
  yard: { file: "/images/truck-container-yard.jpg", alt: "Container truck in a terminal yard under a pink and orange sky" },
  rail: { file: "/images/container-rail-yard.jpg", alt: "Rows of colourful shipping containers at an inland container depot" },
} as const;

export type ImageKey = keyof typeof images;
