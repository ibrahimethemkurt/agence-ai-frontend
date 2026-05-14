import { Reveal } from '../animation/Reveal';
import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon?: ReactNode;
  className?: string;
}

export const KPICard = ({ title, value, unit, trend, icon, className = '' }: KPICardProps) => {
  return (
    <Reveal variant="scaleIn" className={`p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[var(--color-muted)] text-sm font-medium">{title}</span>
        {icon && <div className="text-[var(--color-accent)]">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-display font-bold text-[var(--color-fg)]">{value}</span>
        {unit && <span className="text-[var(--color-muted)] text-sm">{unit}</span>}
      </div>
      
      {trend && (
        <div className={`text-xs flex items-center gap-1 ${trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
          <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className="text-[var(--color-muted)] ml-1">{trend.label}</span>
        </div>
      )}
    </Reveal>
  );
};
