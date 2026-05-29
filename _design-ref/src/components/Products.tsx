import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Huile d'Argan Torréfiée",
    coop: "Coopérative Tighanimine",
    image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=1200",
    desc: "Un nectar précieux aux notes de noisette, extrait à froid au sud du Maroc."
  },
  {
    id: 2,
    name: "Safran Pur de Taliouine",
    coop: "Coopérative Souktana",
    image: "https://images.unsplash.com/photo-1615485900891-b38662908f9d?auto=format&fit=crop&q=80&w=1200",
    desc: "L'or rouge récolté à la main aux premières lueurs de l'aube."
  },
  {
    id: 3,
    name: "Dattes Majhoul Premium",
    coop: "Coopérative Oasis de Tafilalet",
    image: "https://images.unsplash.com/photo-1596431520626-d667c1e550e5?auto=format&fit=crop&q=80&w=1200",
    desc: "Tendres et fondantes, mûries sous le soleil brûlant du désert."
  }
];

export function Products() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <section ref={containerRef} className="py-24 lg:py-40 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-32">
        <div className="lg:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-burgundy mb-6"
          >
            Trésors du terroir.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-brand-charcoal/70 font-light max-w-md"
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
            <button className="flex items-center text-brand-charcoal hover:text-brand-burgundy transition-colors group pb-2 border-b border-brand-charcoal/20 hover:border-brand-burgundy">
                <span className="mr-4 uppercase tracking-widest text-sm">Voir tout le catalogue</span>
                <ArrowRight className="w-4 h-4 stroke-1 group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
      </div>

      <div className="w-full flex overflow-x-auto lg:grid lg:grid-cols-3 gap-8 lg:gap-12 px-6 lg:px-12 pb-12 snap-x snap-mandatory hide-scrollbars -mx-6 lg:mx-auto max-w-7xl">
        {products.map((product, i) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-[85vw] sm:min-w-[60vw] lg:min-w-0 snap-start group cursor-pointer flex flex-col"
          >
            <div className="w-full aspect-[4/5] overflow-hidden mb-8 relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/10 transition-colors duration-700" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-brand-sage font-medium">
                {product.coop}
              </span>
              <h3 className="font-serif text-2xl lg:text-3xl text-brand-charcoal group-hover:text-brand-burgundy transition-colors">
                {product.name}
              </h3>
              <p className="text-brand-charcoal/60 font-light mt-2 max-w-sm">
                {product.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="px-6 mt-8 sm:mt-12 lg:hidden">
          <button className="flex items-center text-brand-charcoal group pb-2 border-b border-brand-charcoal/20">
              <span className="mr-4 uppercase tracking-widest text-sm">Voir tout</span>
              <ArrowRight className="w-4 h-4 stroke-1 group-hover:translate-x-2 transition-transform" />
          </button>
      </div>
    </section>
  );
}
