/** Region metadata from the API catalog (not mock data). */
export type RegionCatalogMeta = {
  id: string;
  nom: string;
  description: string;
  mapCode?: string;
  productCount?: number;
  cooperativesCount?: number;
  imageUrl?: string;
};
