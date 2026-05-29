"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { getFeaturedCooperatives } from "@/lib/api";
import type { Cooperative } from "@/types/cooperative";

export function FeaturedCooperatives() {
  const [featured, setFeatured] = useState<Cooperative | null>(null);

  useEffect(() => {
    getFeaturedCooperatives(1)
      .then((list) => setFeatured(list[0] ?? null))
      .catch(() => setFeatured(null));
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  if (!featured) return null;

  return (
    <section ref={containerRef} className="bg-charcoal py-24 text-cream lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square w-full lg:aspect-[3/4] lg:w-1/2"
          >
            {featured.logoUrl ? (
              <ProductImage
                src={featured.logoUrl}
                alt={featured.nomCooperative}
                className="object-cover object-center opacity-90 grayscale-[30%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-sage/40 to-burgundy/30" />
            )}
            <div className="absolute inset-0 m-6 border border-cream/10 lg:m-12" />
          </motion.div>

          <div className="flex w-full flex-col justify-center lg:w-1/2 lg:pl-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 font-serif text-4xl leading-tight sm:text-5xl"
            >
              Celles et ceux qui <br />
              <span className="text-terracotta">façonnent la terre.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 max-w-lg text-lg font-light leading-relaxed text-cream/70"
            >
              Derrière chaque goutte d&apos;huile et chaque grain d&apos;épice, il y a des mains
              expertes. Nous mettons en lumière les coopératives rurales qui préservent le
              savoir-faire ancestral du Maroc avec passion et dignité.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-8 border-t border-cream/10 pt-8"
            >
              <div>
                <h4 className="mb-2 font-serif text-3xl text-terracotta">40+</h4>
                <span className="text-sm uppercase tracking-widest text-cream/50">
                  Coopératives partenaires
                </span>
              </div>
              <div>
                <h4 className="mb-2 font-serif text-3xl text-terracotta">12</h4>
                <span className="text-sm uppercase tracking-widest text-cream/50">
                  Régions marocaines
                </span>
              </div>
            </motion.div>

            <Link
              href="/cooperatives"
              className="mt-10 inline-flex border-b border-cream/30 pb-2 text-sm uppercase tracking-widest text-cream/80 transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Voir toutes les coopératives
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
