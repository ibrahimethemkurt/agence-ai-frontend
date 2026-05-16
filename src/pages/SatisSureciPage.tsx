import { useState, useEffect } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useListingWizard } from '../features/satis-sureci/hooks/useListingWizard';
import { Reveal } from '../components/animation/Reveal';
import { CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, Search, PlusCircle, ShoppingCart } from 'lucide-react';
import AgentPlan, { type Task } from '../components/ui/agent-plan';
import { useNavigate } from 'react-router-dom';
import { ShineBorder } from '../components/ui/ShineBorder';

const stepsData = [
  { id: 1, title: 'Kaynak' },
  { id: 2, title: 'Ürün' },
  { id: 3, title: 'Platform' },
  { id: 4, title: 'Yapay Zeka' },
  { id: 5, title: 'Onay' }
];

const salesTasks: Task[] = [
  {
    id: "1",
    title: "SEO Optimizasyonu ve Metin Üretimi",
    description: "Platformların algoritmalarına uygun başlık ve açıklamalar üretiliyor",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Anahtar Kelime Taraması",
        description: "En çok aranan ve dönüşüm getiren anahtar kelimeler belirleniyor",
        status: "completed",
        priority: "high",
        tools: ["seo-analyzer"],
      },
      {
        id: "1.2",
        title: "Platform Spesifik Açıklamalar",
        description: "Amazon, Trendyol ve diğer platformlar için ayrı HTML formatlı açıklamalar yazılıyor",
        status: "in-progress",
        priority: "high",
        tools: ["content-generator"],
      }
    ],
  },
  {
    id: "2",
    title: "Görsel ve Fiyat Uyumlandırma",
    description: "Yüklenen görseller ve girilen fiyat bilgisi platform kurallarına göre işleniyor",
    status: "pending",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "2.1",
        title: "Görsel Optimizasyonu",
        description: "Beyaz arka plan kontrolü ve boyutlandırma işlemi yapılıyor",
        status: "pending",
        priority: "high",
        tools: ["image-processor"],
      },
      {
        id: "2.2",
        title: "Platform Komisyonlu Fiyatlandırma",
        description: "Seçilen her platformun kendi komisyonuna göre fiyat dengesi kuruluyor",
        status: "pending",
        priority: "medium",
        tools: ["calculator-agent"],
      }
    ],
  },
  {
    id: "3",
    title: "Entegrasyon ve API Aktarımı",
    description: "Hazırlanan ürün verileri ilgili pazar yerlerinin API'lerine iletiliyor",
    status: "pending",
    priority: "high",
    level: 1,
    dependencies: ["1", "2"],
    subtasks: [
      {
        id: "3.1",
        title: "Katalog Eşleştirme",
        description: "Ürünlerin platform kataloglarındaki doğru kategoriye map edilmesi",
        status: "pending",
        priority: "high",
        tools: ["api-connector"],
      },
      {
        id: "3.2",
        title: "Aktarım Onayı Bekleniyor",
        description: "Platformlardan dönen onay veya hata mesajlarının denetimi",
        status: "pending",
        priority: "high",
        tools: ["validation-bot"],
      }
    ],
  }
];

