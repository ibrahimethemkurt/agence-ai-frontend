import React from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { Stagger } from '../../../components/animation/Stagger';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';

export const AIInsights = ({ insights }: { insights: any[] }) => {
  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-full">
        <h2 className="text-xl font-display font-semibold text-[var(--color-fg)] mb-6">Yapay Zeka İçgörüleri & Öneriler</h2>
        <Stagger className="flex flex-col gap-4" staggerDelay={0.15}>
          {insights.map((insight) => (
            <Reveal key={insight.id} variant="fadeUp">
              <div className="flex gap-4 p-4 rounded-2xl bg-[#0A0A0A] border border-[var(--color-border)] relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-colors">
                {insight.type === 'positive' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981]"></div>}
                {insight.type === 'warning' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B]"></div>}
                {insight.type === 'info' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B82F6]"></div>}
                
                <div className="flex-none pt-0.5">
                  {insight.type === 'positive' && <TrendingUp className="w-5 h-5 text-[#10B981]" />}
                  {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-[#F59E0B]" />}
                  {insight.type === 'info' && <Info className="w-5 h-5 text-[#3B82F6]" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-fg)] mb-1.5">{insight.title}</h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </Reveal>
  );
};
