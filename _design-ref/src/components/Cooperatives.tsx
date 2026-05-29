import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function Cooperatives() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  return (
    <section ref={containerRef} className="py-24 lg:py-40 bg-brand-charcoal text-brand-offwhite">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative aspect-square lg:aspect-[3/4]"
          >
            <img 
              src="https://images.unsplash.com/photo-1541447237128-f4cac6138fbe?auto=format&fit=crop&q=80&w=1200" 
              alt="Artisan marocaine" 
              className="w-full h-full object-cover object-center grayscale-[30%] opacity-90"
            />
            <div className="absolute inset-0 border border-brand-offwhite/10 m-6 lg:m-12" />
          </motion.div>

          <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col justify-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-5xl leading-tight mb-8"
            >
              Celles et ceux qui <br/>
              <span className="text-brand-terracotta">façonnent la terre.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-brand-offwhite/70 font-light leading-relaxed mb-10 max-w-lg"
            >
              Derrière chaque goutte d'huile et chaque grain d'épice, il y a des mains expertes. Nous mettons en lumière les coopératives rurales qui préservent le savoir-faire ancestral du Maroc avec passion et dignité.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-8 pt-8 border-t border-brand-offwhite/10"
            >
              <div>
                <h4 className="text-brand-terracotta font-serif text-3xl mb-2">56</h4>
                <span className="text-sm uppercase tracking-widest text-brand-offwhite/50">Coopératives partenaires</span>
              </div>
              <div>
                <h4 className="text-brand-terracotta font-serif text-3xl mb-2">12</h4>
                <span className="text-sm uppercase tracking-widest text-brand-offwhite/50">Régions marocaines</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
