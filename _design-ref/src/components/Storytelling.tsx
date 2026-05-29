import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={containerRef} className="py-32 lg:py-48 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        <div className="w-full relative h-[60vh] lg:h-[80vh] overflow-hidden">
          <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
            <img 
              src="https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&q=80&w=2000" 
              alt="Artisan at work" 
              className="w-full h-full object-cover grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-brand-charcoal/20" />
          </motion.div>
        </div>

        <motion.div 
          style={{ y: textY }}
          className="relative z-10 w-full lg:w-3/4 bg-brand-offwhite p-8 lg:p-16 -mt-32 lg:-mt-48 ml-auto lg:mr-0 shadow-2xl opacity-95"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl lg:leading-tight text-brand-burgundy mb-8">
            « Le client n’achète pas seulement un produit, il découvre une histoire. »
          </h2>
          <p className="text-brand-charcoal/70 text-lg lg:text-xl font-light leading-relaxed mb-8">
            Chaque goutte d’huile, chaque flacon de miel, chaque épice raconte le parcours d’hommes et de femmes liés à leur terre. C'est l'héritage d'une nature généreuse et d'un travail patiemment accompli.
          </p>
          <div className="w-16 h-[1px] bg-brand-burgundy/40" />
        </motion.div>

      </div>
    </section>
  );
}
