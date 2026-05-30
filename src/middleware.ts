import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTE_PREFIXES } from "@/lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (!isProtected) return NextResponse.next();

  const hasSession =
    request.cookies.get("mantouji_auth")?.value === "1" ||
    request.headers.get("x-mantouji-auth") === "1";

  if (!hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/cooperative/:path*",
    "/dashboard/onssa/:path*",
    "/compte",
    "/compte/:path*",
  ],
};
