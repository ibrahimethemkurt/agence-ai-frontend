import { PageTransition } from '../components/animation/PageTransition';
import { useDashboardData } from '../features/dashboard/hooks/useDashboardData';
import { KPIGrid } from '../features/dashboard/components/KPIGrid';
import { RevenueChart } from '../features/dashboard/components/RevenueChart';
import { RecentAnalyses } from '../features/dashboard/components/RecentAnalyses';
import { AlertBanner } from '../features/dashboard/components/AlertBanner';

export const DashboardPage = () => {
  const data = useDashboardData();

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Dashboard</h1>
          <p className="text-[var(--color-muted)]">AjansAI'a hoş geldiniz, işte güncel özetiniz.</p>
        </div>
      </div>

      <AlertBanner alerts={data.alerts} />
      
      <KPIGrid data={data.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={data.revenueData} />
        </div>
        <div>
          <RecentAnalyses data={data.recentAnalyses} />
        </div>
      </div>
    </PageTransition>
  );
};
