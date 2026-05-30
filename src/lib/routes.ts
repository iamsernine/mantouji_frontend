/** Routes that require an active session (visitor cannot stay here). */
export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard/admin",
  "/dashboard/cooperative",
  "/dashboard/onssa",
  "/compte",
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
