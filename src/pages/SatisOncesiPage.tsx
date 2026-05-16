import { useState, useEffect } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useAnalysisForm } from '../features/satis-oncesi/hooks/useAnalysisForm';
import { Reveal } from '../components/animation/Reveal';
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import AgentPlan from '../components/ui/agent-plan';
import { useNavigate } from 'react-router-dom';

const stepsData = [
  { id: 1, title: 'Ürün Bilgisi' },
  { id: 2, title: 'Maliyet Detayları' },
  { id: 3, title: 'Yapay Zeka Analizi' },
  { id: 4, title: 'Sonuç' }
];

export const SatisOncesiPage = () => {
  const { currentStep, formData, nextStep, prevStep, updateData, setStep } = useAnalysisForm();
  const navigate = useNavigate();

  const currentStepData = stepsData.find(s => s.id === currentStep);
  const [showResultsButton, setShowResultsButton] = useState(false);

  useEffect(() => {
    if (currentStep === 3) {
      setShowResultsButton(false);
      const timer = setTimeout(() => {
        setShowResultsButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <PageTransition className="max-w-3xl mx-auto py-8">
      
      {/* Top Custom Step Indicator */}
      <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6 mb-10 px-4">
        {stepsData.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isActive ? 'bg-white ring-4 ring-white/20' : 'bg-[#2a2a2a]'}`} />
              <span className={`text-sm transition-colors duration-300 ${isActive ? 'font-bold text-white' : 'font-medium text-[#737373]'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Card Container */}
      <div className="bg-[#121212] rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl">
        {currentStep === 1 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ürün Bilgisini Girin</h2>
              <p className="text-[#a3a3a3] text-base">Satmayı düşündüğünüz ürünün pazar ve maliyet analizini yapmak için temel bilgileri girelim</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Ürün Adı</label>
                <input 
                  type="text" 
                  value={formData.productName}
                  onChange={(e) => updateData({ productName: e.target.value })}
                  placeholder="Örn: Faber-Castell 0.5mm Versatil Kalem"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                />
              </div>

              <p className="text-sm text-[#737373] italic mt-2">
                * Ajanın tam çalışması ve pazardaki rakipleri doğru tespit edebilmesi için ürünün ismini tam haliyle giriniz (Örn: Apple iPhone 15 Pro Max 256GB Siyah).
              </p>
            </div>

            <div className="mt-12 flex justify-between items-center">
              <div></div> {/* Empty div to push Next button to right */}
              <button 
                onClick={nextStep} 
                disabled={!formData.productName}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İleri <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {currentStep === 2 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Maliyet Detayları</h2>
              <p className="text-[#a3a3a3] text-base">Karlılık analizi için maliyet ve komisyon verilerini doldurun</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-bold text-white mb-2">Toptan Alış Fiyatı (₺)</label>
                <input type="number" value={formData.purchasePrice} onChange={(e) => updateData({ purchasePrice: e.target.value })} placeholder="0.00" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">Stok Adedi</label>
                <input type="number" value={formData.stock} onChange={(e) => updateData({ stock: e.target.value })} placeholder="100" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">Kargo Ücreti (₺)</label>
                <input type="number" value={formData.shippingCost} onChange={(e) => updateData({ shippingCost: e.target.value })} placeholder="0.00" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">KDV Oranı (%)</label>
                <input type="number" value={formData.taxRate} onChange={(e) => updateData({ taxRate: e.target.value })} placeholder="20" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white mb-2">Platform Komisyon Oranı (%)</label>
                <input type="number" value={formData.commissionRate} onChange={(e) => updateData({ commissionRate: e.target.value })} placeholder="15" className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all" />
              </div>
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              <button 
                onClick={nextStep} 
                disabled={!formData.purchasePrice}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analizi Başlat <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {currentStep === 3 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Sistem Çalışıyor</h2>
                <p className="text-[#a3a3a3] text-base">"{formData.productName}" için veriler toplanıyor</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Ajanlar devrede
              </div>
            </div>
             
            <div className="flex-1 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]">
               <AgentPlan />
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              {showResultsButton ? (
                <button 
                  onClick={nextStep} 
                  className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors"
                >
                  Sonuçları Gör <ChevronRight size={18} />
                </button>
              ) : (
                <div className="text-sm text-[#737373] animate-pulse">
                  Veriler toplanıyor, lütfen bekleyin...
                </div>
              )}
            </div>
          </Reveal>
        )}

        {currentStep === 4 && (
          <Reveal variant="fadeIn" className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-8 border border-[#2a2a2a] shadow-inner">
              <CheckCircle2 className="text-white" size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">Analiz Tamamlandı!</h2>
            <p className="text-[#a3a3a3] text-center max-w-md mb-12 text-lg">
              Ürün için rakip analizi, optimum satış fiyatı ve tahmini karlılık raporu başarıyla oluşturuldu. Satış sürecini başlatmaya hazırsınız.
            </p>
            
            <div className="flex gap-4 w-full max-w-md">
              <button 
                onClick={() => alert('Analiz başarıyla kaydedildi!')}
                className="flex-1 flex justify-center items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-4 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                Kaydet
              </button>
              <button 
                onClick={() => navigate('/ajanlar/satis-sureci')}
                className="flex-[2] flex justify-center items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-4 font-bold hover:bg-white transition-colors"
              >
                Satışa Geç <ChevronRight size={20} />
              </button>
            </div>
          </Reveal>
        )}
      </div>
      
      {/* Step Counter at Bottom */}
      <div className="text-center text-sm font-medium text-[#737373] mt-8">
        Adım {currentStep} / {stepsData.length}: <span className="text-white">{currentStepData?.title}</span>
      </div>

    </PageTransition>
  );
};

