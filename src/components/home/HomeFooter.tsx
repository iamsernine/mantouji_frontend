"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { FooterLinks } from "@/components/layout/FooterLinks";
import { LayeredPattern } from "@/components/ui/layered-pattern";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function HomeFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  const whatsappHref = generateWhatsAppLink("212600000000", "Bonjour Mantouji");

  return (
    <footer
      ref={containerRef}
      className="relative flex w-full max-w-full flex-col justify-between overflow-x-clip bg-sand"
    >
      {/* CTA — pattern + white filter underneath copy */}
      <div className="relative min-h-[50vh] overflow-hidden lg:min-h-[55vh]">
        <LayeredPattern whiteOverlay />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-20 pt-32 lg:px-12 lg:pt-48">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className="mb-8 block text-sm font-medium uppercase tracking-widest text-sage">
              Prêt à goûter l&apos;authenticité ?
            </span>
            <h2 className="mb-12 max-w-full font-serif text-4xl leading-[1.05] tracking-tight text-burgundy text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              Passez commande directement{" "}
              <br className="hidden sm:block" />
              <span className="text-charcoal italic">sans intermédiaire.</span>
            </h2>

            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full max-w-full items-center justify-between bg-charcoal px-6 py-5 text-sm uppercase tracking-widest text-cream transition-colors duration-500 hover:bg-burgundy sm:w-auto sm:px-10 sm:py-6"
            >
              <span className="mr-4 sm:mr-8">Contacter sur WhatsApp</span>
              <ArrowRight className="h-5 w-5 shrink-0 stroke-1 transition-transform duration-500 ease-out group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer links — pattern + same white filter as CTA */}
      <div className="relative overflow-hidden">
        <LayeredPattern whiteOverlay />
        <div className="relative z-10 mx-auto w-full max-w-full px-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:max-w-7xl md:pb-14 lg:px-12">
          <div className="w-full min-w-0 border-t border-charcoal/10 pt-10">
            <div className="flex w-full min-w-0 max-w-full flex-row items-start justify-between gap-4">
              <FooterLinks className="min-w-0 flex-1" />
              <Link
                href="/"
                aria-label="Mantouji — accueil"
                className="shrink-0 self-start"
              >
                <BrandLogo size="footer" color="fullcolor" />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-xs text-charcoal/40">
            © {new Date().getFullYear()} Mantouji. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
