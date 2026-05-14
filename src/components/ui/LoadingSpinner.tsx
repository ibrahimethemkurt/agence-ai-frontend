import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner = ({ size = 24, fullScreen = false, className = '' }: LoadingSpinnerProps) => {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className={`text-[var(--color-accent)] ${className}`}
    >
      <Loader2 size={size} />
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg)] z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
