import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Reveal } from '../../../components/animation/Reveal';

interface Props {
  data: {
    daily: any[];
    monthly: any[];
    yearly: any[];
    allTime: any[];
  }
}

export const IncomeExpenseChart: React.FC<Props> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly' | 'yearly' | 'allTime'>('monthly');

  const chartData = data[timeRange];

  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-display font-semibold text-[var(--color-fg)]">Gelir & Gider Grafiği</h2>
          <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-[var(--color-border)] overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'daily', label: 'Günlük' },
              { id: 'weekly', label: 'Haftalık' },
              { id: 'monthly', label: 'Aylık' },
              { id: 'yearly', label: 'Yıllık' },
              { id: 'allTime', label: 'Tümü' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap ${timeRange === tab.id ? 'bg-[#1E1E1E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E1E1E" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `₺${new Intl.NumberFormat('tr-TR', { notation: 'compact' }).format(val)}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#2E2E2E', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="income" name="Gelir" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="Gider" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Reveal>
  );
};
