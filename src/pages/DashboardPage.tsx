import { useState, useEffect } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useDashboardData } from '../features/dashboard/hooks/useDashboardData';
import { InteractiveTaskHub } from '../features/dashboard/components/InteractiveTaskHub';
import { AlertBanner } from '../features/dashboard/components/AlertBanner';
import { IncomeExpenseChart } from '../features/dashboard/components/IncomeExpenseChart';
import { ReviewsSummaryDashboard } from '../features/dashboard/components/ReviewsSummaryDashboard';
import { ActiveAgentsList } from '../features/dashboard/components/ActiveAgentsList';
import { ActiveProductsList } from '../features/dashboard/components/ActiveProductsList';
import { StoreOptimizationScore } from '../features/dashboard/components/StoreOptimizationScore';
import { AIInsights } from '../features/dashboard/components/AIInsights';
import { api } from '../lib/api';

export const DashboardPage = () => {
  const data = useDashboardData();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    api.getMe()
      .then(user => setUserName(user.full_name))
      .catch(console.error);
  }, []);

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Merhaba, {userName || 'Kullanıcı'}</h1>
          <p className="text-[var(--color-muted)]">Pazara'ya hoş geldin, işte güncel özetin.</p>
        </div>
      </div>

      <AlertBanner alerts={data.alerts} />
      
      {/* Row 1: Interactive Task Hub + Active Agents List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <InteractiveTaskHub />
        </div>
        <div className="lg:col-span-3">
          <ActiveAgentsList agents={data.activeAgents} />
        </div>
      </div>

      {/* Row 2: Active Products List + Income Expense Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ActiveProductsList products={data.activeProductsList} />
        </div>
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={data.revenueData} />
        </div>
      </div>

      {/* Row 3: Reviews Summary */}
      <div className="grid grid-cols-1 gap-6">
        <ReviewsSummaryDashboard />
      </div>

      {/* Row 4: AI Store Optimization Score + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <StoreOptimizationScore score={data.optimizationScore} />
        </div>
        <div className="lg:col-span-2">
          <AIInsights insights={data.aiInsights} />
        </div>
      </div>
    </PageTransition>
  );
};
