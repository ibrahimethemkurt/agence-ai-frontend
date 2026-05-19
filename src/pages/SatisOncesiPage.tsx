import { useEffect, useRef } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { Reveal } from '../components/animation/Reveal';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import AgentPlan from '../components/ui/agent-plan';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { PresaleReportCard } from '../components/ui/PresaleReportCard';
import { useSessionStorage, clearSessionStorageByPrefix } from '../hooks/useSessionStorage';

const STEPS = [
  { id: 1, title: 'Ürün Bilgisi' },
  { id: 2, title: 'Maliyet Detayları' },
  { id: 3, title: 'Yapay Zeka Analizi' },
  { id: 4, title: 'Sonuç' },
];

const DEFAULT_FORM = {
  productName: '',
  purchasePrice: '',
  stock: '',
  shippingCost: '',
  taxRate: '20',
  commissionRate: '15',
};

type FormData = typeof DEFAULT_FORM;
type AnalysisStatus = 'idle' | 'bekliyor' | 'processing' | 'completed' | 'failed';

export const SatisOncesiPage = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep]       = useSessionStorage<number>('satisOncesi_step', 1);
  const [formData, setFormData]             = useSessionStorage<FormData>('satisOncesi_form', DEFAULT_FORM);
  const [analysisId, setAnalysisId]         = useSessionStorage<number | null>('satisOncesi_analysisId', null);
  const [analysisStatus, setAnalysisStatus] = useSessionStorage<AnalysisStatus>('satisOncesi_status', 'idle');
  const [reportJson, setReportJson]         = useSessionStorage<string | null>('satisOncesi_report', null);

  const [apiError, setApiError] = useSessionStorage<string | null>('satisOncesi_apiError', null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateData = (data: Partial<FormData>) =>
    setFormData(prev => ({ ...prev, ...data }));

  const currentStepData = STEPS.find(s => s.id === currentStep);


  // --- API: Analizi başlat ---
  // Guard: zaten bir analiz ID'si varsa tekrar başlatma
  const startAnalysis = async () => {
    if (analysisId !== null) return; // Analiz zaten başlatıldı, yeniden başlatma
    setApiError(null);
    setAnalysisStatus('bekliyor');
    // Yeni analiz başlarken agent-plan animasyon geçmişini temizle
    sessionStorage.removeItem('agentPlan_tasks');
    sessionStorage.removeItem('agentPlan_expanded');

    try {
      const result = await api.startAnalysis({
        product_name: formData.productName,
        inputs: {
          base_cost: parseFloat(formData.purchasePrice || '0'),
          shipping_cost: parseFloat(formData.shippingCost || '0'),
          tax_rate: parseFloat(formData.taxRate || '20'),
          commission_rate: parseFloat(formData.commissionRate || '15'),
          stock: parseInt(formData.stock || '0'),
        },
      });
      setAnalysisId(result.id);
      setAnalysisStatus(result.status);
    } catch (err: any) {
      setApiError(err.message || 'Analiz başlatılırken hata oluştu.');
      setAnalysisStatus('failed');
    }
  };

  // --- Polling ---
  useEffect(() => {
    if (!analysisId || analysisStatus === 'completed' || analysisStatus === 'failed') {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    pollingRef.current = setInterval(async () => {
      try {
        const data = await api.getAnalysis(analysisId);
        setAnalysisStatus(data.status);

        if (data.status === 'completed') {
          setReportJson(data.report_json);
          clearInterval(pollingRef.current!);
        } else if (data.status === 'failed') {
          setReportJson(data.report_json); // Hata detayı burada
          clearInterval(pollingRef.current!);
        }
      } catch {
        // polling hatası — sessizce yeniden dene
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [analysisId, analysisStatus]);

  // --- Sayfa mount'ta: adım 3 + analysisId varsa ve hâlâ devam ediyorsa polling'i sürdür ---
  const resumeRef = useRef(false);
  useEffect(() => {
    if (resumeRef.current) return;
    resumeRef.current = true;
    // Sayfa yeniden yüklendiğinde adım 3'te devam eden bir analiz varsa polling zaten
    // yukarıdaki polling useEffect tarafından otomatik devreye girer (analysisId + !completed).
    // Ekstra bir şey yapmaya gerek yok — sessionStorage'dan gelen analysisId yeterli.
  }, []);

  // --- Adım 2 → 3 geçişinde API'yi tetikle (zaten başlamışsa atla) ---
  const handleNextStep = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
      // analysisId varsa analiz devam ediyor, yeniden başlatma
      if (analysisId === null) {
        startAnalysis();
      }
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    // Analiz devam ederken geri gidilse bile polling durdurmuyoruz — arka planda sürsün
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const canGoToResults =
    analysisStatus === 'completed' || analysisStatus === 'failed';

  const inputClass =
    'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all';

  return (
    <PageTransition className="max-w-3xl mx-auto py-8">
      {/* Step Indicator */}
      <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6 mb-10 px-4">
        {STEPS.map(step => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-green-500'
                    : isActive
                    ? 'bg-white ring-4 ring-white/20'
                    : 'bg-[#2a2a2a]'
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  isActive ? 'font-bold text-white' : isDone ? 'text-green-400' : 'font-medium text-[#737373]'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="bg-[#121212] rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl">

        {/* ADIM 1 */}
        {currentStep === 1 && (
          <Reveal variant="fadeIn" className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ürün Bilgisini Girin</h2>
              <p className="text-[#a3a3a3] text-base">
                Satmayı düşündüğünüz ürünün pazar ve maliyet analizini yapmak için temel bilgileri girelim.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Ürün Adı</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={e => updateData({ productName: e.target.value })}
                  placeholder="Örn: Faber-Castell 0.5mm Versatil Kalem"
                  className={inputClass}
                />
              </div>
              <p className="text-sm text-[#737373] italic">
                * Ajanın doğru rakip analizi yapabilmesi için ürünün tam adını giriniz.
              </p>
            </div>
            <div className="mt-12 flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!formData.productName.trim()}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İleri <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {/* ADIM 2 */}
        {currentStep === 2 && (
          <Reveal variant="fadeIn" className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Maliyet Detayları</h2>
              <p className="text-[#a3a3a3] text-base">Karlılık analizi için maliyet ve komisyon verilerini doldurun.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Toptan Alış Fiyatı (₺)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={e => updateData({ purchasePrice: e.target.value })}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">Stok Adedi</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => updateData({ stock: e.target.value })}
                  placeholder="100"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">Kargo Ücreti (₺)</label>
                <input
                  type="number"
                  value={formData.shippingCost}
                  onChange={e => updateData({ shippingCost: e.target.value })}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">KDV Oranı (%)</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={e => updateData({ taxRate: e.target.value })}
                  placeholder="20"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white mb-2">Platform Komisyon Oranı (%)</label>
                <input
                  type="number"
                  value={formData.commissionRate}
                  onChange={e => updateData({ commissionRate: e.target.value })}
                  placeholder="15"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-12 flex justify-between items-center">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              <button
                onClick={handleNextStep}
                disabled={!formData.purchasePrice}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analizi Başlat <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {/* ADIM 3 — Ajanlar Çalışıyor */}
        {currentStep === 3 && (
          <Reveal variant="fadeIn" className="flex flex-col">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Sistem Çalışıyor</h2>
                <p className="text-[#a3a3a3] text-base">"{formData.productName}" için veriler toplanıyor</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border bg-green-500/10 border-green-500/20 text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Ajanlar devrede
              </div>
            </div>

            {/* API Hatası */}
            {apiError && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Bağlantı Hatası</p>
                  <p className="text-xs mt-1 opacity-80">{apiError}</p>
                  <p className="text-xs mt-1 opacity-60">Backend sunucunun çalıştığından emin olun: uvicorn api.main:app --reload</p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]">
              <AgentPlan 
                isSimulating={analysisStatus === 'bekliyor' || analysisStatus === 'processing'} 
                isFinished={analysisStatus === 'completed' || analysisStatus === 'failed'} 
              />
            </div>

            {/* Durum göstergesi */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#737373]">
              {!canGoToResults ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span className="animate-pulse">
                    {analysisStatus === 'bekliyor' && 'Ajan kuyruğa alındı, başlatılıyor...'}
                    {analysisStatus === 'processing' && 'Pazar araştırması ve fiyat analizi yapılıyor...'}
                    {analysisStatus === 'idle' && 'Bağlantı kuruluyor...'}
                  </span>
                </>
              ) : (
                <span className={analysisStatus === 'completed' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                  {analysisStatus === 'completed' ? '✓ Analiz tamamlandı!' : '⚠ Analiz başarısız oldu.'}
                </span>
              )}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              {canGoToResults ? (
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors"
                >
                  Sonuçları Gör <ChevronRight size={18} />
                </button>
              ) : (
                <div className="w-40" />
              )}
            </div>
          </Reveal>
        )}

        {/* ADIM 4 — Rapor */}
        {currentStep === 4 && (
          <Reveal variant="fadeIn" className="flex flex-col">
            {reportJson ? (
              <PresaleReportCard
                productName={formData.productName}
                reportContent={reportJson}
                onSave={() => {
                  // Raporu kaydet ve state'i sıfırla — bir sonraki ziyarette baştan başlasın
                  clearSessionStorageByPrefix('satisOncesi_');
                  sessionStorage.removeItem('agentPlan_tasks');
                  sessionStorage.removeItem('agentPlan_expanded');
                  alert('Rapor kaydedildi! Yeni bir analiz başlatabilirsiniz.');
                }}
                onProceed={() => {
                  clearSessionStorageByPrefix('satisOncesi_');
                  navigate('/ajanlar/satis-sureci');
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle2 className="text-white" size={48} strokeWidth={1.5} />
                <h2 className="text-4xl font-bold text-white">Analiz Tamamlandı!</h2>
                <p className="text-[#a3a3a3] text-center max-w-md text-lg">
                  Rapor verisi henüz yüklenemedi. Analizler sayfasından görüntüleyebilirsiniz.
                </p>
                <div className="flex gap-4 mt-8 w-full max-w-md relative z-50">
                  <button
                    onClick={() => {
                      clearSessionStorageByPrefix('satisOncesi_');
                      sessionStorage.removeItem('agentPlan_tasks');
                      sessionStorage.removeItem('agentPlan_expanded');
                      setCurrentStep(1);
                      setFormData(DEFAULT_FORM);
                      setAnalysisId(null);
                      setAnalysisStatus('idle');
                      setReportJson(null);
                      setApiError(null);
                    }}
                    className="flex-1 border border-white/10 text-white/70 rounded-2xl px-6 py-4 font-medium hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Yeni Analiz
                  </button>
                  <button
                    onClick={() => {
                      clearSessionStorageByPrefix('satisOncesi_');
                      sessionStorage.removeItem('agentPlan_tasks');
                      sessionStorage.removeItem('agentPlan_expanded');
                      navigate('/ajanlar/satis-sureci');
                    }}
                    className="flex-[2] bg-white text-black rounded-2xl px-8 py-4 font-bold hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    Satışa Geç →
                  </button>
                </div>
              </div>
            )}
          </Reveal>
        )}
      </div>

      {/* Step Counter */}
      <div className="text-center text-sm font-medium text-[#737373] mt-8">
        Adım {currentStep} / {STEPS.length}: <span className="text-white">{currentStepData?.title}</span>
      </div>
    </PageTransition>
  );
};
