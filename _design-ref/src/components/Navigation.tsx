import { motion } from 'motion/react';
import { Menu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-brand-offwhite/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
        <button className="text-brand-charcoal hover:text-brand-burgundy transition-colors">
          <Menu className="w-6 h-6 stroke-1" />
        </button>
        
        <div className="font-serif text-2xl lg:text-3xl font-medium tracking-tight text-brand-charcoal">
          Mantouji.
        </div>

        <button className="text-brand-charcoal hover:text-brand-burgundy transition-colors">
          <Search className="w-6 h-6 stroke-1" />
        </button>
      </div>
    </motion.nav>
  );
}
