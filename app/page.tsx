'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/blocks/hero-section-1';
import About from './components/home/About';
import Careers from './components/home/Careers';
import Testimonials from './components/home/Testimonials';
import Contact from './components/home/Contact';
import WhatsAppFloat from './components/shared/WhatsAppFloat';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: {
    opacity: 1,
    y: 0,
    transitionEnd: {
      transform: "none"
    }
  },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  ease: "easeInOut",
  duration: 0.25
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-azul-petroleo via-azul-celeste to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-azul-celeste border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
            className="text-2xl font-bold text-azul-petroleo mb-2"
          >
            ESPeak
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.25 }}
            className="text-azul-petroleo/70"
          >
            Preparándote para el éxito global...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="min-h-screen flex flex-col"
      >
        <main className="flex-grow">
          {/* ========== HERO SECTION ========== */}
          <section id="inicio">
            <HeroSection />
          </section>

          {/* ========== EXISTING SECTIONS ========== */}
          <section id="carreras">
            <Careers />
          </section>
          <section id="quienes-somos">
            <About />
          </section>
          <section id="testimonios">
            <Testimonials />
          </section>
          <section id="contacto">
            <Contact />
          </section>
          <WhatsAppFloat />
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
