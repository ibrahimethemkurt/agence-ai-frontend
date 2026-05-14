import { DollarSign, Package, Bell, CheckCircle } from 'lucide-react';
import { KPICard } from '../../../components/ui/KPICard';
import { Stagger } from '../../../components/animation/Stagger';

interface KPIGridProps {
  data: {
    totalRevenue: number;
    activeProducts: number;
    pendingAlerts: number;
    completedAnalyses: number;
  };
}

export const KPIGrid = ({ data }: KPIGridProps) => {
  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Toplam Gelir (Bu Ay)"
        value={`₺${data.totalRevenue.toLocaleString('tr-TR')}`}
        trend={{ value: 12.5, label: 'geçen aya göre', isPositive: true }}
        icon={<DollarSign size={20} />}
      />
      <KPICard
        title="Aktif Ürün Sayısı"
        value={data.activeProducts}
        icon={<Package size={20} />}
      />
      <KPICard
        title="Bekleyen Uyarılar"
        value={data.pendingAlerts}
        icon={<Bell size={20} />}
        className={data.pendingAlerts > 0 ? 'border-[var(--color-warning)]' : ''}
      />
      <KPICard
        title="Tamamlanan Analizler"
        value={data.completedAnalyses}
        icon={<CheckCircle size={20} />}
      />
    </Stagger>
  );
};
