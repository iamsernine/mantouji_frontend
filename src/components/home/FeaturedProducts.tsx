"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductThumbnail } from "@/components/ui/product-thumbnail";
import { formatPrice } from "@/lib/utils";
import { getFeaturedProducts } from "@/lib/api";
import type { Produit } from "@/types/product";

const SCROLL_SPEED = 0.65;
const RESUME_AFTER_MS = 2500;

function ProductCard({
  product,
  index,
  isInView,
}: {
  product: Produit;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.2, delay: 0.2 + Math.min(index, 2) * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group w-[min(85vw,300px)] shrink-0 snap-start flex-none cursor-pointer flex-col sm:w-[300px] lg:w-[340px]"
    >
      <Link href={`/produits/${product.id}`} className="flex flex-col">
        <div className="mb-6 flex justify-center">
          <ProductThumbnail
            produit={product}
            size="lg"
            className="h-32 w-32 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-sage">
            {product.cooperative.nomCooperative}
          </span>
          <h3 className="font-serif text-2xl text-charcoal transition-colors group-hover:text-burgundy lg:text-3xl">
            {product.nom}
          </h3>
          <p className="mt-2 max-w-sm font-light text-charcoal/60 line-clamp-2">
            {product.description}
          </p>
          <p className="mt-1 text-sm font-medium text-burgundy">
            {formatPrice(product.prix)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Produit[]>([]);

  useEffect(() => {
    getFeaturedProducts(10).then(setProducts).catch(() => setProducts([]));
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const autoScrollingRef = useRef(false);
  const inViewRef = useRef(false);
  const isInView = useInView(containerRef, { once: false, margin: "-5%" });

  const carouselItems = useMemo(
    () => [...products, ...products],
    [products]
  );

  useEffect(() => {
    inViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let raf = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastScrollLeft = el.scrollLeft;

    const pauseAuto = () => {
      pausedRef.current = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        pausedRef.current = false;
      }, RESUME_AFTER_MS);
    };

    const onScroll = () => {
      if (autoScrollingRef.current) {
        lastScrollLeft = el.scrollLeft;
        return;
      }
      if (Math.abs(el.scrollLeft - lastScrollLeft) > 1) {
        pauseAuto();
      }
      lastScrollLeft = el.scrollLeft;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", pauseAuto, { passive: true });
    el.addEventListener("touchstart", pauseAuto, { passive: true });
    el.addEventListener("pointerdown", pauseAuto);

    const tick = () => {
      if (inViewRef.current && !pausedRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 2) {
          autoScrollingRef.current = true;
          el.scrollLeft += SCROLL_SPEED;
          const loopAt = el.scrollWidth / 2;
          if (el.scrollLeft >= loopAt) {
            el.scrollLeft -= loopAt;
          }
          autoScrollingRef.current = false;
          lastScrollLeft = el.scrollLeft;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", pauseAuto);
      el.removeEventListener("touchstart", pauseAuto);
      el.removeEventListener("pointerdown", pauseAuto);
    };
  }, [products.length]);

  return (
    <section ref={containerRef} className="w-full max-w-full bg-cream py-24 lg:py-40">
      <div className="mx-auto mb-16 flex max-w-7xl flex-col justify-between px-6 lg:mb-32 lg:flex-row lg:items-end lg:px-12">
        <div className="lg:w-1/2">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 font-serif text-4xl text-burgundy sm:text-5xl lg:text-6xl"
          >
            Trésors du terroir.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-lg font-light text-charcoal/70"
          >
            Une sélection minutieuse des plus belles richesses que la nature marocaine nous offre.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <Link
            href="/produits"
            className="group flex items-center border-b border-charcoal/20 pb-2 text-charcoal transition-colors hover:border-burgundy hover:text-burgundy"
          >
            <span className="mr-4 text-sm uppercase tracking-widest">Voir tout le catalogue</span>
            <ArrowRight className="h-4 w-4 stroke-1 transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="w-full max-w-full touch-pan-x overflow-x-auto overscroll-x-contain hide-scrollbars snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
      >
        <div className="flex w-max flex-nowrap gap-8 px-6 pb-12 lg:gap-12 lg:px-12">
          {carouselItems.map((product, i) => (
            <ProductCard
              key={`${product.id}-${i}`}
              product={product}
              index={i % products.length}
              isInView={isInView}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 px-6 lg:hidden">
        <Link
          href="/produits"
          className="group inline-flex items-center border-b border-charcoal/20 pb-2"
        >
          <span className="mr-4 text-sm uppercase tracking-widest">Voir tout</span>
          <ArrowRight className="h-4 w-4 stroke-1 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
}
