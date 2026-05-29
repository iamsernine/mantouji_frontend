"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { shouldBypassImageOptimizer } from "@/lib/media-url";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function ImageFallback({
  className,
  width,
  height,
  fill,
  alt,
}: {
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  alt: string;
}) {
  const boxClass = cn(
    "flex items-center justify-center bg-gradient-to-br from-sand via-cream to-sage-light",
    fill ? "absolute inset-0" : "",
    className
  );

  if (!fill && width && height) {
    return (
      <div className={boxClass} style={{ width, height }} role="img" aria-label={alt}>
        <ImageIcon className="h-8 w-8 text-muted/30" />
      </div>
    );
  }

  return (
    <div className={boxClass} aria-hidden>
      <ImageIcon className="h-8 w-8 text-muted/30" />
    </div>
  );
}

export function ProductImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className,
  sizes = "100vw",
  priority = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const effectiveSrc = src?.trim() ?? "";

  if (!effectiveSrc || failed) {
    return (
      <ImageFallback
        className={className}
        width={width}
        height={height}
        fill={fill}
        alt={alt}
      />
    );
  }

  const unoptimized = shouldBypassImageOptimizer(effectiveSrc);

  if (!fill && width && height) {
    return (
      <Image
        src={effectiveSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        onError={() => setFailed(true)}
        priority={priority}
        unoptimized={unoptimized}
      />
    );
  }

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      unoptimized={unoptimized}
    />
  );
}
