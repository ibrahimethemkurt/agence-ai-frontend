import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeIn, fadeUp, scaleIn } from './variants';

const TRANSITIONS = {
  fade: fadeIn,
  slideUp: fadeUp,
  scale: scaleIn,
};

export type TransitionVariant = keyof typeof TRANSITIONS;

export interface RevealProps {
  variant?: TransitionVariant;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const Reveal = ({ variant = 'fade', duration = 0.3, delay = 0, children, className }: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const selectedVariant = TRANSITIONS[variant];

  const variants: any = shouldReduceMotion 
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration, delay } } } 
    : {
        hidden: selectedVariant.hidden,
        visible: {
          ...(selectedVariant.visible as any),
          transition: { ...(selectedVariant.visible as any).transition, duration, delay }
        }
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
