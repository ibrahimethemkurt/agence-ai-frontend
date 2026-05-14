import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, fadeIn, scaleIn } from './variants';
import { useSafeAnimation } from '../../hooks/useSafeAnimation';

type TransitionVariant = 'fadeUp' | 'fadeIn' | 'scaleIn';

const TRANSITIONS = {
  fadeUp,
  fadeIn,
  scaleIn,
};

interface RevealProps {
  variant?: TransitionVariant;
  duration?: number;
  delay?: number;
  children: ReactNode;
  className?: string;
}

export const Reveal = ({ variant = 'fadeUp', delay = 0, children, className }: RevealProps) => {
  const selectedVariant = TRANSITIONS[variant];
  
  const transition = {
    ...selectedVariant.visible.transition,
    delay,
  };

  const animationProps = useSafeAnimation({
    variants: {
      hidden: selectedVariant.hidden,
      visible: { ...selectedVariant.visible, transition }
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
