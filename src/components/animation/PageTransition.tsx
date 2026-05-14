import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useSafeAnimation } from '../../hooks/useSafeAnimation';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const animationProps = useSafeAnimation({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  });

  return (
    <motion.div className={className} {...animationProps as any}>
      {children}
    </motion.div>
  );
};
