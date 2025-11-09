'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  className = '',
  fullWidth = false,
  ...props
}, ref) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 interactive-element hover:shadow-lg active:scale-95 focus:ring-azul-celeste';
  const variants = {
    primary: 'bg-rojo-brillante text-white hover:bg-red-600 hover:-translate-y-1 hover:shadow-rojo-brillante/30 active:scale-95',
    secondary: 'bg-white/10 text-white hover:bg-white/20 hover:-translate-y-1 hover:shadow-white/20 active:scale-95 border border-white/20',
  };
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
