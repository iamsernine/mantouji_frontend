/**
 * Builds public/maps/morocco-regions.geojson from Simplemaps ma.svg paths.
 * Run: node scripts/build-morocco-geojson.mjs
 */
import fs from "fs";
import path from "path";
import svgPathParser from "svg-path-parser";
const { makeAbsolute, parseSVG } = svgPathParser;

const ROOT = path.resolve(import.meta.dirname, "..");
const SVG_PATH = path.join(ROOT, "public/images/ma.svg");
const OUT_PATH = path.join(ROOT, "public/maps/morocco-regions.geojson");

const NAME_BY_CODE = {
  MA01: "Tanger-Tétouan-Al Hoceïma",
  MA02: "Oriental",
  MA03: "Fès-Meknès",
  MA04: "Rabat-Salé-Kénitra",
  MA05: "Béni Mellal-Khénifra",
  MA06: "Casablanca-Settat",
  MA07: "Marrakech-Safi",
  MA08: "Drâa-Tafilalet",
  MA09: "Souss-Massa",
  MA10: "Guelmim-Oued Noun",
  MA11: "Laâyoune-Sakia El Hamra",
  MA12: "Dakhla-Oued Ed-Dahab",
};

function extractRegions(svg) {
  const regions = [];
  const re =
    /<path[^>]*\bd="([^"]+)"[^>]*\bid="(MA\d{2})"[^>]*(?:\bname="([^"]*)")?[^>]*\/?>/gi;
  let m;
  while ((m = re.exec(svg)) !== null) {
    regions.push({
      d: m[1],
      id: m[2],
      name: m[3] || NAME_BY_CODE[m[2]] || m[2],
    });
  }
  if (regions.length === 0) {
    const re2 =
      /<path[^>]*\bid="(MA\d{2})"[^>]*\bname="([^"]*)"[^>]*\bd="([^"]+)"[^>]*\/?>/gi;
    while ((m = re2.exec(svg)) !== null) {
      regions.push({ id: m[1], name: m[2], d: m[3] });
    }
  }
  return regions;
}

function pathToRing(d) {
  const commands = makeAbsolute(parseSVG(d));
  const ring = [];
  let x = 0;
  let y = 0;

  for (const cmd of commands) {
    switch (cmd.code) {
      case "M":
        x = cmd.x;
        y = cmd.y;
        ring.push([x, y]);
        break;
      case "L":
        x = cmd.x;
        y = cmd.y;
        ring.push([x, y]);
        break;
      case "H":
        x = cmd.x;
        ring.push([x, y]);
        break;
      case "V":
        y = cmd.y;
        ring.push([x, y]);
        break;
      case "Z":
        break;
      case "C":
      case "S":
      case "Q":
      case "T":
      case "A":
        x = cmd.x;
        y = cmd.y;
        ring.push([x, y]);
        break;
      default:
        if ("x" in cmd && "y" in cmd) {
          x = cmd.x;
          y = cmd.y;
          ring.push([x, y]);
        }
    }
  }

  if (ring.length > 2) {
    const [fx, fy] = ring[0];
    const [lx, ly] = ring[ring.length - 1];
    if (fx !== lx || fy !== ly) ring.push([fx, fy]);
  }
  return ring;
}

function simplifyRing(ring, step = 4) {
  if (ring.length <= 8) return ring;
  const out = [];
  for (let i = 0; i < ring.length; i += step) out.push(ring[i]);
  const last = ring[ring.length - 1];
  const end = out[out.length - 1];
  if (end[0] !== last[0] || end[1] !== last[1]) out.push(last);
  if (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1]) {
    out.push(out[0]);
  }
  return out;
}

function svgToLonLat([x, y]) {
  // Simplemaps viewBox 0 0 1000 1000 → WGS84 bounds (approx. Morocco)
  const minLon = -17.1;
  const maxLon = -0.99;
  const minLat = 21.0;
  const maxLat = 36.0;
  const lon = minLon + (x / 1000) * (maxLon - minLon);
  const lat = maxLat - (y / 1000) * (maxLat - minLat);
  return [lon, lat];
}

const svg = fs.readFileSync(SVG_PATH, "utf8");
const regionPaths = extractRegions(svg);

if (regionPaths.length === 0) {
  console.error("No MA## paths found in ma.svg");
  process.exit(1);
}

const features = regionPaths.map(({ id, name, d }) => {
  const ring = simplifyRing(pathToRing(d).map(svgToLonLat), 6);
  return {
    type: "Feature",
    properties: {
      id,
      name: NAME_BY_CODE[id] || name,
      mapCode: id,
    },
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
  };
});

const collection = {
  type: "FeatureCollection",
  features,
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(collection));
console.log(`Wrote ${features.length} regions → ${OUT_PATH}`);
