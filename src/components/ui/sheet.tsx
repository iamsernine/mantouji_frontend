"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

type SheetSide = "bottom" | "right" | "responsive";

const sheetSideClasses: Record<SheetSide, string> = {
  bottom:
    "inset-x-0 bottom-0 max-h-[90vh] w-full rounded-t-3xl border-t border-charcoal/10",
  right:
    "inset-y-0 right-0 left-auto h-full w-full max-h-none max-w-lg rounded-none border-l border-charcoal/10",
  responsive:
    "inset-x-0 bottom-0 max-h-[90vh] w-full rounded-t-3xl border-t border-charcoal/10 lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:left-auto lg:bottom-0 lg:top-0 lg:h-full lg:max-h-none lg:w-[min(100%,36rem)] lg:rounded-none lg:rounded-t-none lg:border-l lg:border-t-0 xl:w-[min(100%,42rem)]",
};

type SheetContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  side?: SheetSide;
  showHandle?: boolean;
};

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, side = "bottom", showHandle, ...props }, ref) => {
  const handleVisible =
    showHandle ?? (side === "bottom" || side === "responsive");

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-cream p-6 shadow-2xl outline-none",
          sheetSideClasses[side],
          className
        )}
        {...props}
      >
        {handleVisible && (
          <div
            className={cn(
              "mx-auto mb-4 h-1 w-12 shrink-0 rounded-full bg-charcoal/20",
              side === "responsive" && "lg:hidden"
            )}
            aria-hidden
          />
        )}
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 hover:bg-sand">
          <X className="h-5 w-5" />
          <span className="sr-only">Fermer</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex shrink-0 flex-col gap-1 pr-10", className)} {...props} />
);

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-serif text-xl font-semibold text-charcoal", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-charcoal/60", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};
