import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageTransition } from '../components/animation/PageTransition';
import { OperasyonTab } from '../features/satis-sonrasi/components/OperasyonTab';
import { YorumlarTab } from '../features/satis-sonrasi/components/YorumlarTab';
import { IadelerTab } from '../features/satis-sonrasi/components/IadelerTab';

export const SatisSonrasiPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  
  const activeTab = searchParams.get('tab') || 'Operasyon Merkezi';
  
  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'Operasyon Merkezi' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const tabs = ['Operasyon Merkezi', 'Yorumlar', 'İadeler'];

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
              onClick={() => setSearchParams({ tab })}
              className={`${activeTab === tab ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:border-[var(--color-border)]'} border-b-2 whitespace-nowrap py-4 px-1 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Operasyon Merkezi' && <OperasyonTab />}
      {activeTab === 'Yorumlar' && <YorumlarTab />}
      {activeTab === 'İadeler' && <IadelerTab />}
      {activeTab !== 'Operasyon Merkezi' && activeTab !== 'Yorumlar' && activeTab !== 'İadeler' && (
        <div className="p-12 text-center border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-muted)]">
          Bu sekmenin içeriği eklenecektir.
        </div>
      )}

    </PageTransition>
  );
};
