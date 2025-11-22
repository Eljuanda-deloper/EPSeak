'use client';

import { motion } from 'framer-motion';
import { useHeroAnimations } from '@/lib/hooks';

/**
 * Componente de demostración de los custom hooks
 * Muestra cómo usar las variantes de animación
 */
export function AnimationShowcase() {
  const animations = useHeroAnimations();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Demostración de Animaciones
        </motion.h2>

        {/* Lesson Enter Variants */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-8">
            Entrada de Lecciones
          </h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={animations.lessonEnterVariants}
                className="bg-gradient-to-br from-epseak-blue to-epseak-purple p-8 rounded-lg text-white shadow-lg"
              >
                <h4 className="text-lg font-semibold mb-2">Lección {i + 1}</h4>
                <p className="text-sm opacity-90">
                  Efecto blur + escala con delay personalizado
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Vocabulary Reveal Variants */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-8">
            Revelación de Vocabulario
          </h3>
          <motion.div
            className="flex flex-wrap gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {['Technology', 'Innovation', 'Learning', 'English', 'Future'].map(
              (word, i) => (
                <motion.div
                  key={word}
                  custom={i}
                  variants={animations.vocabularyRevealVariants}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-medium cursor-pointer"
                  whileHover="hover"
                >
                  {word}
                </motion.div>
              )
            )}
          </motion.div>
        </div>

        {/* Progress Indicator Variants */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-8">
            Indicadores de Progreso
          </h3>
          <motion.div
            className="flex gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={animations.progressIndicatorVariants}
                className="w-12 h-12 bg-epseak-blue rounded-full flex items-center justify-center text-white font-bold"
              >
                {i + 1}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Cascade Fade Variants */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-8">
            Efecto Cascada
          </h3>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={animations.cascadeFadeVariants}
                className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md"
              >
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Característica {i + 1}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Animación con escala y opacidad en cascada
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Pulse Variants */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-8">
            Efecto Pulsación (CTA)
          </h3>
          <motion.div
            className="flex justify-center"
            initial="idle"
            whileHover="pulse"
            variants={animations.pulseVariants}
          >
            <button className="px-8 py-4 bg-epseak-blue text-white rounded-lg font-semibold text-lg">
              Comenzar Ahora
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
