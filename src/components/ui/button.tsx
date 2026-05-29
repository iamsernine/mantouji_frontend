import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-6",
  {
    variants: {
      variant: {
        default: "bg-burgundy text-cream hover:bg-charcoal",
        secondary: "bg-sage text-cream hover:bg-sage-dark",
        outline:
          "border border-charcoal/20 bg-transparent text-charcoal hover:border-burgundy hover:text-burgundy",
        ghost: "hover:bg-sand/80 text-charcoal",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1da851] rounded-full",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-sm min-h-9",
        lg: "h-12 px-8 text-lg min-h-12",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
