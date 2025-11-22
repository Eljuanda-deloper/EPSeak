'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  ...props
}, ref) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 interactive-element hover:shadow-lg active:scale-95 focus:ring-azul-celeste';
  
  const variants = {
    primary: 'bg-rojo-brillante text-white hover:bg-red-600 hover:-translate-y-1 hover:shadow-rojo-brillante/30 active:scale-95',
    secondary: 'bg-white/10 text-white hover:bg-white/20 hover:-translate-y-1 hover:shadow-white/20 active:scale-95 border border-white/20',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`${baseStyle} ${sizes[size]} ${widthStyle} ${className || ''} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
