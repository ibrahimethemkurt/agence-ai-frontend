import { useState, useEffect } from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { Package, RefreshCw, RotateCcw } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/v1';

interface ReturnOrder {
  id: string;
  orderNo: string;
  productName: string;
  customer: string;
  amount: number;
  date: string;
  status: 'iade' | 'iptal';
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  iade:  { label: 'İade',  color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  iptal: { label: 'İptal', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
};

export const IadelerTab = () => {
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReturns = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/support/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Veriler alınamadı');

        const orders = await res.json();
        // Sadece iade ve iptal siparişleri göster
        const filtered: ReturnOrder[] = orders
          .filter((o: any) => o.status === 'iade' || o.status === 'iptal')
          .map((o: any) => ({
            id: o.id,
            orderNo: o.id,
            productName: o.product,
            customer: o.customer || 'Bilinmiyor',
            amount: o.amount,
            date: o.date,
            status: o.status as 'iade' | 'iptal',
          }));

        setReturns(filtered);
      } catch (e: any) {
        setError(e.message || 'Veri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="w-10 h-10 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin" />
        <p className="text-[var(--color-muted)] font-medium animate-pulse">İade ve iptal verileri yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm"
        >
          <RefreshCw size={16} /> Tekrar Dene
        </button>
      </div>
    );
  }

  if (returns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Package className="text-emerald-400" size={28} />
        </div>
        <h3 className="text-xl font-bold text-white">İade veya İptal Yok</h3>
        <p className="text-[var(--color-muted)] text-sm text-center max-w-xs">
          Şu an için aktif iade ya da iptal edilen siparişiniz bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Özet banner */}
      <Reveal>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0A0A0A] border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <RotateCcw className="text-red-400" size={18} />
          </div>
          <div>
            <p className="text-white font-semibold">
              {returns.filter(r => r.status === 'iade').length} iade,{' '}
              {returns.filter(r => r.status === 'iptal').length} iptal
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              Toplam {returns.length} işlem bulundu
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-red-400 font-bold text-lg">
              -{returns.reduce((s, r) => s + r.amount, 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </p>
            <p className="text-xs text-[var(--color-muted)]">Toplam kayıp</p>
          </div>
        </div>
      </Reveal>

      {/* Kartlar */}
      <Reveal variant="fadeUp" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {returns.map((item) => {
            const badge = STATUS_LABEL[item.status] ?? STATUS_LABEL.iade;
            return (
              <div
                key={item.id}
                className="relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-5
                  hover:border-white/10 transition-colors flex flex-col gap-4"
              >
                {/* Başlık */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-white/90 line-clamp-2 leading-snug">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-[var(--color-muted)] mt-1.5 font-mono tracking-wider">
                      {item.orderNo}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Detaylar */}
                <div className="flex flex-col gap-1.5 text-sm border-t border-white/5 pt-4">
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Müşteri</span>
                    <span className="text-white/80 font-medium">{item.customer}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Tarih</span>
                    <span className="text-white/80">{item.date}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-muted)]">
                    <span>Tutar</span>
                    <span className="text-red-400 font-bold">
                      -{item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
};
