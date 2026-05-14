import { PageTransition } from '../components/animation/PageTransition';
import { useListingWizard } from '../features/satis-sureci/hooks/useListingWizard';
import { WizardStepBar } from '../features/satis-sureci/components/WizardStepBar';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Reveal } from '../components/animation/Reveal';

export const SatisSureciPage = () => {
  const { currentStep, nextStep, prevStep } = useListingWizard();
  const steps = ['Görsel', 'SEO', 'Fiyat', 'Platform', 'Onay'];

  return (
    <PageTransition className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Ürün Yayınlama Sihirbazı</h1>
        <p className="text-[var(--color-muted)]">Ürününüzü tüm platformlarda en optimize şekilde yayınlayın.</p>
      </div>

      <WizardStepBar currentStep={currentStep} steps={steps} />

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 min-h-[400px] flex flex-col">
        <Reveal key={currentStep} variant="fadeIn" className="flex-1 flex flex-col">
          <h2 className="text-xl font-display font-medium mb-6">Adım {currentStep}: {steps[currentStep-1]}</h2>
          
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-lg p-8">
            <p className="text-[var(--color-muted)] text-center">Bu adımın detayları eklenecektir.<br/>Şu an genel akış test ediliyor.</p>
          </div>

          <div className="mt-8 flex justify-between">
            <AnimatedButton variant="outline" onClick={prevStep} disabled={currentStep === 1}>Geri</AnimatedButton>
            <AnimatedButton onClick={nextStep} disabled={currentStep === 5}>İleri</AnimatedButton>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
};
