import { Stagger } from '../../../components/animation/Stagger';
import { KPICard } from '../../../components/ui/KPICard';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface FinansSummaryProps {
  data: {
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
  };
}

export const FinansSummary = ({ data }: FinansSummaryProps) => {
  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <KPICard
        title="Toplam Gelir"
        value={`₺${data.totalRevenue.toLocaleString('tr-TR')}`}
        icon={<ArrowUpRight size={20} className="text-[var(--color-success)]" />}
        className="border-t-4 border-t-[var(--color-success)]"
      />
      <KPICard
        title="Toplam Gider"
        value={`₺${data.totalExpense.toLocaleString('tr-TR')}`}
        icon={<ArrowDownRight size={20} className="text-[var(--color-danger)]" />}
        className="border-t-4 border-t-[var(--color-danger)]"
      />
      <KPICard
        title="Net Kâr"
        value={`₺${data.netProfit.toLocaleString('tr-TR')}`}
        icon={<TrendingUp size={20} className={data.netProfit >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"} />}
        className={`border-t-4 ${data.netProfit >= 0 ? 'border-t-[var(--color-success)]' : 'border-t-[var(--color-danger)]'}`}
      />
    </Stagger>
  );
};
