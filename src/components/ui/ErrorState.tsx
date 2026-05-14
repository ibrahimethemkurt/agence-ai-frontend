import { AlertTriangle } from 'lucide-react';
import { Reveal } from '../animation/Reveal';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ title = 'Bir Hata Oluştu', message, onRetry, className = '' }: ErrorStateProps) => {
  return (
    <Reveal variant="fadeIn" className={`flex flex-col items-center justify-center p-8 text-center border border-[var(--color-danger)]/30 rounded-lg bg-[var(--color-danger)]/10 ${className}`}>
      <AlertTriangle className="text-[var(--color-danger)] mb-4" size={32} />
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-2">{title}</h3>
      <p className="text-[var(--color-muted)] text-sm max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[var(--color-danger)] hover:bg-red-800 text-white rounded-md transition-colors text-sm font-medium"
        >
          Tekrar Dene
        </button>
      )}
    </Reveal>
  );
};
