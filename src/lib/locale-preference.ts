export type PreferredLanguage = "fr" | "ar";

const STORAGE_KEY = "mantouji_preferred_language";

export function getStoredPreferredLanguage(): PreferredLanguage | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "ar" || raw === "fr" ? raw : null;
}

export function setStoredPreferredLanguage(lang: PreferredLanguage) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, lang);
}

export function applyPreferredLanguage(lang: PreferredLanguage) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  setStoredPreferredLanguage(lang);
}
