'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function ComponentsPreview() {
  const { ref: containerRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const components = [
    {
      title: 'Hero Section',
      description: 'Sección hero moderna con animaciones avanzadas, header responsive y componentes visuales impactantes',
      href: '/hero',
      color: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Componentes Animados',
      description: 'Galería interactiva con AnimatedGroup, TextEffect y más presets de animaciones profesionales',
      href: '/components-demo',
      color: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <section 
      ref={containerRef}
      id="componentes" 
      className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
              ✨ Nuevos Componentes
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Componentes Animados Modernos
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explora nuestros nuevos componentes con animaciones profesionales y diseño responsivo. 
            Construidos con Framer Motion, Tailwind CSS y las mejores prácticas de React.
          </p>
        </motion.div>

        {/* Components Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {components.map((component, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl border ${component.borderColor} bg-gradient-to-br ${component.color} p-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30`}
            >
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4 inline-flex p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors duration-300">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {component.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {component.description}
                </p>

                {/* Link */}
                <Link href={component.href}>
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 group/link cursor-pointer"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Ver Componente
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                </Link>
              </div>

              {/* Border gradient effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¡Descubre nuestros componentes animados!
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Componentes modernos, responsive y totalmente personalizables. 
            Diseñados para mejorar la experiencia del usuario.
          </p>
          <Link href="/components-demo">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar Galería Completa
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
