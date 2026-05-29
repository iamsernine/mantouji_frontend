"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { images } from "@/lib/images";
import { shouldBypassImageOptimizer } from "@/lib/media-url";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 32,
    restDelta: 0.0005,
  });
  const imageY = useTransform(smoothProgress, [0, 1], [0, 72]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1.06, 1]);
  const washOpacity = useTransform(smoothProgress, [0, 1], [0.65, 0.78]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-12 pt-24"
    >
      <div className="absolute inset-0 z-0 overflow-hidden [perspective:1200px]">
        <motion.div
          style={{ y: imageY, scale: imageScale }}
          className="absolute -left-[6%] top-0 h-full w-[110%] origin-top will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] sm:-left-[5%] sm:w-[108%]"
        >
          <Image
            src={images.hero.woman}
            alt="Artisane marocaine du terroir"
            fill
            className="object-cover object-[28%_top] sm:object-left sm:object-top"
            sizes="100vw"
            priority
            unoptimized={shouldBypassImageOptimizer(images.hero.woman)}
          />
        </motion.div>
        <motion.div
          style={{ opacity: washOpacity }}
          className="pointer-events-none absolute inset-0 z-[1] bg-white"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-cream/20 via-transparent to-cream"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 lg:px-12">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-full font-serif text-[10vw] leading-[1.05] tracking-tight text-burgundy text-balance sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            Découvrez le terroir marocain,{" "}
            <br className="hidden sm:block" />
            <span className="text-charcoal">raconté par ses coopératives.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-2xl text-lg font-light leading-relaxed text-charcoal/70 lg:text-2xl"
          >
            Au-delà du produit, une histoire d&apos;origine, d&apos;authenticité et de lien
            humain direct avec les artisans de notre terre.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <Link
              href="/produits"
              className="group flex w-full items-center justify-between bg-burgundy px-8 py-5 text-sm uppercase tracking-widest text-cream transition-colors duration-500 hover:bg-charcoal sm:w-auto sm:justify-start"
            >
              <span className="mr-8">Explorer les produits</span>
              <ArrowRight className="h-5 w-5 stroke-1 transition-transform duration-500 ease-out group-hover:translate-x-2" />
            </Link>
            <Link
              href="/cooperatives"
              className="group flex w-full items-center justify-between border border-burgundy/20 bg-transparent px-8 py-5 text-sm uppercase tracking-widest text-burgundy transition-colors duration-500 hover:border-burgundy sm:w-auto sm:justify-start"
            >
              <span className="mr-8">Découvrir les coopératives</span>
              <ArrowRight className="h-5 w-5 stroke-1 transition-transform duration-500 ease-out group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
