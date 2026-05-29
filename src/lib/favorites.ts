const KEY = "mantouji_favorites";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getFavoriteIds(): string[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setFavoriteIds(ids: string[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function toggleFavorite(productId: string): string[] {
  const ids = getFavoriteIds();
  const next = ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [...ids, productId];
  setFavoriteIds(next);
  return next;
}

export function isFavorite(productId: string): boolean {
  return getFavoriteIds().includes(productId);
}
