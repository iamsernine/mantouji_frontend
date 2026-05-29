import { ProductImage } from "@/components/ui/product-image";
import { getProductImage } from "@/lib/product-media";
import { cn } from "@/lib/utils";
import type { Produit } from "@/types/product";

const SIZE_CLASS = {
  xs: "h-14 w-14",
  sm: "h-16 w-16",
  md: "h-20 w-20",
  lg: "h-24 w-24",
} as const;

type ProductThumbnailProps = {
  produit: Pick<Produit, "nom" | "medias">;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  priority?: boolean;
};

/** Small square product image used in lists and cards. */
export function ProductThumbnail({
  produit,
  size = "md",
  className,
  priority,
}: ProductThumbnailProps) {
  const { src, alt } = getProductImage(produit);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg bg-sand/50",
        SIZE_CLASS[size],
        className
      )}
    >
      <ProductImage
        src={src}
        alt={alt}
        sizes="96px"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