export const SatisSureciPage = () => {
  const { currentStep, formData, nextStep, prevStep, updateData, setStep } = useListingWizard();
  const navigate = useNavigate();

  const currentStepData = stepsData.find(s => s.id === currentStep);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (currentStep === 4) {
      setShowResultsButton(false);
      const timer = setTimeout(() => {
        setShowResultsButton(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const togglePlatform = (platform: string) => {
    if (formData.platforms.includes(platform)) {
      updateData({ platforms: formData.platforms.filter(p => p !== platform) });
    } else {
      updateData({ platforms: [...formData.platforms, platform] });
    }
  };

  return (
    <PageTransition className="max-w-4xl mx-auto py-8">
      
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
      <div className="bg-[#121212] rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl min-h-[500px] flex flex-col">
        {currentStep === 1 && (
          <Reveal variant="fadeIn" className="flex flex-col flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ürün Kaynağını Seçin</h2>
              <p className="text-[#a3a3a3] text-base">Satış sürecini başlatmak için ürünün nasıl ekleneceğini belirleyin.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              
              {/* Option 1: Analiz Edilen Ürünler (Shine Border effect requested by user) */}
              <div 
                onClick={() => { updateData({ sourceType: 'analyzed' }); nextStep(); }}
                className="group relative cursor-pointer h-64"
              >
                <ShineBorder 
                  className="w-full h-full rounded-[24px] border border-[#2a2a2a] transition-transform group-hover:scale-[1.02]"
                  innerClassName="bg-[#0a0a0a] flex flex-col items-center justify-center p-8"
                  gradient="from-[#A07CFE] via-[#FE8FB5] to-[#FFBE7B]"
                >
                  <Search size={48} className="text-white mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-bold text-white mb-2 text-center">Analiz Edilen Ürünlerden Seç</h3>
                  <p className="text-sm text-[#737373] text-center">Önceden maliyet ve pazar analizi yaptığınız ürünleri kullanarak hızlıca listeleme yapın.</p>
                </ShineBorder>
              </div>

              {/* Option 2: Kendim Ürün Eklemek İstiyorum */}
              <div 
                onClick={() => { updateData({ sourceType: 'manual' }); nextStep(); }}
                className="group w-full h-64 bg-[#0a0a0a] rounded-[24px] border border-[#2a2a2a] hover:border-white/20 hover:bg-[#111111] transition-all cursor-pointer flex flex-col items-center justify-center p-8 hover:scale-[1.02]"
              >
                <PlusCircle size={48} className="text-[#737373] group-hover:text-white mb-6 transition-colors" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-[#a3a3a3] group-hover:text-white mb-2 text-center transition-colors">Kendim Ürün Eklemek İstiyorum</h3>
                <p className="text-sm text-[#555] group-hover:text-[#737373] text-center transition-colors">Sisteme daha önce girmediğiniz, tamamen yeni bir ürünü manuel olarak sıfırdan ekleyin.</p>
              </div>

            </div>
          </Reveal>
        )}

        {currentStep === 2 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ürün Detayları</h2>
              <p className="text-[#a3a3a3] text-base">Ürününüzün temel listeleme verilerini tamamlayın.</p>
            </div>
            
            <div className="space-y-6">
              
              {formData.sourceType === 'analyzed' ? (
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Kayıtlı Analizlerden Seç</label>
                  <select 
                    value={formData.selectedProduct}
                    onChange={(e) => updateData({ selectedProduct: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-500 appearance-none"
                  >
                    <option value="" disabled>Ürün seçiniz...</option>
                    <option value="iphone15">Apple iPhone 15 Pro Max 256GB Siyah</option>
                    <option value="fabercastell">Faber-Castell 0.5mm Versatil Kalem</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Ürün Adı</label>
                    <input 
                      type="text" 
                      value={formData.productName}
                      onChange={(e) => updateData({ productName: e.target.value })}
                      placeholder="Tam ve net ürün adını giriniz..."
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Ürün Açıklaması</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => updateData({ description: e.target.value })}
                      placeholder="Ürün özelliklerini ve avantajlarını detaylıca yazınız..."
                      rows={4}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Ürün Görseli</label>
                  <div className="w-full h-32 border-2 border-dashed border-[#2a2a2a] rounded-xl bg-[#0a0a0a] hover:bg-[#111] transition-colors flex flex-col items-center justify-center cursor-pointer">
                    <UploadCloud size={24} className="text-[#737373] mb-2" />
                    <span className="text-sm text-[#737373]">Görsel Yüklemek İçin Tıklayın</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Hedef Satış Fiyatı (₺)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => updateData({ price: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-gray-500"
                  />
                  <p className="text-xs text-[#555] mt-2 italic">* Ajanlarımız seçtiğiniz platformlara göre bu fiyatta komisyon optimizasyonu yapacaktır.</p>
                </div>
              </div>

            </div>

            <div className="mt-auto pt-12 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              <button 
                onClick={nextStep} 
                disabled={formData.sourceType === 'analyzed' ? (!formData.selectedProduct || !formData.price) : (!formData.productName || !formData.price)}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İleri <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {currentStep === 3 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Platform Seçimi</h2>
              <p className="text-[#a3a3a3] text-base">Ürünün yayınlanacağı hedef pazar yerlerini seçin.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Amazon', 'Trendyol', 'Hepsiburada', 'Çiçeksepeti'].map((platform) => {
                const isSelected = formData.platforms.includes(platform);
                return (
                  <div 
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`cursor-pointer border rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'bg-white/10 border-white text-white shadow-lg shadow-white/5' : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#737373] hover:border-white/30'
                    }`}
                  >
                    <ShoppingCart size={32} className="mb-4" />
                    <span className="font-bold">{platform}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-12 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              <button 
                onClick={nextStep} 
                disabled={formData.platforms.length === 0}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajanları Başlat <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {currentStep === 4 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full flex-1">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Ajanlar Devrede</h2>
                <p className="text-[#a3a3a3] text-base">Ürününüz platformlar için özel olarak optimize ediliyor ve listeleniyor...</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Çalışıyor
              </div>
            </div>
             
            <div className="flex-1 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]">
               <AgentPlan customTasks={salesTasks} />
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> İptal
              </button>
              {showResultsButton ? (
                <button 
                  onClick={nextStep} 
                  className="flex items-center gap-2 bg-green-500 text-black rounded-2xl px-8 py-3 font-bold hover:bg-green-400 transition-colors"
                >
                  Sonuçları Gör <ChevronRight size={18} />
                </button>
              ) : (
                <div className="text-sm text-[#737373] animate-pulse">
                  Listelemeler yapılıyor, lütfen bekleyin...
                </div>
              )}
            </div>
          </Reveal>
        )}

        {currentStep === 5 && (
          <Reveal variant="fadeIn" className="flex flex-col flex-1 h-full">
            {!isPublished ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Son Kontrol ve Onay</h2>
                  <p className="text-[#a3a3a3] text-base">Ürününüz yayına alınmadan önce detayları son kez gözden geçirin.</p>
                </div>
                
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-6 flex-1 flex flex-col justify-center">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-40 h-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0">
                       <UploadCloud size={40} className="text-[#737373]" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-3">{formData.sourceType === 'analyzed' ? (formData.selectedProduct === 'iphone15' ? 'Apple iPhone 15 Pro Max 256GB Siyah' : 'Faber-Castell 0.5mm Versatil Kalem') : formData.productName || 'Yeni Ürün'}</h3>
                      <p className="text-[#a3a3a3] text-base mb-6 leading-relaxed">
                        {formData.description || 'Bu ürün için SEO uyumlu başlık ve açıklamalar ajanlarımız tarafından başarıyla üretildi.'}
                      </p>
                      <div className="flex gap-6 items-center flex-wrap">
                        <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#2a2a2a]">
                          <span className="text-[#737373] text-xs block mb-1">Satış Fiyatı</span>
                          <span className="text-xl font-bold text-green-400">₺{formData.price}</span>
                        </div>
                        <div className="flex gap-2">
                          {formData.platforms.map(p => (
                            <span key={p} className="bg-white/10 text-white text-sm font-medium px-3 py-1.5 rounded-lg border border-white/10">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-between items-center">
                  <button 
                    onClick={prevStep} 
                    className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
                  >
                    <ChevronLeft size={18} /> Geri Dön
                  </button>
                  <button 
                    onClick={() => setIsPublished(true)}
                    className="flex items-center gap-2 bg-green-500 text-black rounded-2xl px-8 py-3 font-bold hover:bg-green-400 transition-colors"
                  >
                    Onayla ve Yayınla <CheckCircle2 size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 flex-1">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-inner">
                  <CheckCircle2 className="text-green-500" size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-white">Ürün Yayında!</h2>
                <p className="text-[#a3a3a3] text-center max-w-md mb-12 text-lg">
                  Ajanlarımız ürün listelemelerini seçtiğiniz {formData.platforms.length} platform için optimize etti ve entegrasyon havuzuna başarıyla aktardı.
                </p>
                
                <div className="flex gap-4 w-full max-w-md">
                  <button 
                    onClick={() => navigate('/satista-olan-urunler')}
                    className="flex-[2] flex justify-center items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-4 font-bold hover:bg-white transition-colors"
                  >
                    Satıştaki Ürünlere Git <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
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
