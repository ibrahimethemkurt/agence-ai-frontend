import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  History,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

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

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    icon: <LogoIcon letter="A" className="bg-[#A07CFE]" />,
    title: 'Amazon Ödemesi',
    time: '2 saat önce',
    amount: 15450.0,
  },
  {
    id: '2',
    icon: <LogoIcon letter="T" className="bg-[#FE8FB5]" />,
    title: 'Trendyol Komisyon Kesintisi',
    time: '5 saat önce',
    amount: -1250.0,
  },
  {
    id: '3',
    icon: <LogoIcon letter="K" className="bg-green-500" />,
    title: 'Kargo Giderleri',
    time: '1 gün önce',
    amount: -340.5,
  },
  {
    id: '4',
    icon: <LogoIcon letter="H" className="bg-[#FFBE7B]" />,
    title: 'Hepsiburada Satış Geliri',
    time: '2 gün önce',
    amount: 8900.0,
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'income', icon: ArrowUpRight, title: 'Gelir Ekle', description: 'Yeni Giriş' },
  { id: 'expense', icon: ArrowDownRight, title: 'Gider Ekle', description: 'Ödeme/Fatura' },
];

export const FinancialDashboard = () => {
  const [view, setView] = useState<'dashboard' | 'income' | 'expense'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = MOCK_ACTIVITIES.filter(activity => 
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
      <motion.div variants={itemVariants} className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-[#737373]" />
          <h2 className="text-sm font-medium text-[#a3a3a3]">Geçmiş Aktiviteler</h2>
        </div>
        
        {filteredActivities.length > 0 ? (
          <motion.ul
            variants={containerVariants}
            className="space-y-1"
          >
            {filteredActivities.map((activity) => (
              <motion.li
                key={activity.id}
                variants={itemVariants}
                className="flex items-center justify-between p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  {activity.icon}
                  <div>
                    <p className="font-medium text-sm text-white">{activity.title}</p>
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
                  {Math.abs(activity.amount).toLocaleString('tr-TR')}
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
            placeholder="Örn: Trendyol Hakedişi"
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#737373] mb-1.5">Tutar (₺)</label>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-white/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#737373] mb-1.5">Kategori</label>
          <select className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-[#a3a3a3] focus:border-white/20 outline-none appearance-none">
            <option>Pazaryeri Satışı</option>
            <option>Kargo Gideri</option>
            <option>Reklam Gideri</option>
            <option>Diğer</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button 
          onClick={() => setView('dashboard')}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-black transition-colors",
            type === 'income' ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"
          )}
        >
          {type === 'income' ? 'Geliri Kaydet' : 'Gideri Kaydet'}
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
