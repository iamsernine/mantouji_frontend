"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { userDisplayInitials } from "@/lib/user-account";
import { shouldBypassImageOptimizer } from "@/lib/media-url";

export function UserAvatarDisplay({
  nom,
  avatarUrl,
  size = "lg",
  className,
}: {
  nom: string;
  avatarUrl?: string | null;
  size?: "md" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? "h-24 w-24 text-2xl" : "h-16 w-16 text-lg";
  const px = size === "lg" ? 96 : 64;

  if (avatarUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-2 border-white bg-sand shadow-md",
          dim,
          className
        )}
      >
        <Image
          src={avatarUrl}
          alt={nom}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          unoptimized={shouldBypassImageOptimizer(avatarUrl)}
        />
      </div>
    );
  }

  const initials = userDisplayInitials(nom);
  if (initials && initials !== "?") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border-2 border-white bg-burgundy/10 font-semibold text-burgundy shadow-md",
          dim,
          className
        )}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border-2 border-white bg-sand text-charcoal/40 shadow-md",
        dim,
        className
      )}
      aria-hidden
    >
      <User className={size === "lg" ? "h-10 w-10" : "h-7 w-7"} />
    </div>
  );
}
