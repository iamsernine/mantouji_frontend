"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { isProtectedPath } from "@/lib/routes";

/** Redirect visitors away from authenticated-only routes. */
export function ProtectedRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (isProtectedPath(pathname) && !user) {
      const login = `/login?next=${encodeURIComponent(pathname)}`;
      router.replace(login);
    }
  }, [ready, user, pathname, router]);

  return null;
}
