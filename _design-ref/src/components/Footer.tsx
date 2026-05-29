import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <footer ref={containerRef} className="relative bg-brand-sand min-h-[80vh] flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03]">
         {/* Subtle texture or large watermark could go here */}
         <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-charcoal)_1px,_transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 lg:pt-48 pb-20 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <span className="text-sm uppercase tracking-widest text-brand-sage font-medium mb-8 block">
            Prêt à goûter l'authenticité ?
          </span>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-brand-burgundy mb-12">
            Passez commande directement <br className="hidden lg:block"/>
            <span className="text-brand-charcoal italic">sans intermédiaire.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="group flex items-center justify-between sm:justify-start w-full sm:w-auto px-10 py-6 bg-brand-charcoal text-brand-offwhite text-sm uppercase tracking-widest hover:bg-brand-burgundy transition-colors duration-500">
              <span className="mr-8">Contacter sur WhatsApp</span>
              <ArrowRight className="w-5 h-5 stroke-1 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-0">
        <div className="font-serif text-3xl font-medium tracking-tight text-brand-charcoal">
          Mantouji.
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 lg:gap-16 text-sm text-brand-charcoal/60 uppercase tracking-widest">
          <a href="#" className="hover:text-brand-burgundy transition-colors">Instagram</a>
          <a href="#" className="hover:text-brand-burgundy transition-colors">Notre Histoire</a>
          <a href="#" className="hover:text-brand-burgundy transition-colors">Coopératives</a>
          <a href="#" className="hover:text-brand-burgundy transition-colors">Mentions Légales</a>
        </div>
      </div>
    </footer>
  );
}
