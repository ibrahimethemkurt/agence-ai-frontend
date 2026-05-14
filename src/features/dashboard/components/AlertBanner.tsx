import { Reveal } from '../../../components/animation/Reveal';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
}

interface AlertBannerProps {
  alerts: Alert[];
}

export const AlertBanner = ({ alerts }: AlertBannerProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {alerts.map((alert, index) => {
        let styles = '';
        let Icon = Info;

        switch (alert.type) {
          case 'danger':
            styles = 'bg-[var(--color-danger)]/10 border-[var(--color-danger)]/30 text-[var(--color-danger)]';
            Icon = AlertCircle;
            break;
          case 'warning':
            styles = 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30 text-[var(--color-warning)]';
            Icon = AlertTriangle;
            break;
          default:
            styles = 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30 text-[var(--color-accent)]';
        }

        return (
          <Reveal key={alert.id} variant="fadeIn" delay={index * 0.1} className={`p-4 rounded-lg border flex items-start gap-3 ${styles}`}>
            <Icon size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{alert.message}</p>
          </Reveal>
        );
      })}
    </div>
  );
};
