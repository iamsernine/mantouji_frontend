import { MOROCCO_ADMIN_REGIONS } from "@/data/morocco-admin-regions";

/** Official catalog region names — single source for UI ordering and API matching. */
export const CATALOG_REGION_NAMES = MOROCCO_ADMIN_REGIONS.map((region) => region.nom);

export function sortRegionsByCatalog<T extends { nom: string }>(regions: T[]): T[] {
  const order = new Map(CATALOG_REGION_NAMES.map((name, index) => [name, index]));
  return [...regions].sort(
    (a, b) => (order.get(a.nom) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.nom) ?? Number.MAX_SAFE_INTEGER)
  );
}

export function findRegionByCatalogName<T extends { nom: string }>(
  regions: T[],
  catalogName: string
): T | undefined {
  return regions.find((region) => region.nom === catalogName);
}
