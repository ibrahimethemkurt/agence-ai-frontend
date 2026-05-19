import { useState, useEffect, useRef } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { useListingWizard } from '../features/satis-sureci/hooks/useListingWizard';
import { useAnalysisHistory } from '../features/analizler/hooks/useAnalysisHistory';
import { Reveal } from '../components/animation/Reveal';
import { CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, Search, PlusCircle, ShoppingCart, Wand2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShineBorder } from '../components/ui/ShineBorder';
import { api } from '../lib/api';

const stepsData = [
  { id: 1, title: 'Kaynak' },
  { id: 2, title: 'Ürün' },
  { id: 3, title: 'SEO' },
  { id: 4, title: 'Fiyat' },
  { id: 5, title: 'Platform' },
  { id: 6, title: 'Onay' }
];

export const SatisSureciPage = () => {
  const { currentStep, formData, nextStep, prevStep, updateData } = useListingWizard();
  const navigate = useNavigate();
  const { completedReports } = useAnalysisHistory();

  const [isPublished, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [polling, setPolling] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Polling for Step 3 (SEO & Görsel İşleme)
  useEffect(() => {
    if (currentStep === 3 && formData.listingId && !formData.seoTitle) {
      setPolling(true);
      const interval = setInterval(async () => {
        try {
          const listing = await api.getListing(formData.listingId as number);
          if (listing.status === 'seo_completed' || listing.status === 'completed') {
            clearInterval(interval);
            setPolling(false);
            
            // Verileri doldur
            let seoData = { title: '', description: '', tags: [] as string[] };
            try {
               seoData = JSON.parse(listing.agent_output_json || '{}');
            } catch(e) {}
            
            updateData({
              processedPhotoUrl: listing.processed_photo_url || listing.photo_url,
              seoTitle: seoData.title || '',
              seoDescription: seoData.description || '',
              seoTags: seoData.tags || []
            });
          } else if (listing.status === 'failed') {
            clearInterval(interval);
            setPolling(false);
            alert("Ajanlar işlem sırasında bir hatayla karşılaştı.");
          }
        } catch (err) {
          console.error(err);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStep, formData.listingId, formData.seoTitle]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await api.uploadImage(file);
      updateData({ photoUrl: data.photo_url });
    } catch (err) {
      alert("Resim yüklenemedi");
    } finally {
      setUploading(false);
    }
  };

  const handlePrepare = async () => {
    setPreparing(true);
    try {
      const productName = formData.sourceType === 'analyzed' ? formData.selectedProduct : formData.productName;
      const data = await api.prepareListing({
        product_name: productName,
        photo_url: formData.photoUrl,
        source_type: formData.sourceType
      });
      updateData({ listingId: data.id, seoTitle: '' }); // Yeni listeleme için seoTitle temizlenir (polling başlasın diye)
      nextStep();
    } catch (err: any) {
      alert(`Hazırlık başlatılamadı: ${err.message}`);
    } finally {
      setPreparing(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.publishListing({
        listing_id: formData.listingId!,
        price: parseFloat(formData.price) || 0,
        platforms: formData.platforms,
        seo_title: formData.seoTitle,
        seo_description: formData.seoDescription,
        seo_tags: formData.seoTags,
        cost_price: parseFloat(formData.purchasePrice) || 0,
        stock: parseInt(formData.stock) || 0,
        shipping_cost: parseFloat(formData.shippingCost) || 0,
        vat_rate: parseFloat(formData.vatRate) || 0,
        commission_rate: parseFloat(formData.commissionRate) || 0,
      });
      setIsPublished(true);
    } catch (err: any) {
      alert(`Yayınlanamadı: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  const togglePlatform = (platform: string) => {
    if (formData.platforms.includes(platform)) {
      updateData({ platforms: formData.platforms.filter(p => p !== platform) });
    } else {
      updateData({ platforms: [...formData.platforms, platform] });
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(t => t.trim());
    updateData({ seoTags: tags });
  };

  const extractPriceFromReport = (reportText?: string | null) => {
    if (!reportText) return null;
    
    // 1. JSON parse
    try {
      const parsed = JSON.parse(reportText);
      if (parsed.onerilen_satis_fiyati) return String(parsed.onerilen_satis_fiyati);
    } catch(e) {}

    // 2. Regex ile farklı markdown formatlarından çekme
    const patterns = [
      /önerilen satış fiyatı[^\d]*?(\d[\d.,]*)\s*tl/i,
      /(\d[\d.,]*)\s*tl[^\n]*?önerilen/i,
      /en az\s*(\d[\d.,]*)\s*tl/i,
      /(\d[\d.,]*)\s*tl\s*satış fiyatı ile/i
    ];
    
    for (const pattern of patterns) {
      const match = reportText.match(pattern);
      if (match) {
        let raw = match[1];
        raw = raw.replace(/\./g, '');
        raw = raw.split(',')[0];
        return raw;
      }
    }
    return null;
  };

  // Seçili ürün veya herhangi tamamlanmış rapordaki önerilen fiyatı çek
  const getRecommendedPrice = () => {
    const productName = formData.sourceType === 'analyzed'
      ? formData.selectedProduct
      : formData.productName;
    const report = productName
      ? (completedReports.find(r => r.product_name === productName) || completedReports[0])
      : completedReports[0];
      
    if (!report || !report.report_json) return null;
    return extractPriceFromReport(report.report_json);
  };
  const recommendedPrice = getRecommendedPrice();

  return (
    <PageTransition className="max-w-5xl mx-auto py-8">
      
      {/* Top Custom Step Indicator */}
      <div className="flex justify-between items-end border-b border-[#2a2a2a] pb-6 mb-10 px-4">
        {stepsData.map((step) => {
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 relative">
              {isPassed ? (
                 <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-black" />
                 </div>
              ) : (
                 <div className={`w-4 h-4 rounded-full transition-all duration-300 ${isActive ? 'bg-white ring-4 ring-white/20' : 'bg-[#2a2a2a]'}`} />
              )}
              <span className={`text-sm transition-colors duration-300 ${isActive ? 'font-bold text-white' : 'font-medium text-[#737373]'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Card Container */}
      <div className="bg-[#121212] rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl min-h-[500px] flex flex-col">
        
        {/* ADIM 1: KAYNAK SEÇİMİ (GitHub orijinal tasarım) */}
        {currentStep === 1 && (
          <Reveal variant="fadeIn" className="flex flex-col flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ürün Kaynağını Seçin</h2>
              <p className="text-[#a3a3a3] text-base">Satış sürecini başlatmak için ürünün nasıl ekleneceğini belirleyin.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              
              {/* Option 1: Analiz Edilen Ürünler */}
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

              {/* Option 2: Manuel Ürün Ekleme */}
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

        {/* ADIM 2: ÜRÜN DETAYLARI VE GÖRSEL */}
        {currentStep === 2 && (
          <Reveal variant="fadeIn" className="flex flex-col flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Ürün ve Görsel Seçimi</h2>
              <p className="text-[#a3a3a3] text-base">Ürünün kaynağını ve optimize edilecek ana görselini yükleyin.</p>
            </div>
            
            <div className="space-y-8 flex-1">
               {/* Analiz Edilenlerden Seç */}
               {formData.sourceType === 'analyzed' && (
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Kayıtlı Analizlerden Seç</label>
                    <select 
                      value={formData.selectedProduct}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        let defaultPrice = formData.price;
                        
                        const report = completedReports.find(r => r.product_name === selectedName);
                        if (report && report.report_json) {
                          const extracted = extractPriceFromReport(report.report_json);
                          if (extracted) {
                            defaultPrice = extracted;
                          }
                        }
                        
                        updateData({ selectedProduct: selectedName, price: defaultPrice });
                      }}
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-500 appearance-none"
                    >
                      <option value="" disabled>Ürün seçiniz...</option>
                      {completedReports.map(report => (
                          <option key={report.id} value={report.product_name}>
                            {report.product_name}
                          </option>
                      ))}
                    </select>
                  </div>
               )}

               {/* Manuel Ürün Adı */}
               {formData.sourceType === 'manual' && (
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
               )}

               {/* Görsel Yükleme Alanı */}
               {(formData.sourceType) && (
                 <div>
                    <label className="block text-sm font-bold text-white mb-2">Ürün Görseli</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-[#2a2a2a] rounded-xl bg-[#0a0a0a] hover:bg-[#111] transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
                    >
                      {uploading ? (
                        <span className="text-sm text-[#737373]">Yükleniyor...</span>
                      ) : formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-[#737373] mb-3" />
                          <span className="text-sm text-[#737373]">Görsel Yüklemek İçin Tıklayın</span>
                        </>
                      )}
                    </div>
                 </div>
               )}
            </div>

            <div className="mt-auto pt-12 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                className="flex items-center gap-2 bg-[#121212] border border-[#2a2a2a] text-[#a3a3a3] rounded-2xl px-6 py-3 font-medium hover:text-white hover:bg-[#1e1e1e] transition-colors"
              >
                <ChevronLeft size={18} /> Geri
              </button>
              <button 
                onClick={handlePrepare} 
                disabled={preparing || !formData.photoUrl || (formData.sourceType === 'analyzed' ? !formData.selectedProduct : !formData.productName)}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {preparing ? 'Hazırlanıyor...' : 'İleri (AI İşleme)'} <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}


        {/* ADIM 3: SEO VE GÖRSEL */}
        {currentStep === 3 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full flex-1">
            {polling ? (
               <div className="flex flex-col items-center justify-center flex-1 py-20">
                  <Wand2 className="text-[#A07CFE] mb-6 animate-pulse" size={64} />
                  <h3 className="text-2xl font-bold text-white mb-2">Ajanlar Çalışıyor...</h3>
                  <p className="text-[#737373] text-center max-w-sm">
                     Ürün görselinin arka planı yapay zeka ile temizleniyor ve platformlara uygun SEO başlık/açıklamaları Gemini tarafından üretiliyor.
                  </p>
               </div>
            ) : (
               <div className="flex flex-col flex-1">
                  <div className="mb-8 flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">SEO ve Optimizasyon</h2>
                      <p className="text-[#a3a3a3] text-base">Ajanların ürettiği içerikleri düzenleyebilirsiniz.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                     {/* Görseller Yan Yana */}
                     <div className="flex flex-col gap-4">
                        <label className="text-sm font-bold text-white">Görsel Karşılaştırması</label>
                        <div className="flex gap-4">
                           <div className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-2 relative">
                              <span className="absolute top-2 left-2 bg-black/50 px-2 py-1 text-xs rounded text-white backdrop-blur">Orijinal</span>
                              <img src={formData.photoUrl} alt="Original" className="w-full h-40 object-cover rounded-lg" />
                           </div>
                           <div className="flex-1 bg-[#1a1a1a] border border-green-500/30 rounded-xl p-2 relative shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                              <span className="absolute top-2 left-2 bg-green-500/80 px-2 py-1 text-xs rounded text-black font-bold backdrop-blur">Optimize</span>
                              <img src={formData.processedPhotoUrl} alt="Processed" className="w-full h-40 object-contain rounded-lg bg-[#111]" />
                           </div>
                        </div>
                     </div>

                     {/* SEO Metinleri */}
                     <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-white mb-2">SEO Başlığı</label>
                          <input 
                            type="text" 
                            value={formData.seoTitle}
                            onChange={(e) => updateData({ seoTitle: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-white mb-2">SEO Açıklaması</label>
                          <textarea 
                            value={formData.seoDescription}
                            onChange={(e) => updateData({ seoDescription: e.target.value })}
                            rows={4}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-white mb-2">Etiketler (Virgülle ayırın)</label>
                          <input 
                            type="text" 
                            value={formData.seoTags.join(', ')}
                            onChange={handleTagChange}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                          />
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
                      className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors"
                    >
                      İleri <ChevronRight size={18} />
                    </button>
                  </div>
               </div>
            )}
          </Reveal>
        )}

        {/* ADIM 4: FİYAT */}
        {currentStep === 4 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Fiyat Belirleme</h2>
              <p className="text-[#a3a3a3] text-base">Ürününüzün pazar yerlerindeki ana satış fiyatını girin.</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center">
               <div className="w-full flex flex-col gap-6">
                 
                 {/* Üst Kısım: Satış Fiyatı & Önerilen Fiyat */}
                 <div className="flex flex-col md:flex-row gap-6 items-start">
                   <div className="flex-1 w-full">
                     <label className="block text-sm font-bold text-white mb-2">Hedef Satış Fiyatı (₺)</label>
                     <input 
                       type="number" 
                       value={formData.price}
                       onChange={(e) => updateData({ price: e.target.value })}
                       placeholder="0.00"
                       className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-2xl text-white font-bold focus:outline-none focus:border-green-500 transition-colors"
                     />
                   </div>
                   <div className="md:w-48 w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-1">
                     <span className="text-xs text-[#737373] font-medium">Önerilen Fiyat</span>
                     <span className="text-xl font-bold text-green-400">
                       {recommendedPrice ? `₺${recommendedPrice}` : '—'}
                     </span>
                     <span className="text-[10px] text-[#555]">Pazar Analizi</span>
                   </div>
                 </div>

                 {/* Alt Kısım: Maliyet Detayları */}
                 <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-6 mt-4">
                   <div className="mb-6">
                     <h3 className="text-xl font-bold text-white">Maliyet Detayları</h3>
                     <p className="text-sm text-[#737373] mt-1">Karlılık hesabı ve komisyon analizi için maliyet verilerini doldurun.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <div>
                       <label className="block text-sm font-bold text-white mb-2">Toptan Alış Fiyatı (₺)</label>
                       <input 
                         type="number"
                         value={formData.purchasePrice}
                         onChange={(e) => updateData({ purchasePrice: e.target.value })}
                         placeholder="0.00"
                         className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-white mb-2">Stok Adedi</label>
                       <input 
                         type="number"
                         value={formData.stock}
                         onChange={(e) => updateData({ stock: e.target.value })}
                         placeholder="100"
                         className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-white mb-2">Kargo Ücreti (₺)</label>
                       <input 
                         type="number"
                         value={formData.shippingCost}
                         onChange={(e) => updateData({ shippingCost: e.target.value })}
                         placeholder="0.00"
                         className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-white mb-2">KDV Oranı (%)</label>
                       <input 
                         type="number"
                         value={formData.vatRate}
                         onChange={(e) => updateData({ vatRate: e.target.value })}
                         placeholder="20"
                         className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                       />
                     </div>
                     <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-white mb-2">Platform Komisyon Oranı (%)</label>
                       <input 
                         type="number"
                         value={formData.commissionRate}
                         onChange={(e) => updateData({ commissionRate: e.target.value })}
                         placeholder="15"
                         className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                       />
                     </div>
                   </div>
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
                disabled={!formData.price}
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50"
              >
                İleri <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {/* ADIM 5: PLATFORM */}
        {currentStep === 5 && (
          <Reveal variant="fadeIn" className="flex flex-col h-full flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Platform Seçimi</h2>
              <p className="text-[#a3a3a3] text-base">Ürünün yayınlanacağı hedef pazar yerlerini seçin.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 flex-1 content-center">
              {['Amazon', 'Trendyol', 'Hepsiburada', 'Çiçeksepeti'].map((platform) => {
                const isSelected = formData.platforms.includes(platform);
                return (
                  <div 
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`cursor-pointer border-2 rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'bg-white/10 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#737373] hover:border-white/30'
                    }`}
                  >
                    <ShoppingCart size={40} className="mb-4" />
                    <span className="font-bold text-xl">{platform}</span>
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
                className="flex items-center gap-2 bg-[#e5e5e5] text-black rounded-2xl px-8 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50"
              >
                İleri <ChevronRight size={18} />
              </button>
            </div>
          </Reveal>
        )}

        {/* ADIM 6: ONAY */}
        {currentStep === 6 && (
          <Reveal variant="fadeIn" className="flex flex-col flex-1 h-full">
            {!isPublished ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Son Kontrol ve Onay</h2>
                  <p className="text-[#a3a3a3] text-base">Ürününüz yayına alınmadan önce detayları son kez gözden geçirin.</p>
                </div>
                
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-48 h-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                        <img src={formData.processedPhotoUrl} alt="Product" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex flex-col w-full">
                      <h3 className="text-2xl font-bold text-white mb-2">{formData.seoTitle}</h3>
                      <p className="text-[#a3a3a3] text-sm mb-4 leading-relaxed line-clamp-3">
                        {formData.seoDescription}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                         {formData.seoTags.map(t => (
                            <span key={t} className="text-xs bg-[#2a2a2a] text-[#a3a3a3] px-2 py-1 rounded">#{t}</span>
                         ))}
                      </div>

                      <div className="flex gap-6 items-center flex-wrap pt-4 border-t border-[#2a2a2a] w-full">
                        <div className="bg-[#1a1a1a] px-5 py-3 rounded-xl border border-green-500/20">
                          <span className="text-[#737373] text-xs block mb-1">Satış Fiyatı</span>
                          <span className="text-2xl font-bold text-green-400">₺{formData.price}</span>
                        </div>
                        <div className="flex gap-2">
                          {formData.platforms.map(p => (
                            <span key={p} className="bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/10">{p}</span>
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
                    onClick={() => setShowConfirmModal(true)}
                    disabled={publishing}
                    className="flex items-center gap-2 bg-green-500 text-black rounded-2xl px-8 py-3 font-bold hover:bg-green-400 transition-colors"
                  >
                    {publishing ? 'Yayınlanıyor...' : 'Onayla ve Yayınla'} <CheckCircle2 size={18} />
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
                  Ajanlarımız ürün listelemelerini seçtiğiniz {formData.platforms.length} platform için senkronize etti ve kataloglara başarıyla aktardı.
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

      {/* Onay Modalı */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-[#737373] hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 border border-yellow-500/20">
                <AlertTriangle className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Emin misiniz?</h3>
              <p className="text-[#a3a3a3] mb-8">
                Bu ürün seçtiğiniz <strong className="text-white">{formData.platforms.join(', ')}</strong> platformlarında <strong>₺{formData.price}</strong> fiyatıyla anında satışa açılacaktır. Onaylıyor musunuz?
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-4 bg-transparent border border-[#2a2a2a] text-white rounded-xl font-bold hover:bg-[#1a1a1a] transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={() => {
                    setShowConfirmModal(false);
                    handlePublish();
                  }}
                  className="flex-1 py-3 px-4 bg-green-500 text-black rounded-xl font-bold hover:bg-green-400 transition-colors"
                >
                  Evet, Yayınla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};
