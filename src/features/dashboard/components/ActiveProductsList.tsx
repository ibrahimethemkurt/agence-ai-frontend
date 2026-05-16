import React from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { Package, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export const ActiveProductsList = ({ products }: { products: any[] }) => {
  return (
    <Reveal variant="fadeUp" className="h-full">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 h-full flex flex-col max-h-[420px]">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="text-xl font-display font-semibold text-[var(--color-fg)]">Aktif Ürünler</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#0A0A0A] border border-[var(--color-border)]">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-fg)]">{product.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  {product.status === 'Stokta' && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                  {product.status === 'Kritik Stok' && <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />}
                  {product.status === 'Tükendi' && <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />}
                  <span className="text-xs text-[var(--color-muted)]">{product.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-[var(--color-fg)]">{product.stock}</div>
                <div className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Adet</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
