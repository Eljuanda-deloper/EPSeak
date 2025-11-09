'use client';

import { motion } from 'framer-motion';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type MotionDivProps = ComponentPropsWithoutRef<typeof motion.div>;

interface AnimatedElementProps extends MotionDivProps {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export const FadeIn = forwardRef<HTMLDivElement, AnimatedElementProps>(({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  className = '',
  ...props
}, ref) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Curva de animación suave
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// Optimized animation component with reduced motion support
export const OptimizedFadeIn = forwardRef<HTMLDivElement, AnimatedElementProps>(({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  className = '',
  ...props
}, ref) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

FadeIn.displayName = 'FadeIn';

export const ScaleIn = forwardRef<HTMLDivElement, AnimatedElementProps>(({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

ScaleIn.displayName = 'ScaleIn';

OptimizedFadeIn.displayName = 'OptimizedFadeIn';

export const SlideIn = forwardRef<HTMLDivElement, AnimatedElementProps>(({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'left',
  distance = 100,
  className = '',
  ...props
}, ref) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[direction]}
      animate={{ x: 0, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});

SlideIn.displayName = 'SlideIn';