import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, MinusCircle, History, ChevronLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { api } from '../../../lib/api';
import { PlatformLogo } from '../../../components/PlatformLogo';

// --- TYPE DEFINITIONS ---
type QuickAction = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

type Activity = {
  id: string;
  icon: React.ReactNode;
  title: string;
  time: string;
  amount: number;
};

// --- HELPER COMPONENTS ---
const IconWrapper = ({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) => (
  <div
    className={cn(
      'p-2 rounded-full flex items-center justify-center',
      className
    )}
  >
    <Icon className="w-5 h-5" />
  </div>
);

const LogoIcon = ({
  letter,
  className,
}: {
  letter: string;
  className?: string;
}) => (
  <div
    className={cn(`w-9 h-9 flex items-center justify-center rounded-full font-bold text-white text-sm`, className)}
  >
    {letter}
  </div>
);

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'income', icon: ArrowUpRight, title: 'Gelir Ekle', description: 'Yeni Giriş' },
  { id: 'expense', icon: ArrowDownRight, title: 'Gider Ekle', description: 'Ödeme/Fatura' },
];

export const FinancialDashboard = ({ activities = [] }: { activities?: any[] }) => {
  const [view, setView] = useState<'dashboard' | 'income' | 'expense'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form States
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Diğer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (type: 'income' | 'expense') => {
    if (!txTitle || !txAmount) return;
    try {
      setIsSubmitting(true);
      await api.addTransaction({
        title: txTitle,
        amount: parseFloat(txAmount),
        category: txCategory,
        type: type
      });
      setView('dashboard');
      setTxTitle('');
      setTxAmount('');
      setTxCategory('Diğer');
      window.location.reload(); // Refresh the page to load new data
    } catch (err) {
      console.error(err);
      alert('İşlem kaydedilemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredActivities = activities.filter(activity => 
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.amount.toString().includes(searchTerm)
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const renderDashboard = () => (
    <motion.div
      key="dashboard"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="flex flex-col h-full"
    >
      {/* Search Bar */}
      <motion.div variants={itemVariants} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İşlem, ödeme veya metin arayın..."
          className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#737373] focus:ring-1 focus:ring-white/20 focus:border-white/20 outline-none transition-all"
        />
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        {QUICK_ACTIONS.map((action) => (
          <motion.div
            key={action.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a' }}
            onClick={() => {
              if (action.id === 'income') setView('income');
              if (action.id === 'expense') setView('expense');
            }}
            className="group flex flex-col items-center text-center p-3 rounded-xl border border-transparent hover:border-[#2a2a2a] cursor-pointer transition-all bg-[#121212]"
          >
            <IconWrapper
              icon={action.icon}
              className={cn(
                "mb-3 transition-colors",
                action.id === 'income' ? "bg-green-500/10 text-green-500" : 
                action.id === 'expense' ? "bg-red-500/10 text-red-500" : 
                "bg-[#1a1a1a] text-[#a3a3a3]"
              )}
            />
            <p className="text-base font-bold text-white mb-1">{action.title}</p>
            <p className="text-xs text-[#737373]">
              {action.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-[#737373]" />
          <h2 className="text-sm font-medium text-[#a3a3a3]">Geçmiş Aktiviteler</h2>
        </div>
        
        {filteredActivities.length > 0 ? (
          <motion.ul
            variants={containerVariants}
            className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar"
          >
            {filteredActivities.map((activity) => (
              <motion.li
                key={activity.id}
                variants={itemVariants}
                className="flex items-center justify-between p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <PlatformLogo
                    title={activity.title}
                    rawType={activity.rawType}
                    amount={activity.amount}
                    size={36}
                  />
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-sm text-white truncate">{activity.title}</p>
                    <p className="text-xs text-[#737373]">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'text-sm font-mono px-2 py-1 rounded-md font-medium',
                    activity.amount > 0
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-red-400 bg-red-500/10'
                  )}
                >
                  {activity.amount > 0 ? '+' : ''}₺
                  {Math.abs(activity.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-[#737373]">
            Sonuç bulunamadı.
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderForm = (type: 'income' | 'expense') => (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setView('dashboard')}
          className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#a3a3a3] hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {type === 'income' ? (
            <PlusCircle className="w-5 h-5 text-green-500" />
          ) : (
            <MinusCircle className="w-5 h-5 text-red-500" />
          )}
          <h2 className="text-lg font-bold text-white">
            {type === 'income' ? 'Gelir Ekle' : 'Gider Ekle'}
          </h2>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-[#737373] mb-1.5">İşlem Adı</label>
          <input 
            type="text" 
            value={txTitle}
            onChange={(e) => setTxTitle(e.target.value)}
            placeholder="Örn: Trendyol Hakedişi"
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#737373] mb-1.5">Tutar (₺)</label>
          <input 
            type="number" 
            value={txAmount}
            onChange={(e) => setTxAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#737373] mb-1.5">Kategori</label>
          <select 
            value={txCategory}
            onChange={(e) => setTxCategory(e.target.value)}
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-[#a3a3a3] focus:border-white/20 outline-none appearance-none"
          >
            {type === 'income' ? (
              <>
                <option value="sale">Pazaryeri Satışı</option>
                <option value="other">Diğer Gelir</option>
              </>
            ) : (
              <>
                <option value="commission">Platform Komisyonu</option>
                <option value="shipping">Kargo Gideri</option>
                <option value="ads">Reklam Gideri</option>
                <option value="cogs">Ürün Maliyeti</option>
                <option value="other">Diğer Gider</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button 
          disabled={isSubmitting || !txTitle || !txAmount}
          onClick={() => handleSubmit(type)}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-black transition-colors disabled:opacity-50",
            type === 'income' ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"
          )}
        >
          {isSubmitting ? 'Kaydediliyor...' : type === 'income' ? 'Geliri Kaydet' : 'Gideri Kaydet'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-[#0a0a0a] rounded-3xl border border-[#2a2a2a] p-6 h-[600px] flex flex-col font-sans overflow-hidden relative">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && renderDashboard()}
        {view === 'income' && renderForm('income')}
        {view === 'expense' && renderForm('expense')}
      </AnimatePresence>
    </div>
  );
};
