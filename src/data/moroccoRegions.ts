import type { MoroccoMapCode } from "@/data/morocco-admin-regions";
import {
  getRegionSlug,
  MOROCCO_ADMIN_REGIONS,
} from "@/data/morocco-admin-regions";
import type { Cooperative } from "@/types/cooperative";
import type { Produit } from "@/types/product";

export type RegionData = {
  id: string;
  mapCode: MoroccoMapCode;
  name: string;
  cooperativesCount: number;
  productsCount: number;
  color?: string;
};

export const MOROCCO_GEOJSON_URL = "/maps/morocco-regions.geojson";

export const MOROCCO_PROJECTION_CONFIG = {
  center: [-6.8, 28.8] as [number, number],
  scale: 2350,
};

const REGION_ACCENTS: Partial<Record<MoroccoMapCode, string>> = {
  MA02: "#50652a",
  MA03: "#5d2a26",
  MA07: "#cc7a60",
  MA08: "#cfaa71",
  MA09: "#3d4f20",
};

function regionNamesMatch(adminNom: string, regionNom: string): boolean {
  if (!regionNom.trim()) return false;
  const admin = adminNom.toLowerCase();
  const region = regionNom.toLowerCase();
  const adminKey = admin.split(/[\s-]/)[0] ?? "";
  const regionKey = region.split(/[\s-]/)[0] ?? "";
  return (
    admin.includes(regionKey) ||
    region.includes(adminKey) ||
    adminKey.includes(regionKey) ||
    regionKey.includes(adminKey)
  );
}

export function buildMoroccoRegionsData(
  cooperatives: Cooperative[],
  products: Produit[] = []
): Record<string, RegionData> {
  const lookup: Record<string, RegionData> = {};

  for (const admin of MOROCCO_ADMIN_REGIONS) {
    const cooperativesCount = cooperatives.filter((c) =>
      regionNamesMatch(admin.nom, c.region.nom)
    ).length;

    const productsCount = products.filter((p) =>
      regionNamesMatch(admin.nom, p.cooperative.region.nom)
    ).length;

    lookup[admin.mapCode] = {
      id: getRegionSlug(admin),
      mapCode: admin.mapCode,
      name: admin.nom,
      cooperativesCount,
      productsCount,
      color: REGION_ACCENTS[admin.mapCode],
    };
  }

  return lookup;
}

export function getRegionFromGeoProperties(
  properties: Record<string, unknown> | null | undefined,
  lookup: Record<string, RegionData>
): RegionData | undefined {
  if (!properties) return undefined;
  const code =
    (properties.mapCode as string) ||
    (properties.id as string) ||
    (properties.id_ as string);
  if (code && lookup[code]) return lookup[code];
  const name = properties.name as string | undefined;
  if (name) {
    return Object.values(lookup).find(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
  }
  return undefined;
}
