import Image from "next/image";
import { logos } from "@/lib/brand";
import { cn } from "@/lib/utils";

const sizes = {
  nav: {
    clip: "h-10 w-[7.25rem] sm:h-11 sm:w-[8.25rem] md:h-12 md:w-36",
    img: "h-8 w-8 max-w-none origin-center scale-[2.55] sm:scale-[2.85] md:h-9 md:w-9 md:scale-[3.1]",
  },
  footer: {
    clip: "h-14 w-[9.5rem] sm:h-16 sm:w-[11rem] md:h-[4.5rem] md:w-[13rem]",
    img: "h-10 w-10 max-w-none origin-center scale-[3.15] sm:scale-[3.45] md:h-11 md:w-11 md:scale-[3.75]",
  },
} as const;

export function BrandLogo({
  className,
  clipClassName,
  priority = false,
  size = "nav",
  color,
}: {
  className?: string;
  clipClassName?: string;
  priority?: boolean;
  size?: keyof typeof sizes;
  color?: keyof typeof logos;
}) {
  const s = sizes[size];
  const src = logos[color ?? (size === "footer" ? "fullcolor" : "black")];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        s.clip,
        clipClassName
      )}
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        width={512}
        height={512}
        className={cn(s.img, className)}
        priority={priority}
        aria-hidden
      />
    </span>
  );
}
