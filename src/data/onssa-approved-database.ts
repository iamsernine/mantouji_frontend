/**
 * Filières répertoriées dans la base nationale ONSSA.
 * Une demande d'agrément pour une filière présente ici est approuvée automatiquement.
 */
export const onssaApprovedFiliereIds: string[] = [
  "huile-argan",
  "huile-olive",
  "dattes",
  "miel",
  "pam",
  "cereales-couscous",
  "epices",
  "fruits-secs",
  "apiculture",
  "fromages-laitiers",
  "biologiques",
  "figue-barbarie",
  "grenade",
];

export function isFiliereInOnssaDatabaseStatic(filiereId: string): boolean {
  return onssaApprovedFiliereIds.includes(filiereId);
}
