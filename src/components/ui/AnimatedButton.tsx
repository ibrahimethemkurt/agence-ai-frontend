import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { useSafeAnimation } from '../../hooks/useSafeAnimation';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    
    let baseStyles = 'inline-flex items-center justify-center font-display font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] ';
    
    switch (variant) {
      case 'primary':
        baseStyles += 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-2)] focus:ring-[var(--color-accent)] ';
        break;
      case 'secondary':
        baseStyles += 'bg-[var(--color-surface)] text-[var(--color-fg)] hover:bg-[var(--color-border)] focus:ring-[var(--color-fg)] ';
        break;
      case 'danger':
        baseStyles += 'bg-[var(--color-danger)] text-white hover:bg-red-800 focus:ring-[var(--color-danger)] ';
        break;
      case 'outline':
        baseStyles += 'border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface)] focus:ring-[var(--color-fg)] ';
        break;
    }

    switch (size) {
      case 'sm':
        baseStyles += 'px-3 py-1.5 text-sm ';
        break;
      case 'md':
        baseStyles += 'px-4 py-2 text-base ';
        break;
      case 'lg':
        baseStyles += 'px-6 py-3 text-lg ';
        break;
    }

    const hoverProps = useSafeAnimation({
      whileHover: { scale: 1.02, transition: { duration: 0.15 } },
      whileTap: { scale: 0.98, transition: { duration: 0.1 } }
    });

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...hoverProps as any}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
