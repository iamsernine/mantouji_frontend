/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Trust } from './components/Trust';
import { Storytelling } from './components/Storytelling';
import { Products } from './components/Products';
import { Cooperatives } from './components/Cooperatives';
import { Footer } from './components/Footer';
import { MessageCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="bg-brand-offwhite min-h-screen text-brand-charcoal font-sans selection:bg-brand-sage selection:text-white">
      <Navigation />
      
      <main>
        <Hero />
        <Trust />
        <Storytelling />
        <Products />
        <Cooperatives />
      </main>

      <Footer />

      {/* Floating WhatsApp Mobile CTA */}
      <a 
        href="#"
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}
