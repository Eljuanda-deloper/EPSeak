'use client';

import { Button, ButtonProps } from './button'
import { motion } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends Omit<ButtonProps, 'ref'> {
  animateOnHover?: boolean
  animateOnTap?: boolean
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ animateOnHover = true, animateOnTap = true, className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={animateOnHover ? { scale: 1.05 } : {}}
        whileTap={animateOnTap ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-epseak-blue',
          'bg-epseak-blue text-white hover:bg-blue-700 hover:-translate-y-1 hover:shadow-blue-500/30 active:scale-95',
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'