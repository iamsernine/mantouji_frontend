"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { images } from "@/lib/images";
import { shouldBypassImageOptimizer } from "@/lib/media-url";

export function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={containerRef} className="relative overflow-hidden py-32 lg:py-48">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 lg:px-12">
        <div className="relative h-[60vh] w-full overflow-hidden lg:h-[80vh]">
          <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[20%] h-[140%] w-full">
            <Image
              src={images.hero.story}
              alt="Artisan du terroir marocain"
              fill
              className="object-cover grayscale-[20%]"
              sizes="100vw"
              unoptimized={shouldBypassImageOptimizer(images.hero.story)}
            />
            <div className="absolute inset-0 bg-charcoal/20" />
          </motion.div>
        </div>

        <motion.div
          style={{ y: textY }}
          className="relative z-10 -mt-32 ml-auto w-full bg-cream/95 p-8 lg:-mt-48 lg:mr-0 lg:w-3/4 lg:p-16"
        >
          <h2 className="mb-8 font-serif text-3xl text-burgundy sm:text-4xl lg:text-5xl lg:leading-tight">
            « Le client n&apos;achète pas seulement un produit, il découvre une histoire. »
          </h2>
          <p className="mb-8 text-lg font-light leading-relaxed text-charcoal/70 lg:text-xl">
            Chaque goutte d&apos;huile, chaque flacon de miel, chaque épice raconte le parcours
            d&apos;hommes et de femmes liés à leur terre. C&apos;est l&apos;héritage d&apos;une
            nature généreuse et d&apos;un travail patiemment accompli.
          </p>
          <div className="h-px w-16 bg-burgundy/40" />
        </motion.div>
      </div>
    </section>
  );
}
