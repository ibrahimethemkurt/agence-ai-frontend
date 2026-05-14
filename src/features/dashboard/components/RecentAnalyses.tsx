import { Stagger } from '../../../components/animation/Stagger';
import { Reveal } from '../../../components/animation/Reveal';
import { ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Analysis {
  id: string;
  product: string;
  type: string;
  date: string;
}

interface RecentAnalysesProps {
  data: Analysis[];
}

export const RecentAnalyses = ({ data }: RecentAnalysesProps) => {
  return (
    <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-medium text-[var(--color-fg)]">Son Analizler</h3>
        <Link to="/analizler" className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-2)] transition-colors flex items-center">
          Tümünü Gör <ChevronRight size={16} />
        </Link>
      </div>

      <Stagger className="flex flex-col gap-3">
        {data.map((item) => (
          <Reveal key={item.id} variant="fadeUp" className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] flex justify-between items-center group cursor-pointer hover:border-[var(--color-accent)]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[var(--color-surface)] text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="font-medium text-[var(--color-fg)] text-sm">{item.product}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[var(--color-muted)]">{item.type}</span>
                  <span className="text-[var(--color-border)]">•</span>
                  <span className="text-xs text-[var(--color-muted)]">{item.date}</span>
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
          </Reveal>
        ))}
      </Stagger>
    </div>
  );
};
