import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useSatisSonrasiData } from '../features/satis-sonrasi/hooks/useSatisSonrasiData';
import { OrdersTab } from '../features/satis-sonrasi/components/OrdersTab';

export const SatisSonrasiPage = () => {
  const [activeTab, setActiveTab] = useState('Siparişler');
  const tabs = ['Siparişler', 'Stok', 'Yorumlar', 'İadeler'];
  const { orders, reviews } = useSatisSonrasiData();

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
      
      {activeTab === 'Yorumlar' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-muted)]">
              Henüz müşteri yorumu bulunmuyor.
            </div>
          ) : (
            reviews.map((review: any) => (
              <div key={review.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-white">{review.customer}</h3>
                    <p className="text-sm text-[#a3a3a3] mt-1">{review.product} • {review.date}</p>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-[#d4d4d4] leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      {(activeTab === 'Stok' || activeTab === 'İadeler') && (
        <div className="p-12 text-center border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-muted)]">
          Bu sekmenin içeriği yakında eklenecektir.
        </div>
      )}

    </PageTransition>
  );
};
