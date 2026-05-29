export type OnssaFiliere = {
  id: string;
  nom: string;
  description?: string;
};

/** Filières ONSSA — agrément par filière, indépendant du produit précis. */
export const onssaFilieres: OnssaFiliere[] = [
  { id: "huile-argan", nom: "Huile d'argan" },
  { id: "huile-olive", nom: "Huile d'olive" },
  { id: "dattes", nom: "Dattes" },
  { id: "safran", nom: "Safran" },
  { id: "miel", nom: "Miel" },
  {
    id: "pam",
    nom: "Plantes aromatiques et médicinales (PAM)",
  },
  { id: "cactus", nom: "Cactus" },
  { id: "rose-parfum", nom: "Rose à parfum" },
  { id: "cereales-couscous", nom: "Produits céréaliers et couscous" },
  { id: "fromages-laitiers", nom: "Fromages et produits laitiers" },
  { id: "fruits-secs", nom: "Fruits secs" },
  { id: "apiculture", nom: "Produits de l'apiculture" },
  { id: "biologiques", nom: "Produits biologiques" },
  { id: "epices", nom: "Épices" },
  { id: "truffes", nom: "Truffes" },
  { id: "escargots", nom: "Escargots" },
  { id: "caroube", nom: "Caroube" },
  { id: "grenade", nom: "Grenade" },
  { id: "figue-barbarie", nom: "Figue de barbarie" },
  { id: "produits-forestiers", nom: "Produits forestiers" },
  {
    id: "halieutiques-transformes",
    nom: "Produits halieutiques transformés",
  },
  {
    id: "viandes-transformees",
    nom: "Viandes transformées traditionnelles",
  },
];

export function getOnssaFiliere(id: string) {
  return onssaFilieres.find((f) => f.id === id);
}
