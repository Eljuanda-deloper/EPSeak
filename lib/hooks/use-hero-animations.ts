'use client';

import { Variants } from 'framer-motion';

/**
 * Custom hook para animaciones reutilizables en secciones hero
 * Proporciona variantes predefinidas para AnimatedGroup y TextEffect
 */

export const useHeroAnimations = () => {
  /**
   * Variantes para entrada de lecciones con efecto blur y escala
   * Ideal para componentes que representan lecciones o módulos
   */
  const lessonEnterVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(10px)', scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // custom easing
      },
    }),
  };

  /**
   * Variantes para revelar vocabulario con efectos de deslizamiento y fade
   * Perfecto para mostrar palabras clave o términos
   */
  const vocabularyRevealVariants: Variants = {
    hidden: { opacity: 0, y: 20, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
    hover: {
      scale: 1.05,
      color: '#0066cc', // epseak-blue
      transition: {
        duration: 0.3,
      },
    },
  };

  /**
   * Variantes para animación de progreso en lecciones
   * Muestra progreso visual con rotación y escala
   */
  const progressIndicatorVariants: Variants = {
    hidden: { rotate: -180, opacity: 0, scale: 0 },
    visible: (i: number) => ({
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  /**
   * Variantes para componentes que aparecen en cascada (como tarjetas)
   * Combina escala y opacidad para efecto suave
   */
  const cascadeFadeVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.12,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1], // cubic-bezier
      },
    }),
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  /**
   * Variantes para títulos con efecto de escritura
   * Simula que el texto aparece gradualmente
   */
  const titleWriteVariants: Variants = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  /**
   * Variantes para el efecto de pulsación (como botones CTA)
   * Atrae la atención del usuario
   */
  const pulseVariants: Variants = {
    idle: { scale: 1 },
    pulse: {
      scale: 1.02,
      boxShadow: '0 0 20px rgba(0, 102, 204, 0.4)',
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  /**
   * Variantes para animación de entrada tipo "bounce" suave
   * Ideal para elementos secundarios
   */
  const softBounceVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 20,
      },
    }),
  };

  /**
   * Variantes para rotación suave (como íconos decorativos)
   * Movimiento sutil que no distrae
   */
  const gentleRotateVariants: Variants = {
    hidden: { rotate: -30, opacity: 0 },
    visible: (i: number) => ({
      rotate: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
    hover: {
      rotate: 10,
      transition: { duration: 0.3 },
    },
  };

  /**
   * Variantes para efecto de revelación (mask/clip-path)
   * Usado para revelar contenido de forma dramática
   */
  const revealVariants: Variants = {
    hidden: {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    },
    visible: (i: number) => ({
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: 'easeInOut',
      },
    }),
  };

  return {
    lessonEnterVariants,
    vocabularyRevealVariants,
    progressIndicatorVariants,
    cascadeFadeVariants,
    titleWriteVariants,
    pulseVariants,
    softBounceVariants,
    gentleRotateVariants,
    revealVariants,
  };
};

/**
 * Hook para controlar animaciones basadas en scroll
 * Útil para activar animaciones cuando el usuario scrollea
 */
export const useScrollAnimation = () => {
  const getScrollProgress = (
    element: HTMLElement,
    options?: { start?: number; end?: number }
  ) => {
    const start = options?.start ?? 0;
    const end = options?.end ?? 1;

    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const windowHeight = window.innerHeight;

    const progress =
      (windowHeight - elementTop) / (windowHeight + elementHeight);

    return Math.min(Math.max(progress, start), end);
  };

  return {
    getScrollProgress,
  };
};

/**
 * Hook para crear animaciones basadas en tiempo
 * Útil para crear ciclos de animación personalizados
 */
export const useTimingAnimation = (duration: number = 3000) => {
  const getTimingVariants = (
    delayFactor: number = 0.1
  ): Variants => ({
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * delayFactor,
        duration: duration / 1000,
      },
    }),
  });

  return {
    getTimingVariants,
  };
};
