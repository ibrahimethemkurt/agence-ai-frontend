import React from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

export const StoreOptimizationScore = ({ score }: { score: number }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  
  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6] rounded-full blur-[80px] opacity-10"></div>
        
        <div className="flex w-full items-center justify-between mb-4 absolute top-6 left-6 right-6">
           <h2 className="text-lg font-display font-semibold text-[var(--color-fg)]">AI Optimizasyon</h2>
           <Zap className="w-5 h-5 text-[#8B5CF6]" />
        </div>

        <div className="w-full h-[200px] mt-8 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#8B5CF6" />
                <Cell fill="#1A1A1A" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-white">{score}%</span>
            <span className="text-xs text-[var(--color-muted)] mt-1 font-medium">Mükemmel Durum</span>
          </div>
        </div>
        <p className="text-sm text-center text-[var(--color-muted)] mt-4">
          Ajanlar mağazanızı en iyi kâr marjıyla yönetiyor.
        </p>
      </div>
    </Reveal>
  );
};
