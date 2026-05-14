import { PageTransition } from '../components/animation/PageTransition';
import { useAnalysisForm } from '../features/satis-oncesi/hooks/useAnalysisForm';
import { StepIndicator } from '../features/satis-oncesi/components/StepIndicator';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Reveal } from '../components/animation/Reveal';
import { Loader2 } from 'lucide-react';

export const SatisOncesiPage = () => {
  const { currentStep, formData, nextStep, prevStep, updateData } = useAnalysisForm();

  return (
    <PageTransition className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Satış Öncesi Analiz</h1>
        <p className="text-[var(--color-muted)]">Satmayı düşündüğünüz ürünün pazar ve fiyat analizini yapın.</p>
      </div>

      <StepIndicator currentStep={currentStep} steps={['Ürün Bilgisi', 'Maliyet Detayları', 'Analiz Sonucu']} />

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 min-h-[400px] flex flex-col">
        {currentStep === 1 && (
          <Reveal variant="fadeIn" className="flex-1 flex flex-col">
            <h2 className="text-xl font-display font-medium mb-6">Adım 1: Ürün Bilgisi</h2>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Ürün Adı</label>
                <input 
                  type="text" 
                  value={formData.productName}
                  onChange={(e) => updateData({ productName: e.target.value })}
                  placeholder="Faber-Castell 0.5mm Versatil Kalem"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-4 py-2 text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>
            <div className="mt-auto pt-8 flex justify-end">
              <AnimatedButton onClick={nextStep} disabled={!formData.productName}>İleri</AnimatedButton>
            </div>
          </Reveal>
        )}

        {currentStep === 2 && (
          <Reveal variant="fadeIn" className="flex-1 flex flex-col">
            <h2 className="text-xl font-display font-medium mb-6">Adım 2: Maliyet Detayları</h2>
            <div className="space-y-4 max-w-lg">
               <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Toptan Alış Fiyatı (₺)</label>
                <input type="number" value={formData.purchasePrice} onChange={(e) => updateData({ purchasePrice: e.target.value })} className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-4 py-2 text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
              </div>
            </div>
            <div className="mt-auto pt-8 flex justify-between">
              <AnimatedButton variant="outline" onClick={prevStep}>Geri</AnimatedButton>
              <AnimatedButton onClick={nextStep}>Analizi Başlat</AnimatedButton>
            </div>
          </Reveal>
        )}

        {currentStep === 3 && (
          <Reveal variant="fadeIn" className="flex-1 flex flex-col items-center justify-center py-12">
             <Loader2 size={48} className="animate-spin text-[var(--color-accent)] mb-6" />
             <h2 className="text-xl font-display font-medium mb-2">Ajanlar çalışıyor...</h2>
             <p className="text-[var(--color-muted)] text-center max-w-md">"{formData.productName}" için güncel pazar verileri ve rakip fiyatları taranıyor. Bu işlem birkaç saniye sürebilir.</p>
          </Reveal>
        )}
      </div>
    </PageTransition>
  );
};
