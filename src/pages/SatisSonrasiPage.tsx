import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useSatisSonrasiData } from '../features/satis-sonrasi/hooks/useSatisSonrasiData';
import { OrdersTab } from '../features/satis-sonrasi/components/OrdersTab';

export const SatisSonrasiPage = () => {
  const [activeTab, setActiveTab] = useState('Siparişler');
  const tabs = ['Siparişler', 'Stok', 'Yorumlar', 'İadeler'];
  const { orders } = useSatisSonrasiData();

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Satış Sonrası</h1>
          <p className="text-[var(--color-muted)]">Sipariş, stok, yorum ve iade takibini tek ekrandan yapın.</p>
        </div>
      </div>

      <div className="border-b border-[var(--color-border)] mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)]'} border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Siparişler' && <OrdersTab orders={orders} />}
      {activeTab !== 'Siparişler' && (
        <div className="p-12 text-center border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-muted)]">
          Bu sekmenin içeriği eklenecektir.
        </div>
      )}

    </PageTransition>
  );
};
