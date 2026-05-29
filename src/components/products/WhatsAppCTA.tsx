import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppCTAProps = {
  phone: string;
  productName?: string;
  className?: string;
  sticky?: boolean;
  size?: "default" | "lg";
  label?: string;
};

export function WhatsAppCTA({
  phone,
  productName,
  className,
  sticky = false,
  size = "default",
  label = "Contacter via WhatsApp",
}: WhatsAppCTAProps) {
  const href = generateWhatsAppLink(phone, productName);

  return (
    <div
      className={cn(
        sticky &&
          "fixed bottom-20 left-0 right-0 z-40 border-t border-charcoal/10 bg-white/95 px-4 py-3 backdrop-blur-md lg:static lg:border-0 lg:bg-transparent lg:p-0",
        className
      )}
    >
      <Button
        variant="whatsapp"
        size={size === "lg" ? "lg" : "default"}
        className="w-full"
        asChild
      >
        <Link href={href} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5" />
          {label}
        </Link>
      </Button>
    </div>
  );
}
