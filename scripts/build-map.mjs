// Generates a static regional map (China -> Middle East & Red Sea) from Natural Earth data.
// Run: node scripts/build-map.mjs  (output committed to src/data/map.generated.json)
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";
import { geoMercator, geoPath } from "d3-geo";

const topo = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/countries-50m.json", import.meta.url)));
const pre = presimplify(topo);
const simp = simplify(pre, quantile(pre, 0.12));
const countries = feature(simp, simp.objects.countries);
const W = 1200;
const H = 700;
const bbox = { type: "Feature", geometry: { type: "Polygon", coordinates: [[[29, 41.5], [124, 41.5], [124, 0], [29, 0], [29, 41.5]]] } };
const proj = geoMercator().fitWidth(W, bbox);
proj.clipExtent([[-5, -5], [W + 5, Math.round(proj([0, 0])[1]) + 5]]);
const path = geoPath(proj);
const highlight = { "156": "china", "682": "dest", "784": "dest", "368": "dest", "512": "dest", "634": "dest", "414": "dest", "048": "dest", "818": "dest", "400": "dest", "729": "dest", "887": "dest" };
const shapes = { land: [], china: [], dest: [] };
for (const f of countries.features) {
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  if (x1 < -50 || x0 > W + 50 || y1 < -50 || y0 > H + 50) continue;
  const d = path(f);
  if (!d) continue;
  const round = d.replace(/(\d+)\.\d+/g, "$1");
  shapes[highlight[f.id] ?? "land"].push(round);
}
const pt = (lon, lat) => proj([lon, lat]).map((v) => Math.round(v * 10) / 10);
// Sea lane waypoints (schematic, for illustration only)
const lanes = {
  trunk: [[122.3, 30.4], [121.2, 25.5], [116.5, 21.2], [111.5, 14], [106.5, 5.5], [104.3, 1.3], [101.5, 2.6], [98.2, 5.4], [94.5, 6.2], [86, 5.6], [80.5, 5.3], [74, 8.5], [65, 13.5], [59.5, 16.2]],
  gulf: [[59.5, 16.2], [61, 21.5], [58.4, 24.6], [56.7, 26.3], [54.8, 26.2], [51.8, 27.3], [49.2, 29.0]],
  redsea: [[59.5, 16.2], [52, 13.2], [46, 12.3], [43.45, 12.6], [41.8, 15.6], [38.6, 20.8], [34.6, 27.2], [32.6, 29.75]],
};
const fmt = (v) => Math.round(v);
function curve(pts) {
  let d = `M${fmt(pts[0][0])},${fmt(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`;
  }
  return d;
}
const out = {
  width: W, height: Math.round(proj([0, 0])[1]),
  land: shapes.land, china: shapes.china, dest: shapes.dest,
  lanes: Object.fromEntries(Object.entries(lanes).map(([k, v]) => [k, curve(v.map(([a, b]) => pt(a, b)))])),
  project: null,
};
// Graticule (every 10°) for a nautical-chart feel
out.graticule = [];
for (let lon = 30; lon <= 120; lon += 10) out.graticule.push(curve([[lon, 0], [lon, 41.5]].map(([a, b]) => pt(a, b))));
for (let lat = 0; lat <= 40; lat += 10) out.graticule.push(curve([[29, lat], [124, lat]].map(([a, b]) => pt(a, b))));
// Pre-project port coordinates used by the site
const ports = JSON.parse(readFileSync(new URL("./port-coords.json", import.meta.url)));
out.points = Object.fromEntries(Object.entries(ports).map(([k, [lon, lat]]) => [k, pt(lon, lat)]));
delete out.project;
writeFileSync(new URL("../src/data/map.generated.json", import.meta.url), JSON.stringify(out));
console.log("map written", Object.keys(out.points).length, "points");
