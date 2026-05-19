import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { LineChart, Sparkles, MessageSquareHeart, LayoutDashboard, CheckCircle2, UploadCloud, Tag, ShoppingBag, Mic } from 'lucide-react';
import { Reveal } from '../components/animation/Reveal';
import { BorderBeam } from '../components/ui/border-beam';

import Spline from '@splinetool/react-spline';
const DeferredSpline = ({ scene, className, priority = false }: { scene: string, className?: string, priority?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "1000px" });
  const shouldRender = priority || isInView;

  return (
    <div ref={ref} className={className}>
      {shouldRender && (
        <Spline scene={scene} className="w-full h-full" />
      )}
    </div>
  );
};

const SLOGANS = [
  "odaklanın, operasyonu yapay zekaya bırakın.",
  "açılmanın en otonom ve akıllı yolu.",
  "giden yolda tüm yükünüzü hafifletiyoruz.",
  "hükmedin, arka planı ajanlarımız yönetsin.",
  "inmenin en zahmetsiz, en teknolojik yolu.",
  "çıkın, e-ticaretin karmaşasını geride bırakın."
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.id || entry.target.querySelector('section[id]')?.id;
            if (targetId) {
              window.history.replaceState(null, '', `#${targetId}`);
            } else {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('.snap-start');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div id="main-scroll-container" className="h-screen w-full bg-white text-gray-900 font-body relative overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth selection:bg-gray-900 selection:text-white">

      {/* Spline Background (Locked to the viewport so it stays behind all sections) */}
      <div 
        className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-auto overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onWheelCapture={(e) => {
          const container = document.getElementById('main-scroll-container');
          if (container) {
            container.scrollBy({ top: e.deltaY, behavior: 'auto' });
          }
        }}
      >
        {/* We make the canvas 100px taller. The center shifts down slightly, 
            but the bottom-right logo gets pushed exactly into the hidden overflow area! */}
        <div className="absolute top-0 -left-[5%] md:-left-[15%] lg:-left-[20%] w-[105%] md:w-[115%] lg:w-[120%] h-[calc(100%+100px)] pointer-events-auto">
          <DeferredSpline priority={true} scene="https://prod.spline.design/K-fd31LMtV67Aidp/scene.splinecode" className="w-full h-full" />
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none bg-white/70 backdrop-blur-lg border-b border-gray-200/50 transition-all duration-300">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer pointer-events-auto" 
            onClick={() => {
              document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
              navigate('/');
            }}
          >
            <img src="/pazaralogo-dark.svg" alt="Pazara" className="h-9 w-auto drop-shadow-sm" />
          </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-600 pointer-events-auto">
          <a href="#ozellikler" className="hover:text-[#9333ff] transition-colors">Özellikler</a>
          <a href="#satis-sureci" className="hover:text-[#9333ff] transition-colors">Satış Süreci</a>
          <a href="#teknolojilerimiz" className="hover:text-[#9333ff] transition-colors">Teknolojilerimiz</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6 pointer-events-auto">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-600 hover:text-[#9333ff] transition-colors">
            Giriş Yap
          </button>
          <div className="relative rounded-full">
            <button onClick={() => navigate('/register')} className="relative z-10 bg-[#9333ff] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#7b22df] transition-colors shadow-md">
              Hesap Oluştur
            </button>
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <BorderBeam size={60} duration={4} borderWidth={3} colorFrom="#3b0764" colorTo="#c084fc" />
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="snap-start relative z-10 w-full h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pointer-events-none pt-20">

        {/* Text Content - Left Side (Drops from top after 4 seconds) */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-[50%] flex flex-col items-start text-left pb-20 mt-10 pointer-events-auto"
        >

          {/* Logo as the subject */}
          <img src="/pazaralogo-dark.svg" alt="Pazara" className="h-12 md:h-14 lg:h-16 w-auto mb-6 drop-shadow-sm" />

          {/* Rotating Slogans */}
          <div className="w-full">
            <div className="h-[100px] md:h-[120px] w-full relative mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sloganIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute top-0 left-0 text-2xl md:text-3xl lg:text-[34px] font-display font-medium text-gray-800 tracking-tight leading-[1.3] max-w-[500px]"
                >
                  {SLOGANS[sloganIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Static Description */}
          <p className="text-base md:text-lg text-gray-700 max-w-lg mb-10 leading-relaxed font-medium">
            Karmaşık panellerle uğraşmayın. Akıllı ajanlarımız <span className="whitespace-nowrap">e-ticaret</span> süreçlerinizi baştan sona otomatikleştirip kolaylaştırarak size sadece satışları artırmayı bırakır.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button onClick={() => navigate('/register')} className="bg-black text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-gray-800 transition-all w-full sm:w-auto shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
              Hemen Başlayın — Ücretsiz
            </button>
          </div>

        </motion.div>
      </main>

      {/* Features Section Container with Solid White Background */}
      <div className="snap-start w-full bg-white relative z-20 h-screen flex flex-col justify-center overflow-hidden pt-20">
        <section id="ozellikler" className="w-full px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-center">
          
          {/* Top Row: Title (Left) & Description (Right) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 w-full">
            <div className="max-w-2xl">
              <Reveal variant="fadeUp">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] font-display font-semibold text-gray-900 tracking-tight leading-[1.2]">
                  E-ticaretin tüm yükünü <br className="hidden md:block"/> yapay zeka ajanlarına devredin.
                </h2>
              </Reveal>
            </div>
            <div className="max-w-sm">
              <Reveal variant="fadeUp" delay={0.2}>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left md:text-right">
                  Pazara ile tanışın. Sizin yerinize pazar analizi yapan, ürün yükleyen ve müşteri destek süreçlerini yöneten otonom ajan ekibiniz.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Middle Row: Image (Constrained height to fit one screen) */}
          <Reveal variant="fadeUp" delay={0.4} className="w-full mb-8">
            <div className="relative w-full h-[250px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden border border-gray-100 shadow-xl bg-white">
              <img src="/landingpanel.svg" alt="Pazara Dashboard" className="w-full h-full object-cover object-top" />
              {/* Minimal White Fade Gradient */}
              <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          </Reveal>

          {/* Bottom Row: 4 Agent Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
             {/* Card 1 */}
             <Reveal variant="fadeUp" delay={0.5}>
               <div className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm overflow-hidden group h-full hover:shadow-md transition-shadow">
                  <BorderBeam size={80} duration={12} delay={0} colorFrom="#a855f7" colorTo="#d8b4fe" borderWidth={1.5} />
                  <div className="mb-3">
                    <LineChart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">Satış Öncesi</h3>
                  <p className="text-gray-700 text-xs font-medium leading-relaxed">
                    Pazar ve fiyat analizi çıkaran özel takımımız.
                  </p>
               </div>
             </Reveal>
             
             {/* Card 2 */}
             <Reveal variant="fadeUp" delay={0.6}>
               <div className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm overflow-hidden group h-full hover:shadow-md transition-shadow">
                  <BorderBeam size={80} duration={12} delay={3} colorFrom="#3b82f6" colorTo="#93c5fd" borderWidth={1.5} />
                  <div className="mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">Satış Süreci</h3>
                  <p className="text-gray-700 text-xs font-medium leading-relaxed">
                    Görsel, SEO ve platform entegrasyonu ajanı.
                  </p>
               </div>
             </Reveal>

             {/* Card 3 */}
             <Reveal variant="fadeUp" delay={0.7}>
               <div className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm overflow-hidden group h-full hover:shadow-md transition-shadow">
                  <BorderBeam size={80} duration={12} delay={6} colorFrom="#10b981" colorTo="#6ee7b7" borderWidth={1.5} />
                  <div className="mb-3">
                    <MessageSquareHeart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">Satış Sonrası</h3>
                  <p className="text-gray-700 text-xs font-medium leading-relaxed">
                    Yorum, iade analizi ve anlık müşteri bildirimleri.
                  </p>
               </div>
             </Reveal>

             {/* Card 4 */}
             <Reveal variant="fadeUp" delay={0.8}>
               <div className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm overflow-hidden group h-full hover:shadow-md transition-shadow">
                  <BorderBeam size={80} duration={12} delay={9} colorFrom="#f97316" colorTo="#fdba74" borderWidth={1.5} />
                  <div className="mb-3">
                    <LayoutDashboard className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">Dashboard</h3>
                  <p className="text-gray-700 text-xs font-medium leading-relaxed">
                    Tüm e-ticaret sisteminizi karmaşadan uzak yönetin.
                  </p>
               </div>
             </Reveal>
          </div>

        </section>
      </div>

      {/* Işık Hızında Satış Bölümü */}
      <section id="satis-sureci" className="snap-start w-full bg-gray-50 relative z-20 h-screen flex flex-col justify-center border-t border-gray-100 overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8 w-full">
          
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto">
            <Reveal variant="fadeUp">
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-display font-semibold text-gray-900 tracking-tight mb-4 md:whitespace-nowrap">
                3 Tıkla Ürününü Profesyonel Şekilde Yükle
              </h2>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.2}>
              <div className="text-gray-600 text-base md:text-lg flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 mt-2">
                <span>Görseli yükle, ürün ismini gir, gerisini</span>
                <span className="flex items-center gap-1.5 mx-1">
                  <img src="/pazaralogo-dark.svg" alt="Pazara" className="h-[20px] md:h-[22px] object-contain relative top-[1px]" />
                  <span className="font-semibold text-gray-800 tracking-wide">AI</span>
                </span>
                <span>ajanları halletsin.</span>
              </div>
            </Reveal>
          </div>

          {/* Automated Process Box */}
          <Reveal variant="fadeUp" delay={0.4} className="w-full">
            <AutomatedProcess />
          </Reveal>

          {/* Platform Logos Marquee */}
          <Reveal variant="fadeUp" delay={0.6} className="w-full mt-4">
            <Logos />
          </Reveal>

        </div>
      </section>

      {/* Teknoloji ve AI Bölümü */}
      <section id="teknolojilerimiz" className="snap-start w-full bg-white relative z-20 border-t border-gray-100 h-screen flex flex-col justify-center overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col w-full">
          
          {/* Section Header */}
          <Reveal variant="fadeUp" className="mb-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
            <img src="/Google_Gemini_logo.svg" alt="Google Gemini" className="h-10 md:h-14 lg:h-16 w-auto object-contain" />
            <h2 className="text-2xl md:text-3xl lg:text-[36px] font-display font-semibold text-gray-900 tracking-tight text-center md:text-left mb-1">
              ile AI Ajanlarımız Çok Daha Güçlü
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Gemini Image with Glow */}
            <Reveal variant="fadeUp" delay={0.2} className="relative w-full aspect-square md:aspect-video lg:aspect-[4/3] flex items-center justify-center group h-[300px] md:h-[400px] lg:h-[450px]">
               {/* Glow background (Subtle, grayish) */}
               <div className="absolute inset-4 md:inset-8 bg-slate-200/70 blur-[60px] rounded-full group-hover:bg-slate-300/80 transition-all duration-700"></div>
               {/* Container (Removed white background, just showing the raw image) */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <img src="/Gemini_Resim.svg" alt="Gemini AI Integration" className="w-full h-full object-contain relative z-10 transition-all duration-700 scale-110 md:scale-[1.15] lg:scale-[1.22] -translate-x-2 md:-translate-x-4 lg:-translate-x-6 group-hover:scale-[1.25] group-hover:-translate-x-4 lg:group-hover:-translate-x-8" />
               </div>
            </Reveal>

            {/* Right: Chat Interface + Tech Logos */}
            <div className="flex flex-col gap-8 w-full h-full justify-center">
              
              <Reveal variant="fadeUp" delay={0.4} className="w-full">
                 <ChatInterfaceMockup />
              </Reveal>

              <Reveal variant="fadeUp" delay={0.6} className="w-full">
                 <TechLogos />
              </Reveal>

            </div>

          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="snap-start w-full bg-transparent relative z-20 border-t border-transparent h-screen flex flex-col justify-center overflow-hidden pointer-events-none">

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-start h-full relative z-10 pointer-events-none">
          
          {/* Left: Text & Buttons */}
          <Reveal variant="fadeUp" className="w-full md:w-1/2 flex flex-col items-center justify-center pointer-events-auto">
            <div className="flex flex-col items-center justify-center">
              <span className="text-gray-500 text-[13px] md:text-sm font-semibold tracking-[0.2em] mb-4 uppercase">SENİ</span>
              <img src="/pazaralogo-dark.svg" alt="Pazara" className="h-12 md:h-16 lg:h-20 w-auto mb-4" />
              <span className="text-gray-800 text-[13px] md:text-sm font-bold tracking-[0.2em] mb-10 uppercase">BEKLİYORUZ!</span>
              
              <div className="flex items-center gap-6 md:gap-8">
                <button onClick={() => navigate('/login')} className="text-gray-600 font-semibold text-sm md:text-[15px] hover:text-[#9333ff] transition-colors">
                  Giriş Yap
                </button>
                <button onClick={() => navigate('/register')} className="bg-[#9333ff] text-white px-8 py-3.5 rounded-full text-sm md:text-[15px] font-medium hover:bg-[#7b22df] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Hesap Oluştur
                </button>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

    </div>
  );
};

/* --- Internal Components for Landing Page --- */

const Logos = () => {
  // Kullanıcının public klasörüne yüklediği tam dosya isimleri
  const baseLogos = [
    "amazon-com-logo-svgrepo-com.svg",
    "Çiçek Sepeti.svg",
    "Hepsiburada_logo_official.svg",
    "Trendyol_logo.svg"
  ];
  
  // Logoları daha uzun bir şerit yapmak için diziyi kopyalıyoruz (Büyük ekranlarda boşluk kalmaması için)
  const displayLogos = [...baseLogos, ...baseLogos, ...baseLogos];

  const getLogoClass = (logoName: string) => {
    const baseClasses = "w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 max-w-[200px] md:max-w-[280px]";
    const name = logoName.toLowerCase();
    
    if (name.includes("amazon")) {
      return `${baseClasses} h-8 md:h-12 lg:h-16`;
    }
    if (name.includes("çiçek") || name.includes("cicek")) {
      return `${baseClasses} h-8 md:h-10 lg:h-12`;
    }
    if (name.includes("hepsiburada")) {
      return `${baseClasses} h-4 md:h-5 lg:h-6`; // Hepsiburada'yı çok daha küçük yapıyoruz ki diğerleriyle dengelensin
    }
    return `${baseClasses} h-5 md:h-7 lg:h-8`; // Trendyol
  };

  return (
    <div className="w-full overflow-hidden flex relative mt-4">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
      
      {/* Fade edges for smooth entrance/exit */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

      <div className="animate-marquee items-center py-4">
         {/* First Block */}
         <div className="flex items-center justify-around gap-12 md:gap-24 px-6 md:px-12">
           {displayLogos.map((logo, i) => (
             <img 
               key={i} 
               src={`/${logo}`} 
               alt={logo.split('.')[0]} 
               className={getLogoClass(logo)}
             />
           ))}
         </div>
         {/* Second Block for perfect seamless loop */}
         <div className="flex items-center justify-around gap-12 md:gap-24 px-6 md:px-12">
           {displayLogos.map((logo, i) => (
             <img 
               key={`dup-${i}`} 
               src={`/${logo}`} 
               alt={logo.split('.')[0]} 
               className={getLogoClass(logo)}
             />
           ))}
         </div>
      </div>
    </div>
  );
};

const AutomatedProcess = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 2000); // 2 seconds per step
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "Ürün Analizi", icon: <UploadCloud className="w-5 h-5 text-purple-400" /> },
    { title: "SEO ve İçerik", icon: <Sparkles className="w-5 h-5 text-blue-400" /> },
    { title: "Fiyatlandırma", icon: <Tag className="w-5 h-5 text-emerald-400" /> },
    { title: "Platform Seçimi", icon: <ShoppingBag className="w-5 h-5 text-orange-400" /> },
    { title: "Sipariş Yayında", icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> }
  ];

  return (
    <div className="w-full bg-[#0a0a0a] rounded-3xl border border-[#2a2a2a] p-6 md:p-10 shadow-2xl overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-8 h-auto md:h-[320px]">
        
        {/* Left: Stepper */}
        <div className="flex flex-col justify-center gap-6 w-full md:w-1/2">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${step === i ? 'opacity-100 translate-x-2' : (step > i ? 'opacity-50' : 'opacity-20')}`}>
               <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center border transition-colors ${step === i ? 'border-gray-500 bg-gray-800' : 'border-gray-800 bg-transparent'}`}>
                 {step > i ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : s.icon}
               </div>
               <span className={`text-lg font-medium transition-colors ${step === i ? 'text-white' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* Right: Dynamic Content Mockup */}
        <div className="w-full md:w-1/2 h-[220px] md:h-full bg-[#121212] rounded-2xl border border-[#2a2a2a] flex items-center justify-center p-8 relative overflow-hidden">
           {/* Animated border for active states */}
           {step !== 4 && <BorderBeam size={200} duration={8} delay={0} colorFrom="#3b82f6" colorTo="#10b981" borderWidth={1.5} />}
           
           <AnimatePresence mode="wait">
             {step === 0 && (
               <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 w-full">
                 <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center animate-pulse">
                    <UploadCloud className="w-8 h-8 text-gray-500" />
                 </div>
                 <p className="text-gray-400 text-sm font-medium">Görseller analiz ediliyor...</p>
                 <div className="w-full max-w-[200px] h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: "linear" }} className="h-full bg-purple-500 rounded-full"></motion.div>
                 </div>
               </motion.div>
             )}
             
             {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 w-full max-w-[280px]">
                 <div className="h-6 w-3/4 bg-blue-500/20 rounded-md border border-blue-500/30"></div>
                 <div className="h-3 w-full bg-gray-800 rounded mt-2"></div>
                 <div className="h-3 w-5/6 bg-gray-800 rounded"></div>
                 <div className="h-3 w-4/6 bg-gray-800 rounded"></div>
                 <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-400">SEO Score: 98/100</span>
                 </div>
               </motion.div>
             )}
             
             {step === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                 <span className="text-gray-400 text-sm">Önerilen Satış Fiyatı</span>
                 <span className="text-5xl font-bold text-emerald-400">₺1.499</span>
                 <span className="text-emerald-500/50 text-xs mt-1">Rakip analizi tamamlandı</span>
               </motion.div>
             )}
             
             {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 w-full">
                 <p className="text-gray-400 text-sm">API Bağlantıları Kuruluyor</p>
                 <div className="flex flex-wrap gap-3 justify-center w-full">
                   <span className="px-4 py-2 bg-orange-500/10 text-orange-500 font-medium rounded-lg border border-orange-500/20">Trendyol</span>
                   <span className="px-4 py-2 bg-purple-500/10 text-purple-400 font-medium rounded-lg border border-purple-500/20">Hepsiburada</span>
                   <span className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg border border-white/20">Amazon</span>
                 </div>
               </motion.div>
             )}
             
             {step === 4 && (
               <motion.div key="step4" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="flex flex-col items-center gap-4">
                 <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 relative">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                    <motion.div initial={{ scale: 1, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 rounded-full border border-green-500/50"></motion.div>
                 </div>
                 <span className="text-2xl font-bold text-white tracking-tight">Sipariş Yayında!</span>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ChatInterfaceMockup = () => {
  const fullText = "E-Ticaret verilerimi analiz et...";
  const [typedText, setTypedText] = useState("");
  const [phase, setPhase] = useState<'IDLE'|'TYPING'|'AI_REPLY'>('TYPING');

  useEffect(() => {
    if (phase === 'TYPING') {
      let i = 0;
      const timer = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(timer);
          setTimeout(() => setPhase('AI_REPLY'), 600);
        }
      }, 70);
      return () => clearInterval(timer);
    } else if (phase === 'AI_REPLY') {
      const timer = setTimeout(() => {
        setPhase('IDLE');
      }, 4000);
      return () => clearTimeout(timer);
    } else if (phase === 'IDLE') {
      const timer = setTimeout(() => {
        setTypedText("");
        setPhase('TYPING');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, fullText]);

  return (
    <div className="relative w-full h-[280px] md:h-[300px] lg:h-[320px] rounded-[2rem] shadow-2xl group">
      
      {/* Main chat box */}
      <div className="absolute inset-0 bg-[#0a0a0a] rounded-[2rem] border border-[#2a2a2a] p-4 flex flex-col overflow-hidden">
        {/* Background gradient hint */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.07),transparent_50%)]"></div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden flex flex-col gap-4 p-2 pb-4 z-10">
        <div className="bg-[#1a1a1a] self-start rounded-2xl rounded-tl-sm px-4 py-3 text-gray-300 text-sm max-w-[85%] border border-[#2a2a2a] shadow-sm">
          Merhaba! Ben Pazara AI asistanınız Haydar. Size nasıl yardımcı olabilirim?
        </div>
        
        <AnimatePresence>
          {phase === 'AI_REPLY' || phase === 'IDLE' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#2e1065]/50 self-end rounded-2xl rounded-tr-sm px-4 py-3 text-purple-100 text-sm max-w-[85%] border border-purple-500/30 shadow-sm">
              {fullText}
            </motion.div>
          ) : null}
        </AnimatePresence>
        
        <AnimatePresence>
          {(phase === 'AI_REPLY' || phase === 'IDLE') ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#1a1a1a] self-start rounded-2xl rounded-tl-sm px-4 py-3 text-gray-300 text-sm max-w-[85%] border border-[#2a2a2a] flex flex-col gap-2 shadow-sm">
              <span className="flex items-center gap-2 text-purple-400 font-medium text-xs"><Sparkles size={14}/> Ajanlar devrede...</span>
              Verileriniz başarıyla analiz edildi. Mağazanızda geçen haftaya göre %15 organik büyüme tespit ettim.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      
      {/* Input Box Component */}
      <div className="mt-auto bg-[#121212] border border-[#2a2a2a] rounded-full p-2 pl-4 flex items-center justify-between z-10 shadow-lg">
         <div className="flex items-center gap-3 w-full overflow-hidden">
           <div className="flex items-center gap-1.5 border border-purple-500/30 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap">
             <ShoppingBag size={12} />
             E-Ticaret
           </div>
           <div className="w-px h-4 bg-[#2a2a2a] mx-1"></div>
           <p className={`text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis flex-1 ${typedText ? 'text-gray-200' : 'text-gray-600'}`}>
             {typedText || "Mesajınızı yazın..."}
             {phase === 'TYPING' && <span className="inline-block w-[2px] h-3.5 bg-purple-500 animate-pulse ml-0.5 align-middle"></span>}
           </p>
         </div>
         <div className="w-10 h-10 ml-2 bg-white rounded-full flex items-center justify-center text-black flex-shrink-0 shadow-sm">
            <Mic size={18} />
         </div>
      </div>
      
      </div> {/* <-- Missing closing tag added here */}

      {/* BorderBeam overlay (flowing exactly on the outside) */}
      <div className="absolute -inset-[3px] rounded-[calc(2rem+3px)] pointer-events-none z-20">
         <BorderBeam size={350} duration={8} colorFrom="#a855f7" colorTo="#3b82f6" borderWidth={3} />
      </div>
    </div>
  );
};

const TechLogos = () => {
  const techs = [
    { name: 'Python', file: 'Python_logo.svg' },
    { name: 'React', file: 'React_Logo.svg' },
    { name: 'Cloudinary', file: 'Cloudinary_logo.svg' }
  ];
  // Döngünün kesintisiz devam etmesi için diziyi çoğaltıyoruz
  const display = [...techs, ...techs, ...techs, ...techs, ...techs]; 

  return (
    <div className="w-full overflow-hidden flex relative mt-2 h-36">
      <style>{`
        @keyframes tech-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-tech {
          animation: tech-marquee 50s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
      
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="animate-tech items-center py-4">
         {/* Block 1 */}
         <div className="flex items-center justify-around gap-8 md:gap-16 px-4 md:px-8">
           {display.map((t, i) => (
             <div key={i} className="flex flex-col items-center justify-center flex-shrink-0 group">
               <img src={`/${t.file}`} alt={t.name} className="h-10 md:h-14 lg:h-16 w-auto max-w-[200px] object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
             </div>
           ))}
         </div>
         {/* Block 2 for seamless loop */}
         <div className="flex items-center justify-around gap-8 md:gap-16 px-4 md:px-8">
           {display.map((t, i) => (
             <div key={`dup-${i}`} className="flex flex-col items-center justify-center flex-shrink-0 group">
               <img src={`/${t.file}`} alt={t.name} className="h-10 md:h-14 lg:h-16 w-auto max-w-[200px] object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};
