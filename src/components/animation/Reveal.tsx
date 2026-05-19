import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef, useEffect, useState } from 'react';
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
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Reveal = ({ variant = 'fadeUp', delay = 0, children, className, onClick }: RevealProps) => {
  const selectedVariant = TRANSITIONS[variant];
  const rootRef = useRef<Element | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = document.getElementById('main-scroll-container');
    if (el) {
      rootRef.current = el;
      setReady(true);
    } else {
      setReady(true);
    }
  }, []);
  
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
    viewport: { once: false, amount: 0.05, margin: "0px", root: rootRef }
  });

  if (!ready) {
    return <div className={className} style={{ opacity: 0 }}>{children}</div>;
  }

  return (
    <motion.div className={className} onClick={onClick} {...animationProps as any}>
      {children}
    </motion.div>
  );
};
