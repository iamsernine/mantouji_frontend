import { getPublicBaseUrl } from "@/lib/api-client";

/** Resolve API-relative upload paths to a browser-reachable URL. */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url?.trim()) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${getPublicBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Next image optimizer in Docker cannot fetch localhost:8000 — load API media directly. */
export function shouldBypassImageOptimizer(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("blob:")) return true;
  if (src.startsWith("/")) return false;
  return src.startsWith("http://") || src.startsWith("https://");
}
