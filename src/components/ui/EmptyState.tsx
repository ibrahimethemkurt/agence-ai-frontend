import type { ReactNode } from 'react';
import { Reveal } from '../animation/Reveal';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({ icon, title, description, actionLabel, onAction, className = '' }: EmptyStateProps) => {
  return (
    <Reveal variant="fadeIn" className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] ${className}`}>
      {icon && <div className="text-[var(--color-muted)] mb-4">{icon}</div>}
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-2">{title}</h3>
      {description && <p className="text-[var(--color-muted)] text-sm max-w-md mb-6">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-border)] text-[var(--color-fg)] rounded-md transition-colors text-sm font-medium"
        >
          {actionLabel}
        </button>
      )}
    </Reveal>
  );
};
