"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/utils";
import type { Media } from "@/types/product";

type ProductGalleryProps = {
  medias: Media[];
  alt?: string;
  /** Showcase: ~2.5× default carousel, responsive per breakpoint */
  variant?: "default" | "showcase";
};

export function ProductGallery({
  medias,
  alt = "Produit",
  variant = "default",
}: ProductGalleryProps) {
  const isShowcase = variant === "showcase";
  const images = medias.filter((m) => m.type === "image").slice(0, 3);
  const [active, setActive] = useState(0);
  const count = images.length;
  const current = images[active];

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setActive((i) => (i + delta + count) % count);
    },
    [count]
  );

  const singleShell = cn(
    "relative w-full overflow-hidden rounded-2xl bg-sand",
    isShowcase
      ? [
          "aspect-[4/5] min-h-[min(100vw,28rem)]",
          "sm:min-h-[26rem] sm:aspect-square",
          "md:min-h-[32rem]",
          "lg:min-h-[36rem] xl:min-h-[40rem]",
        ]
      : "mx-auto aspect-square max-w-md"
  );

  const imageSizes = isShowcase
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 50vw"
    : "(max-width: 768px) 100vw, 28rem";

  if (!count) {
    return (
      <div className={singleShell}>
        <ProductImage src="" alt={alt} sizes={imageSizes} priority className="object-cover" />
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className={singleShell}>
        <ProductImage
          src={images[0].url}
          alt={images[0].alt ?? alt}
          sizes={imageSizes}
          priority
          className="object-cover"
        />
      </div>
    );
  }

  const prev = (active - 1 + count) % count;
  const next = (active + 1) % count;

  const trackMinH = isShowcase
    ? "min-h-[min(88vw,26rem)] sm:min-h-[28rem] md:min-h-[32rem] lg:min-h-[36rem] xl:min-h-[40rem]"
    : "";

  const centerSlide = isShowcase
    ? cn(
        "relative aspect-square shrink-0 overflow-hidden rounded-2xl bg-sand shadow-lg ring-2 ring-burgundy/25",
        "w-[58%] min-w-[11.5rem] max-w-[35rem]",
        "sm:w-[54%] sm:min-w-[16rem]",
        "md:w-[50%] md:min-w-[18rem]",
        "lg:w-[48%] lg:min-w-[20rem] xl:min-w-[22rem]"
      )
    : "relative aspect-square w-[48%] max-w-[14rem] shrink-0 overflow-hidden rounded-2xl bg-sand shadow-md ring-2 ring-burgundy/20";

  const sideSlide = isShowcase
    ? cn(
        "relative aspect-square shrink-0 overflow-hidden rounded-xl opacity-80 transition hover:opacity-100",
        "w-[20%] min-w-[3.25rem] max-w-[13.75rem]",
        "sm:w-[21%] sm:min-w-[4rem] md:min-w-[5rem] lg:min-w-[6rem]"
      )
    : "relative aspect-square w-[22%] max-w-[5.5rem] shrink-0 overflow-hidden rounded-xl opacity-75 transition hover:opacity-100";

  const navBtn = isShowcase
    ? "h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
    : "h-10 w-10";

  const navIcon = isShowcase ? "h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" : "h-5 w-5";

  const padX = isShowcase
    ? "px-11 sm:px-14 md:px-16 lg:px-[4.5rem] xl:px-20"
    : "px-12 sm:px-14";

  const gap = isShowcase ? "gap-1.5 sm:gap-3 md:gap-4" : "gap-2 sm:gap-3";

  const centerSizes = isShowcase
    ? "(max-width: 480px) 58vw, (max-width: 768px) 54vw, (max-width: 1280px) 42vw, 560px"
    : "(max-width: 768px) 50vw, 14rem";

  const sideSizes = isShowcase
    ? "(max-width: 480px) 20vw, (max-width: 1024px) 22vw, 220px"
    : "88px";

  return (
    <div
      className={cn(
        "w-full",
        isShowcase ? "max-w-none" : "mx-auto max-w-lg"
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Photos de ${alt}`}
    >
      <div className={cn("relative flex items-center justify-center", trackMinH)}>
        <button
          type="button"
          onClick={() => go(-1)}
          className={cn(
            "absolute left-0 z-20 flex items-center justify-center rounded-full border border-charcoal/10 bg-cream/95 text-charcoal shadow-md transition hover:bg-white active:scale-95",
            navBtn,
            isShowcase && "-left-0.5 sm:left-0"
          )}
          aria-label="Image précédente"
        >
          <ChevronLeft className={navIcon} />
        </button>

        <div className={cn("flex w-full items-center justify-center", gap, padX)}>
          <button
            type="button"
            onClick={() => setActive(prev)}
            className={sideSlide}
            aria-label={`Voir image ${prev + 1}`}
          >
            <ProductImage
              src={images[prev].url}
              alt={images[prev].alt ?? alt}
              sizes={sideSizes}
              className="object-cover"
            />
          </button>

          <div className={centerSlide}>
            <ProductImage
              src={current?.url ?? ""}
              alt={current?.alt ?? alt}
              sizes={centerSizes}
              priority
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={() => setActive(next)}
            className={sideSlide}
            aria-label={`Voir image ${next + 1}`}
          >
            <ProductImage
              src={images[next].url}
              alt={images[next].alt ?? alt}
              sizes={sideSizes}
              className="object-cover"
            />
          </button>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className={cn(
            "absolute right-0 z-20 flex items-center justify-center rounded-full border border-charcoal/10 bg-cream/95 text-charcoal shadow-md transition hover:bg-white active:scale-95",
            navBtn,
            isShowcase && "-right-0.5 sm:right-0"
          )}
          aria-label="Image suivante"
        >
          <ChevronRight className={navIcon} />
        </button>
      </div>

      <div
        className={cn(
          "mt-4 flex justify-center gap-2 sm:mt-5 sm:gap-2.5",
          isShowcase && "md:mt-6"
        )}
      >
        {images.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full transition-colors",
              isShowcase ? "h-2.5 w-2.5 sm:h-3 sm:w-3" : "h-2 w-2",
              i === active ? "bg-burgundy scale-110" : "bg-charcoal/25 hover:bg-charcoal/40"
            )}
            aria-label={`Image ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
          />
        ))}
      </div>

      {isShowcase ? (
        <p className="mt-2 text-center text-xs text-charcoal/45 sm:hidden">
          Balayez ou utilisez les flèches pour voir les photos
        </p>
      ) : null}
    </div>
  );
}
