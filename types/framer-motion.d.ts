import { HTMLMotionProps } from 'framer-motion';

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends Omit<React.HTMLAttributes<T>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationComplete'> {
    initial?: any;
    animate?: any;
    exit?: any;
    whileHover?: any;
    whileTap?: any;
    variants?: any;
    transition?: any;
  }
}