import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useFinansSummary } from '../features/finans/hooks/useFinansData';
import { PeriodSelector } from '../features/finans/components/PeriodSelector';
import { FinansSummary } from '../features/finans/components/FinansSummary';
import { RevenueExpenseChart } from '../features/finans/components/RevenueExpenseChart';

export const FinansPage = () => {
  const [period, setPeriod] = useState('Aylık');
  const data = useFinansSummary(period);

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Gelir & Gider</h1>
          <p className="text-[var(--color-muted)]">Finansal durumunuzu ve hesap hareketlerinizi yönetin.</p>
        </div>
        <PeriodSelector 
          periods={['Günlük', 'Haftalık', 'Aylık']} 
          selectedPeriod={period} 
          onSelect={setPeriod} 
        />
      </div>

      <FinansSummary data={data} />
      
      <RevenueExpenseChart data={data.revenueExpenseData} />

      {/* Tabs Placeholder */}
      <div className="mt-8 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-4">Detaylı Dökümler</h3>
        <div className="border-b border-[var(--color-border)] mb-4">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-[var(--color-accent)] text-[var(--color-accent)] whitespace-nowrap py-4 px-1 font-medium text-sm">
              Gelir
            </button>
            <button className="border-b-2 border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)] whitespace-nowrap py-4 px-1 font-medium text-sm">
              Gider
            </button>
            <button className="border-b-2 border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)] whitespace-nowrap py-4 px-1 font-medium text-sm">
              Gemini Raporu
            </button>
          </nav>
        </div>
        <div className="py-4">
          <p className="text-[var(--color-muted)] text-sm">Seçili döneme ait detaylı dökümler burada listelenecektir.</p>
        </div>
      </div>
    </PageTransition>
  );
};
