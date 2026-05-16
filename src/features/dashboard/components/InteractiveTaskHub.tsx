import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle, MessageSquare, PieChart, CheckCircle2, ChevronRight, X, Check, ArrowRight, PackagePlus, TrendingUp, XCircle } from 'lucide-react';
import { ShineBorder } from '../../../components/shine-border';
import { AnimatedButton } from '../../../components/ui/AnimatedButton';
import { useNavigate } from 'react-router-dom';

// Import new radio components
import { RadioGroup as SegmentControl } from '../../../components/radio-group';
import { RadioGroup as ShugarRadioGroup } from '../../../components/radio';

type TaskId = 'siparis' | 'stok' | 'yorum' | 'analiz';

interface TaskDef {
  id: TaskId;
  title: string;
  count: number;
  icon: React.ElementType;
  gradient: string;
}

const TASK_DEFINITIONS: TaskDef[] = [
  { id: 'siparis', title: 'Sipariş Geldi', count: 3, icon: Package, gradient: 'from-[#2E5F8A] via-teal-400 to-[#1E3A5F]' },
  { id: 'stok', title: 'Stok Uyarısı', count: 2, icon: AlertTriangle, gradient: 'from-[#7A5C00] via-yellow-400 to-[#7A1A1A]' },
  { id: 'yorum', title: 'Yorum Geldi', count: 5, icon: MessageSquare, gradient: 'from-[#1A6B3C] via-emerald-400 to-[#0F1A2E]' },
  { id: 'analiz', title: 'Analiz Tamamlandı', count: 1, icon: PieChart, gradient: 'from-blue-500 via-purple-500 to-indigo-500' }
];

