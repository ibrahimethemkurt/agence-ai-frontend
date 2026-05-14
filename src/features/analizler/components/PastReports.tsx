import { Stagger } from '../../../components/animation/Stagger';
import { Reveal } from '../../../components/animation/Reveal';
import { FileText, ArrowRight } from 'lucide-react';


interface Report {
  id: string;
  product: string;
  type: string;
  date: string;
  score: number;
  status: string;
}

interface PastReportsProps {
  reports: Report[];
  onViewReport: (id: string) => void;
}

export const PastReports = ({ reports, onViewReport }: PastReportsProps) => {
  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Reveal key={report.id} variant="fadeUp" className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col group hover:border-[var(--color-accent)]/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-[var(--color-bg)] text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)]">
              <FileText size={20} />
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-sm font-bold ${report.score >= 80 ? 'text-[var(--color-success)]' : report.score >= 60 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
                Skor: {report.score}
              </span>
            </div>
          </div>
          
          <h4 className="font-display font-medium text-[var(--color-fg)] text-lg mb-1">{report.product}</h4>
          <p className="text-sm text-[var(--color-muted)] mb-4">{report.type}</p>
          
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-[var(--color-border)]">
            <span className="text-xs text-[var(--color-muted)]">{report.date}</span>
            <button 
              onClick={() => onViewReport(report.id)}
              className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-2)] transition-colors flex items-center font-medium"
            >
              Tam Rapor <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </Reveal>
      ))}
    </Stagger>
  );
};
