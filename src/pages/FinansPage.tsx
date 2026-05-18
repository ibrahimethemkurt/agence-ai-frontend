import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useFinansSummary } from '../features/finans/hooks/useFinansData';
import { PeriodSelector } from '../features/finans/components/PeriodSelector';
import { FinansSummary } from '../features/finans/components/FinansSummary';
import { RevenueExpenseChart } from '../features/finans/components/RevenueExpenseChart';
import { FinancialDashboard } from '../features/finans/components/FinancialDashboard';
import { PlatformLogo } from '../components/PlatformLogo';
import { Search } from 'lucide-react';

export const FinansPage = () => {
  const [period, setPeriod] = useState('Aylık');
  const [gelirSearch, setGelirSearch] = useState('');
  const [giderSearch, setGiderSearch] = useState('');
  const [gelirFilter, setGelirFilter] = useState('Tümü');
  const [giderFilter, setGiderFilter] = useState('Tümü');
  const data = useFinansSummary(period);
  
  // Gelir ve Giderleri ayır
  const incomes = (data.recentTransactions || []).filter((tx: any) => tx.amount > 0);
  const expenses = (data.recentTransactions || []).filter((tx: any) => tx.amount < 0);

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Financial Dashboard */}
        <div className="xl:col-span-5">
          <FinancialDashboard activities={data.recentTransactions} />
        </div>

        {/* Right Column: Existing Summaries and Charts */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          <FinansSummary data={data} />
          
          <RevenueExpenseChart data={data.revenueExpenseData} />
        </div>
      </div>

      {/* Detaylı Dökümler Listesi (Full Width & Scrollable, Equal Size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Gelirler */}
        <div className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#121212] flex flex-col h-[550px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              Gelirler
            </h3>
            <select 
              value={gelirFilter}
              onChange={(e) => setGelirFilter(e.target.value)}
              className="text-xs text-[#a3a3a3] bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-full outline-none appearance-none pr-8 cursor-pointer hover:border-white/20 transition-colors"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23737373\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
            >
              <option value="Tümü">Günlük Tümü</option>
              <option value="Haftalık">Haftalık Tümü</option>
              <option value="Aylık">Aylık Tümü</option>
            </select>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              type="text"
              value={gelirSearch}
              onChange={(e) => setGelirSearch(e.target.value)}
              placeholder="İşlem, ödeme veya metin arayın..."
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#737373] focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {incomes.filter((item: any) => item.title.toLowerCase().includes(gelirSearch.toLowerCase())).map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-[#1a1a1a] rounded-xl transition-colors border border-transparent hover:border-[#2a2a2a] gap-3">
                <PlatformLogo
                  title={item.title}
                  rawType={item.rawType}
                  amount={item.amount}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                  <p className="text-xs text-[#a3a3a3]">{item.time}</p>
                </div>
                <span className="text-sm font-mono font-bold text-[#22c55e] shrink-0">
                  +₺{item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Giderler */}
        <div className="p-6 rounded-3xl border border-[#2a2a2a] bg-[#121212] flex flex-col h-[550px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
              Giderler
            </h3>
            <select 
              value={giderFilter}
              onChange={(e) => setGiderFilter(e.target.value)}
              className="text-xs text-[#a3a3a3] bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-full outline-none appearance-none pr-8 cursor-pointer hover:border-white/20 transition-colors"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23737373\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '12px' }}
            >
              <option value="Tümü">Günlük Tümü</option>
              <option value="Haftalık">Haftalık Tümü</option>
              <option value="Aylık">Aylık Tümü</option>
            </select>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              type="text"
              value={giderSearch}
              onChange={(e) => setGiderSearch(e.target.value)}
              placeholder="İşlem, ödeme veya metin arayın..."
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#737373] focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {expenses.filter((item: any) => item.title.toLowerCase().includes(giderSearch.toLowerCase())).map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-[#1a1a1a] rounded-xl transition-colors border border-transparent hover:border-[#2a2a2a] gap-3">
                <PlatformLogo
                  title={item.title}
                  rawType={item.rawType}
                  amount={item.amount}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                  <p className="text-xs text-[#a3a3a3]">{item.time}</p>
                </div>
                <span className="text-sm font-mono font-bold text-[#ef4444] shrink-0">
                  -₺{Math.abs(item.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
