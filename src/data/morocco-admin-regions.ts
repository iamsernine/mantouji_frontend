/** Official Morocco administrative regions (Simplemaps ma.svg codes). */

export type MoroccoMapCode =
  | "MA01"
  | "MA02"
  | "MA03"
  | "MA04"
  | "MA05"
  | "MA06"
  | "MA07"
  | "MA08"
  | "MA09"
  | "MA10"
  | "MA11"
  | "MA12";

export type MoroccoAdminRegion = {
  mapCode: MoroccoMapCode;
  nom: string;
};

export const MOROCCO_ADMIN_REGIONS: MoroccoAdminRegion[] = [
  { mapCode: "MA01", nom: "Tanger-Tétouan-Al Hoceïma" },
  { mapCode: "MA02", nom: "Oriental" },
  { mapCode: "MA03", nom: "Fès-Meknès" },
  { mapCode: "MA04", nom: "Rabat-Salé-Kénitra" },
  { mapCode: "MA05", nom: "Béni Mellal-Khénifra" },
  { mapCode: "MA06", nom: "Casablanca-Settat" },
  { mapCode: "MA07", nom: "Marrakech-Safi" },
  { mapCode: "MA08", nom: "Drâa-Tafilalet" },
  { mapCode: "MA09", nom: "Souss-Massa" },
  { mapCode: "MA10", nom: "Guelmim-Oued Noun" },
  { mapCode: "MA11", nom: "Laâyoune-Sakia El Hamra" },
  { mapCode: "MA12", nom: "Dakhla-Oued Ed-Dahab" },
];

export const MOROCCO_MAP_VIEWBOX = "0 0 1000 1000";

export function regionSlugFromName(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[''’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getRegionSlug(admin: MoroccoAdminRegion): string {
  return regionSlugFromName(admin.nom);
}

export function getAdminRegion(mapCode: string): MoroccoAdminRegion | undefined {
  return MOROCCO_ADMIN_REGIONS.find((r) => r.mapCode === mapCode);
}

export function getAdminRegionBySlug(slug: string): MoroccoAdminRegion | undefined {
  return MOROCCO_ADMIN_REGIONS.find((r) => getRegionSlug(r) === slug);
}

export function isMoroccoMapCode(code: string): code is MoroccoMapCode {
  return MOROCCO_ADMIN_REGIONS.some((r) => r.mapCode === code);
}

export function isMoroccoRegionSlug(slug: string): boolean {
  return getAdminRegionBySlug(slug) !== undefined;
}
