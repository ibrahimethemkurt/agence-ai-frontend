import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { staggerContainer } from './variants';
import { useSafeAnimation } from '../../hooks/useSafeAnimation';

interface StaggerProps {
  staggerDelay?: number;
  children: ReactNode;
  className?: string;
}

export const Stagger = ({ staggerDelay = 0.1, children, className }: StaggerProps) => {
  const transition = {
    ...staggerContainer.visible.transition,
    staggerChildren: staggerDelay,
  };

  const animationProps = useSafeAnimation({
    variants: {
      hidden: staggerContainer.hidden,
      visible: { ...staggerContainer.visible, transition }
    },
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-50px" }
  });

  return (
    <motion.div className={className} {...animationProps as any}>
      {children}
    </motion.div>
  );
};
