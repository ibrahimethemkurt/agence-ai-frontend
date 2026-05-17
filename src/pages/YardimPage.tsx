import React, { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { Reveal } from '../components/animation/Reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MessageSquareText, BookOpen, Mail, 
  ChevronDown, ExternalLink, HelpCircle
} from 'lucide-react';

const FAQS = [
  {
    question: "AjansAI platformu tam olarak ne işe yarar?",
    answer: "AjansAI, e-ticaret mağazanızı yapay zeka ajanlarıyla otopilotta yönetmenizi sağlayan bir sistemdir. Satış öncesi müşteri sorularını yanıtlar, satış sürecinde sepet terklerini önler ve satış sonrasında kargo/iade takibini otomatik yapar."
  },
  {
    question: "Hangi pazaryerleri ile entegrasyon sağlayabilirim?",
    answer: "Şu anda Trendyol, Hepsiburada, Amazon ve kendi e-ticaret altyapılarınız (Shopify, WooCommerce) ile tam entegre çalışacak şekilde tasarlanmıştır. Ayarlar > Platform Bağlantıları sayfasından API anahtarlarınızı girerek bağlayabilirsiniz."
  },
  {
    question: "Satış Öncesi ve Satış Sonrası ajanları nasıl çalışır?",
    answer: "Satış Öncesi Ajanı, ürünlerinize gelen soruları saniyeler içinde SEO dostu ve ikna edici şekilde yanıtlar. Satış Sonrası Ajanı ise sipariş durum güncellemelerini takip eder, müşteri yorumlarına otomatik teşekkür veya telafi mesajları iletir."
  },
  {
    question: "Ajanların verdiği yanıtlara müdahale edebilir miyim?",
    answer: "Kesinlikle. Ajanların planladığı tüm yanıtları Dashboard üzerinden görebilir, dilerseniz 'Otonom Mod' yerine 'Onaylı Mod' kullanarak yanıtlar gönderilmeden önce onaylayabilir veya düzenleyebilirsiniz."
  },
  {
    question: "Finans ve Analiz verilerim nereden çekiliyor?",
    answer: "Verileriniz entegre ettiğiniz pazaryerlerinden anlık olarak çekilir. Gelişmiş AI destekli tahminleme algoritmalarımız sayesinde önümüzdeki ayların satış projeksiyonunu ve kar marjlarınızı Analizler sayfasında görebilirsiniz."
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: any) => {
  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[var(--color-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-accent)]' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-[var(--color-muted)] leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const YardimPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PageTransition className="w-full max-w-[1000px] mx-auto py-8 px-4 md:px-8">
      
      {/* Header Area */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-fg)] mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-[var(--color-accent)]" />
          Yardım Merkezi
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-8">
          Nasıl yardımcı olabiliriz? Öğrenmek istediğiniz konuyu arayın veya sıkça sorulan sorulara göz atın.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
          <input 
            type="text" 
            placeholder="Arama yapın (Örn: Trendyol entegrasyonu nasıl yapılır?)" 
            className="w-full bg-[#121212] border border-[var(--color-border)] rounded-2xl pl-12 pr-4 py-4 text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-accent)] focus:bg-[#1a1a1a] transition-all shadow-lg"
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Reveal variant="fadeUp" delay={0.1}>
          <div className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-accent)]/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-fg)] mb-2">Canlı Destek</h3>
            <p className="text-sm text-[var(--color-muted)]">AI asistanımıza anında bağlanın ve sorularınızı sorun.</p>
          </div>
        </Reveal>
        
        <Reveal variant="fadeUp" delay={0.2}>
          <div className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[#10B981]/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-4 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-fg)] mb-2 flex items-center gap-2">
              Dokümantasyon <ExternalLink className="w-3 h-3" />
            </h3>
            <p className="text-sm text-[var(--color-muted)]">Sistemin nasıl kullanılacağına dair detaylı rehberler.</p>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.3}>
          <div className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center mb-4 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-fg)] mb-2">Bize Ulaşın</h3>
            <p className="text-sm text-[var(--color-muted)]">Teknik destek veya kurumsal talepleriniz için e-posta gönderin.</p>
          </div>
        </Reveal>
      </div>

      {/* FAQ Section */}
      <Reveal variant="fadeUp" delay={0.4}>
        <div className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl font-display font-semibold text-[var(--color-fg)] mb-6">Sıkça Sorulan Sorular</h2>
          <div className="flex flex-col">
            {FAQS.map((faq, index) => (
              <AccordionItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </Reveal>

    </PageTransition>
  );
};
