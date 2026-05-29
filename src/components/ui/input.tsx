import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-base text-charcoal placeholder:text-charcoal/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
