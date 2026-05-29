import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex items-center pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y, opacity }} className="w-full h-[120%] -top-[10%] relative">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=2000" 
            alt="Paysage marocain" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-offwhite/40 via-brand-offwhite/80 to-brand-offwhite" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-[11vw] sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-brand-burgundy mb-8">
              Découvrez le terroir marocain, <br className="hidden sm:block" />
              <span className="text-brand-charcoal">raconté par ses coopératives.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg lg:text-2xl text-brand-charcoal/70 max-w-2xl font-light leading-relaxed mb-12"
          >
            Au-delà du produit, une histoire d'origine, d'authenticité et de lien humain direct avec les artisans de notre terre.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center w-full"
          >
            <button className="group flex items-center justify-between sm:justify-start w-full sm:w-auto px-8 py-5 bg-brand-burgundy text-brand-offwhite text-sm uppercase tracking-widest hover:bg-brand-charcoal transition-colors duration-500">
              <span className="mr-8">Explorer les produits</span>
              <ArrowRight className="w-5 h-5 stroke-1 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
            </button>
            <button className="group flex items-center justify-between sm:justify-start w-full sm:w-auto px-8 py-5 bg-transparent text-brand-burgundy text-sm uppercase tracking-widest border border-brand-burgundy/20 hover:border-brand-burgundy transition-colors duration-500">
              <span className="mr-8">Découvrir les coopératives</span>
              <ArrowRight className="w-5 h-5 stroke-1 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