export const InteractiveTaskHub = () => {
  const [pendingTasks, setPendingTasks] = useState<TaskId[]>(['siparis', 'stok', 'yorum', 'analiz']);
  const [activeTask, setActiveTask] = useState<TaskId | null>(null);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [successMessage, setSuccessMessage] = useState("İşlem Başarılı!");

  const navigate = useNavigate();

  const getNextTask = (currentId: TaskId) => {
    const currentIndex = TASK_DEFINITIONS.findIndex(t => t.id === currentId);
    for (let i = currentIndex + 1; i < TASK_DEFINITIONS.length; i++) {
      if (pendingTasks.includes(TASK_DEFINITIONS[i].id)) {
        return TASK_DEFINITIONS[i].id;
      }
    }
    for (let i = 0; i < currentIndex; i++) {
      if (pendingTasks.includes(TASK_DEFINITIONS[i].id)) {
        return TASK_DEFINITIONS[i].id;
      }
    }
    return null;
  };

  const handleAction = (id: TaskId, isComplete: boolean, customMessage?: string) => {
    if (isComplete) {
      if (customMessage) setSuccessMessage(customMessage);
      else setSuccessMessage("İşlem Başarılı!");

      setIsSuccessAnim(true);
      setTimeout(() => {
        setIsSuccessAnim(false);
        const newPending = pendingTasks.filter(t => t !== id);
        setPendingTasks(newPending);
        
        if (newPending.length > 0) {
          let foundNext = null;
          const currentIndex = TASK_DEFINITIONS.findIndex(t => t.id === id);
          for (let i = currentIndex + 1; i < TASK_DEFINITIONS.length; i++) {
            if (newPending.includes(TASK_DEFINITIONS[i].id)) {
              foundNext = TASK_DEFINITIONS[i].id;
              break;
            }
          }
          if (!foundNext) {
            for (let i = 0; i < currentIndex; i++) {
              if (newPending.includes(TASK_DEFINITIONS[i].id)) {
                foundNext = TASK_DEFINITIONS[i].id;
                break;
              }
            }
          }
          setActiveTask(foundNext);
        } else {
          setActiveTask(null);
        }
      }, 1500);
    } else {
      const nextId = getNextTask(id);
      setActiveTask(nextId);
    }
  };

  if (pendingTasks.length === 0 && activeTask === null) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/20 flex items-center justify-center text-[var(--color-success)] mb-2">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-display font-bold text-white">Harika Gidiyorsunuz!</h2>
        <p className="text-[var(--color-muted)] max-w-md">Şu an için beklemede olan hiçbir göreviniz yok. Ajanlarınız arka planda çalışmaya devam ediyor.</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {TASK_DEFINITIONS.map((task) => {
          const isPending = pendingTasks.includes(task.id);
          const Icon = task.icon;

          if (!isPending) {
            return (
              <div key={task.id} className="relative rounded-2xl p-6 border border-white/5 bg-[#0A0A0A] opacity-50 flex flex-col items-center justify-center gap-3 h-36">
                <CheckCircle2 className="text-[var(--color-success)]" size={32} />
                <span className="font-medium text-[var(--color-fg)]">{task.title} (Tamamlandı)</span>
              </div>
            );
          }

          return (
            <motion.div
              key={task.id}
              layoutId={`hub-${task.id}`}
              onClick={() => setActiveTask(task.id)}
              className="cursor-pointer h-36"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShineBorder borderWidth={1.5} duration={3} gradient={task.gradient} className="h-full">
                <div className="flex flex-col p-6 h-full justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className="text-white" size={20} />
                    </div>
                    <span className="text-2xl font-display font-bold text-white">{task.count}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-white/90">{task.title}</h3>
                  </div>
                </div>
              </ShineBorder>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setActiveTask(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`hub-${activeTask}`}
                className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
              >
                <ActiveTaskContent 
                  task={TASK_DEFINITIONS.find(t => t.id === activeTask)!} 
                  onClose={() => setActiveTask(null)}
                  onAction={handleAction}
                  isSuccessAnim={isSuccessAnim}
                  successMessage={successMessage}
                  navigate={navigate}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface ActiveTaskContentProps {
  task: TaskDef;
  onClose: () => void;
  onAction: (id: TaskId, isComplete: boolean, customMessage?: string) => void;
  isSuccessAnim: boolean;
  successMessage: string;
  navigate: (path: string) => void;
}

const ActiveTaskContent = ({ task, onClose, onAction, isSuccessAnim, successMessage, navigate }: ActiveTaskContentProps) => {
  // Sipariş State
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const orders = [
    { id: '10492', name: 'Faber-Castell 0.5mm Versatil', price: '145.00' },
    { id: '10493', name: 'Rotring Tikky 0.7mm', price: '95.00' },
    { id: '10494', name: 'Fatih Kalem Seti', price: '45.00' },
  ];

  const toggleOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(o => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]); // Deselect all
    } else {
      setSelectedOrders(orders.map(o => o.id)); // Select all
    }
  };

  // Stok State
  const stokOptions = [
    { value: 'increase_stock', label: 'Stok Artır', icon: PackagePlus },
    { value: 'increase_price', label: 'Fiyat Artır', icon: TrendingUp },
    { value: 'ignore', label: 'İşlem Yapma', icon: XCircle }
  ];
  const [stokAction, setStokAction] = useState('increase_stock');
  const [stockAmount, setStockAmount] = useState('50');
  const [priceStrategy, setPriceStrategy] = useState('10'); // for shugar radio

  if (isSuccessAnim) {
    return (
      <div className="flex flex-col items-center justify-center p-16 h-80 gap-6 bg-[#0A0A0A]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 rounded-full bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 flex items-center justify-center text-[var(--color-success)]"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-display font-bold text-white text-center"
        >
          {successMessage}
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[85vh]">
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <task.icon className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">{task.title}</h2>
            <p className="text-sm text-[var(--color-muted)]">{task.count} İşlem Bekliyor</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-[var(--color-muted)] hover:text-white rounded-full hover:bg-white/5 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 bg-[#0a0a0a] overflow-y-auto">
        {task.id === 'siparis' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-[var(--color-muted)]">Lütfen kargoya verilecek siparişleri seçin:</p>
              <button 
                onClick={toggleAllOrders}
                className="text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                {selectedOrders.length === orders.length ? 'Tüm Seçimi Kaldır' : 'Tümünü Seç'}
              </button>
            </div>
            
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} onClick={() => toggleOrder(o.id)} className={`cursor-pointer transition-colors p-4 rounded-xl border flex items-center gap-4 ${selectedOrders.includes(o.id) ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40' : 'bg-[#111111] border-white/5 hover:border-white/10 hover:bg-[#151515]'}`}>
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selectedOrders.includes(o.id) ? 'bg-[var(--color-accent)] border-[var(--color-accent)]' : 'border-white/20'}`}>
                    {selectedOrders.includes(o.id) && <Check size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--color-muted)] text-sm mb-1">Sipariş #{o.id}</p>
                    <h4 className="font-medium text-white">{o.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-success)] font-bold">{o.price} TL</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {task.id === 'stok' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 p-5 rounded-xl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-[var(--color-warning)] shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-[var(--color-warning)] mb-2 text-lg">Stok Ajanı Önerisi</h4>
                  <p className="text-white/80 leading-relaxed">"Rotring Tikky 0.7mm" için son 3 adet kaldı. Geçmiş satış hızına göre yarına kadar tükenmesi bekleniyor. Ajanınız tedarikçiden <span className="font-bold text-white">50 adet</span> sipariş geçilmesini öneriyor.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-white/80 mb-1">Nasıl ilerlemek istersiniz?</p>
              <SegmentControl 
                options={stokOptions} 
                value={stokAction} 
                onChange={setStokAction} 
                bgDefault="#151515"
                fgDefault="#a1a1aa"
                bgActive="var(--color-accent)"
                fgActive="#fff"
                bgHover="#222"
                fgHover="#fff"
                borderRadius="12px"
              />
            </div>

            <AnimatePresence mode="wait">
              {stokAction === 'increase_stock' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#111111] border border-white/5 p-5 rounded-xl mt-4">
                  <label className="block text-sm font-medium text-white/80 mb-3">Kaç adet stok artırılsın?</label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      value={stockAmount}
                      onChange={(e) => setStockAmount(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </motion.div>
              )}

              {stokAction === 'increase_price' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#111111] border border-white/5 p-5 rounded-xl mt-4">
                  <label className="block text-sm font-medium text-white/80 mb-4">Fiyat artış stratejisi seçin:</label>
                  <div className="space-y-3">
                    <ShugarRadioGroup value={priceStrategy} onChange={setPriceStrategy}>
                      <ShugarRadioGroup.Item value="10">
                        <span className="text-white ml-2 text-sm">%10 Artır (Tavsiye Edilen)</span>
                      </ShugarRadioGroup.Item>
                      <div className="my-3 border-t border-white/5"></div>
                      <ShugarRadioGroup.Item value="20">
                        <span className="text-white ml-2 text-sm">%20 Artır (Yüksek Marj)</span>
                      </ShugarRadioGroup.Item>
                    </ShugarRadioGroup>
                  </div>
                </motion.div>
              )}

              {stokAction === 'ignore' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-white/60 text-sm mt-4 text-center">
                  Herhangi bir işlem yapılmayacak, uyarı sonraya ertelenecek.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {task.id === 'yorum' && (
          <div className="space-y-4">
            <div className="bg-[#111111] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-yellow-400 text-lg">★★★★★</span>
                <span className="text-xs text-[var(--color-muted)]">Bugün, 14:30</span>
              </div>
              <p className="text-white/90 text-lg">"Kargolama hızı mükemmeldi, ürün tam beklediğim gibi."</p>
            </div>
            <div className="bg-[#111111] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-yellow-400 text-lg">★★★★☆</span>
                <span className="text-xs text-[var(--color-muted)]">Dün, 09:15</span>
              </div>
              <p className="text-white/90 text-lg">"Ürün güzel fakat paketleme biraz daha özenli olabilirdi."</p>
            </div>
          </div>
        )}

        {task.id === 'analiz' && (
          <div className="space-y-4">
            <div className="bg-[#111111] p-5 rounded-xl border border-[var(--color-accent)]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)]"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg text-[var(--color-accent)]">
                  <PieChart size={24} />
                </div>
                <h4 className="font-bold text-white text-lg">Yeni Pazar Analizi Hazır</h4>
              </div>
              <p className="text-white/80 leading-relaxed mb-6">"Lamy Safari Dolma Kalem" ürününün rakip fiyatları %15 arttı. Fiyatınızı 450 TL'den 495 TL'ye çıkarmanız kâr marjınızı artıracaktır.</p>
              
              <button 
                onClick={() => navigate('/analizler')}
                className="w-full py-3 bg-[#1A1A1A] hover:bg-[#222] text-[var(--color-accent)] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/5"
              >
                Tüm Raporu İncele <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/5 bg-[#050505] flex items-center justify-between">
        <button 
          onClick={() => onAction(task.id, false)}
          className="text-white/40 hover:text-white font-medium text-sm transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5"
        >
          Bunu Geç <ChevronRight size={16} />
        </button>
        
        <div className="flex gap-3">
          {task.id === 'siparis' && (
            <AnimatedButton 
              variant="primary" 
              onClick={() => onAction(task.id, true, `${selectedOrders.length} sipariş kargoya verildi!`)}
              disabled={selectedOrders.length === 0}
            >
              Seçilenleri Kargoya Ver ({selectedOrders.length})
            </AnimatedButton>
          )}
          {task.id === 'stok' && (
            <AnimatedButton 
              variant={stokAction === 'ignore' ? 'outline' : 'primary'} 
              onClick={() => {
                if (stokAction === 'increase_stock') onAction(task.id, true, `${stockAmount} adet stok artışı yapıldı!`);
                else if (stokAction === 'increase_price') onAction(task.id, true, `%${priceStrategy} fiyat artışı uygulandı!`);
                else onAction(task.id, false); // ignore passes to next without success anim
              }}
            >
              {stokAction === 'ignore' ? 'Uyarıyı Kapat' : 'Onayla ve Uygula'}
            </AnimatedButton>
          )}
          {task.id === 'yorum' && (
            <AnimatedButton variant="primary" onClick={() => onAction(task.id, true, "Tüm yorumlar okundu olarak işaretlendi.")}>Tümü Okundu</AnimatedButton>
          )}
          {task.id === 'analiz' && (
            <AnimatedButton variant="primary" onClick={() => onAction(task.id, true, "Analiz okundu olarak işaretlendi.")}>Okundu Olarak İşaretle</AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
};
