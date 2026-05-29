"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const trustItems = [
  {
    title: "Produits certifiés",
    description:
      "Une authenticité garantie, respectant les normes de qualité les plus strictes du terroir.",
  },
  {
    title: "Coopératives locales",
    description:
      "Un réseau d'artisans dévoués, préservant un savoir-faire ancestral avec passion.",
  },
  {
    title: "Contact direct WhatsApp",
    description:
      "Aucun intermédiaire. Un lien humain et transparent entre vous et la coopérative.",
  },
  {
    title: "Traçabilité totale",
    description:
      "Découvrez l'origine exacte, la région, et les mains derrière chaque création.",
  },
];

export function TrustSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  return (
    <section ref={containerRef} className="bg-sand/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-16 lg:flex-row lg:items-start lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/3"
          >
            <h2 className="font-serif text-3xl leading-tight text-burgundy md:text-4xl">
              L&apos;essence même de notre engagement.
            </h2>
            <p className="mt-6 text-lg font-light text-charcoal/70">
              Mantouji n&apos;est pas une simple plateforme. C&apos;est une promesse faite aux
              artisans et à vous.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:w-2/3 lg:gap-16">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 1,
                  delay: 0.2 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="mb-6 h-px w-12 bg-burgundy/30" />
                <h3 className="mb-4 text-xl font-medium text-charcoal">{item.title}</h3>
                <p className="font-light leading-relaxed text-charcoal/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
