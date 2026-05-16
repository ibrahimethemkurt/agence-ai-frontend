import React from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { Package } from 'lucide-react';

export const ActiveProductsCard = ({ count }: { count: number }) => {
  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B5CF6] rounded-full blur-[100px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#10B981] rounded-full blur-[80px] opacity-5 group-hover:opacity-20 transition-opacity duration-700 -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
        
        <div className="w-20 h-20 bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl flex items-center justify-center mb-8 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
          <Package className="w-10 h-10 text-[#8B5CF6]" />
        </div>
        <h3 className="text-6xl font-display font-bold text-white mb-3 relative z-10 tracking-tight">{count}</h3>
        <p className="text-[var(--color-muted)] font-medium text-lg relative z-10">Aktif Ürün Sayısı</p>
      </div>
    </Reveal>
  );
};
