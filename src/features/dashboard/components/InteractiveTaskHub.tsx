import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, AlertTriangle, MessageSquare, PieChart,
  CheckCircle2, ChevronRight, X, Check, ArrowRight,
  PackagePlus, TrendingUp, XCircle, RefreshCw, Star
} from 'lucide-react';
import { AnimatedButton } from '../../../components/ui/AnimatedButton';
import { useNavigate } from 'react-router-dom';
import { RadioGroup as SegmentControl } from '../../../components/radio-group';
import { RadioGroup as ShugarRadioGroup } from '../../../components/radio';
import { GlowCard } from '../../../components/ui/glow-card';
import {
  useSatisSonrasiStore,
  type TaskId,
  type ApiOrder,
  type ApiReview,
  approveOrders,
  resolveStockAlert,
  markReviewsRead,
  markAnalysisRead,
} from '../../satis-sonrasi/store/satisSonrasiStore';

export type { TaskId };

export interface TaskDef {
  id: TaskId;
  title: string;
  count: number;
  icon: React.ElementType;
  glowColor: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

// TASK_DEFINITIONS artık store'dan count alıyor — başlangıç değeri 0
export const TASK_DEFINITIONS: TaskDef[] = [
  { id: 'siparis', title: 'Sipariş Geldi',      count: 3, icon: Package,      glowColor: 'blue' },
  { id: 'stok',    title: 'Stok Uyarısı',       count: 2, icon: AlertTriangle, glowColor: 'orange' },
  { id: 'yorum',   title: 'Yorum Geldi',         count: 5, icon: MessageSquare, glowColor: 'green' },
  { id: 'analiz',  title: 'Analiz Tamamlandı',  count: 1, icon: PieChart,      glowColor: 'purple' },
];

export const InteractiveTaskHub = () => {
  const store = useSatisSonrasiStore();
  const [activeTask, setActiveTask] = useState<TaskId | null>(null);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [successMessage, setSuccessMessage] = useState('İşlem Başarılı!');
  const navigate = useNavigate();

  // Dinamik task listesi — store'dan gelen sayılara göre
  const liveTasks: TaskDef[] = TASK_DEFINITIONS.map(t => ({
    ...t,
    count: store.taskCounts[t.id],
  }));

  const pendingTasks = liveTasks.filter(t => !store.completedTasks.has(t.id));

  const handleAction = (id: TaskId, isComplete: boolean, customMessage?: string) => {
    if (isComplete) {
      setSuccessMessage(customMessage || 'İşlem Başarılı!');
      setIsSuccessAnim(true);
      setTimeout(() => {
        setIsSuccessAnim(false);
        setActiveTask(null);
      }, 1500);
    } else {
      setActiveTask(null);
    }
  };

  // Kartlar her zaman gösterilir — boş olsa bile

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {liveTasks.map((task) => {
          const isCompleted = store.completedTasks.has(task.id);
          const isEmpty = task.count === 0 && !isCompleted;
          const Icon = task.icon;

          // Tamamlandı: yeşil tik
          if (isCompleted) {
            return (
              <div key={task.id} className="relative rounded-2xl p-6 border border-white/5 bg-[#0A0A0A] opacity-60 flex flex-col gap-3 h-[168px] justify-between">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 flex items-center justify-center">
                    <CheckCircle2 className="text-[var(--color-success)]" size={24} />
                  </div>
                  <span className="text-4xl font-display font-bold text-[var(--color-success)] tracking-tight">✓</span>
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg text-white/70">{task.title}</h3>
                  <p className="text-sm text-[var(--color-success)]/70 mt-1">Tamamlandı</p>
                </div>
              </div>
            );
          }

          // Boş (0 adet): soluk idle kart — tıklanamaz
          if (isEmpty) {
            return (
              <div key={task.id} className="relative rounded-2xl p-6 border border-white/[0.06] bg-[#0A0A0A] flex flex-col justify-between h-[168px] opacity-50">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="text-white/40" size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-4xl font-display font-bold text-white/30 tracking-tight">0</span>
                </div>
                <div>
                  <h3 className="font-display font-medium text-lg text-white/50">{task.title}</h3>
                  <p className="text-sm text-white/25 mt-1">Bekleyen yok</p>
                </div>
              </div>
            );
          }

          // Aktif: parlayan, tıklanabilir kart
          return (
            <motion.div
              key={task.id}
              layoutId={`hub-${task.id}`}
              onClick={() => setActiveTask(task.id)}
              className="cursor-pointer h-[168px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlowCard customSize={true} className="h-full p-6 flex flex-col justify-between overflow-hidden group" glowColor={task.glowColor}>
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white" size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-4xl font-display font-bold text-white tracking-tight">{task.count}</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-display font-medium text-lg text-white/90">{task.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] mt-1 group-hover:text-white/70 transition-colors">İşlem Bekliyor</p>
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              onClick={() => setActiveTask(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                layoutId={`hub-${activeTask}`}
                className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
              >
                <ActiveTaskContent
                  task={liveTasks.find(t => t.id === activeTask)!}
                  store={store}
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

// ─────────────────────────────────────────────────────────
// ActiveTaskContent — modal içeriği
// ─────────────────────────────────────────────────────────
export interface ActiveTaskContentProps {
  task: TaskDef;
  store: ReturnType<typeof useSatisSonrasiStore>;
  onClose: () => void;
  onAction: (id: TaskId, isComplete: boolean, customMessage?: string) => void;
  isSuccessAnim: boolean;
  successMessage: string;
  navigate: (path: string) => void;
}

export const ActiveTaskContent = ({
  task, store, onClose, onAction, isSuccessAnim, successMessage, navigate
}: ActiveTaskContentProps) => {
  // Sipariş state — gerçek API verisinden geliyor
  const pendingOrders: ApiOrder[] = store.pendingOrders;
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleOrder = (id: string) =>
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  const toggleAllOrders = () =>
    setSelectedOrders(selectedOrders.length === pendingOrders.length ? [] : pendingOrders.map(o => o.id));

  // Stok state — ilk bekleyen alert
  const stokOptions = [
    { value: 'increase_stock', label: 'Stok Artır', icon: PackagePlus },
    { value: 'increase_price', label: 'Fiyat Artır', icon: TrendingUp },
    { value: 'ignore', label: 'İşlem Yapma', icon: XCircle },
  ];
  const [stokAction, setStokAction] = useState('increase_stock');
  const [stockAmount, setStockAmount] = useState('50');
  const [priceStrategy, setPriceStrategy] = useState('10');
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);
  const currentAlert = store.stockAlerts[activeAlertIndex] ?? store.stockAlerts[0];

  if (isSuccessAnim) {
    return (
      <div className="flex flex-col items-center justify-center p-16 h-80 gap-6 bg-[#0A0A0A]">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-24 h-24 rounded-full bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 flex items-center justify-center text-[var(--color-success)]"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl font-display font-bold text-white text-center"
        >
          {successMessage}
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[85vh]">
      {/* Header */}
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

      {/* Body */}
      <div className="p-6 bg-[#0a0a0a] overflow-y-auto">

        {/* ── SİPARİŞ ── */}
        {task.id === 'siparis' && (
          <div className="space-y-4">
            {store.loading ? (
              <div className="flex items-center justify-center py-12 gap-3 text-[var(--color-muted)]">
                <RefreshCw className="animate-spin" size={18} />
                <span className="text-sm">Siparişler yükleniyor...</span>
              </div>
            ) : store.error ? (
              <div className="text-red-400 text-sm text-center py-8">{store.error}</div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-[var(--color-muted)]">
                    Kargoya verilecek siparişleri seçin ({pendingOrders.length} adet):
                  </p>
                  <button onClick={toggleAllOrders} className="text-sm font-medium text-[var(--color-accent)] hover:underline">
                    {selectedOrders.length === pendingOrders.length ? 'Tüm Seçimi Kaldır' : 'Tümünü Seç'}
                  </button>
                </div>
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-8 text-[var(--color-muted)] text-sm">Bekleyen sipariş yok ✓</div>
                ) : (
                  <div className="space-y-3">
                    {pendingOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => toggleOrder(o.id)}
                        className={`cursor-pointer transition-colors p-4 rounded-xl border flex items-center gap-4 ${
                          selectedOrders.includes(o.id)
                            ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/40'
                            : 'bg-[#111111] border-white/5 hover:border-white/10 hover:bg-[#151515]'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                          selectedOrders.includes(o.id) ? 'bg-[var(--color-accent)] border-[var(--color-accent)]' : 'border-white/20'
                        }`}>
                          {selectedOrders.includes(o.id) && <Check size={16} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--color-muted)] text-sm mb-1">
                            Sipariş #{o.id} — <span className="text-white/60">{o.date}</span>
                          </p>
                          <h4 className="font-medium text-white">{o.product}</h4>
                          {o.customer && <p className="text-xs text-[var(--color-muted)] mt-0.5">Müşteri: {o.customer}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-[var(--color-success)] font-bold">{o.amount.toFixed(2)} TL</p>
                          <p className="text-xs text-[var(--color-muted)] mt-0.5">x{o.quantity} adet</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── STOK ── */}
        {task.id === 'stok' && currentAlert && (
          <div className="space-y-6">
            {/* Ürün seçimi (birden fazla uyarı varsa) */}
            {store.stockAlerts.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {store.stockAlerts.map((alert, i) => (
                  <button
                    key={alert.id}
                    onClick={() => setActiveAlertIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                      activeAlertIndex === i
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {alert.productName}
                    <span className="ml-2 text-xs opacity-70">({alert.remaining} adet)</span>
                  </button>
                ))}
              </div>
            )}

            <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 p-5 rounded-xl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-[var(--color-warning)] shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-[var(--color-warning)] mb-2 text-lg">Stok Uyarısı</h4>
                  <p className="text-white/80 leading-relaxed">
                    <span className="font-bold text-white">"{currentAlert.productName}"</span> için son{' '}
                    <span className="text-orange-300 font-bold">{currentAlert.remaining} adet</span> kaldı.
                    Eşik değeri: {currentAlert.threshold} adet. Geçmiş satış hızına göre kısa sürede tükenmesi bekleniyor.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-white/80 mb-1">Nasıl ilerlemek istersiniz?</p>
              <SegmentControl
                options={stokOptions}
                value={stokAction}
                onChange={setStokAction}
                bgDefault="#151515" fgDefault="#a1a1aa"
                bgActive="var(--color-accent)" fgActive="#fff"
                bgHover="#222" fgHover="#fff"
                borderRadius="12px"
              />
            </div>

            <AnimatePresence mode="wait">
              {stokAction === 'increase_stock' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#111111] border border-white/5 p-5 rounded-xl mt-4">
                  <label className="block text-sm font-medium text-white/80 mb-3">Kaç adet stok artırılsın?</label>
                  <input
                    type="number" value={stockAmount}
                    onChange={(e) => setStockAmount(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </motion.div>
              )}
              {stokAction === 'increase_price' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#111111] border border-white/5 p-5 rounded-xl mt-4">
                  <label className="block text-sm font-medium text-white/80 mb-4">Fiyat artış stratejisi seçin:</label>
                  <ShugarRadioGroup value={priceStrategy} onChange={setPriceStrategy}>
                    <ShugarRadioGroup.Item value="10"><span className="text-white ml-2 text-sm">%10 Artır (Tavsiye Edilen)</span></ShugarRadioGroup.Item>
                    <div className="my-3 border-t border-white/5" />
                    <ShugarRadioGroup.Item value="20"><span className="text-white ml-2 text-sm">%20 Artır (Yüksek Marj)</span></ShugarRadioGroup.Item>
                  </ShugarRadioGroup>
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

        {/* ── YORUM ── */}
        {task.id === 'yorum' && (
          <div className="space-y-3">
            {store.loading ? (
              <div className="flex items-center justify-center py-12 gap-3 text-[var(--color-muted)]">
                <RefreshCw className="animate-spin" size={18} />
                <span className="text-sm">Yorumlar yükleniyor...</span>
              </div>
            ) : store.unreadReviews.length === 0 ? (
              <div className="text-center py-10 text-[var(--color-muted)] text-sm">
                Okunmamış yorum yok ✓
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-[var(--color-muted)]">
                    {store.unreadReviews.length} yeni yorum bekliyor
                  </p>
                </div>
                {/* Scrollable list */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1
                  [scrollbar-width:thin] [scrollbar-color:#333_transparent]
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-white/10">
                  {store.unreadReviews.map((review: ApiReview) => (
                    <div
                      key={review.id}
                      className="bg-[#111111] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Ürün badge + tarih */}
                      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold
                          px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10
                          border border-[var(--color-accent)]/20 text-[var(--color-accent)] truncate max-w-[60%]">
                          <Package size={11} />
                          {review.product}
                        </span>
                        <span className="text-xs text-[var(--color-muted)] shrink-0">{review.date}</span>
                      </div>

                      {/* Müşteri + Puan */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/70">{review.customer}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}
                            />
                          ))}
                          <span className="text-xs text-[var(--color-muted)] ml-1.5">{review.rating}/5</span>
                        </div>
                      </div>

                      {/* Yorum metni */}
                      {review.comment && (
                        <p className="text-sm text-white/80 leading-relaxed italic">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      )}

                      {/* Düşük puan uyarısı */}
                      {review.rating <= 2 && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold
                          text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full w-fit">
                          <AlertTriangle size={11} />
                          Düşük puan — müşteri münasebeti öneriliyor
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ANALİZ ── */}
        {task.id === 'analiz' && (
          <div className="space-y-4">
            <div className="bg-[#111111] p-5 rounded-xl border border-[var(--color-accent)]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)]" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg text-[var(--color-accent)]">
                  <PieChart size={24} />
                </div>
                <h4 className="font-bold text-white text-lg">Yeni Pazar Analizi Hazır</h4>
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                "Lamy Safari Dolma Kalem" ürününün rakip fiyatları %15 arttı. Fiyatınızı 450 TL'den 495 TL'ye çıkarmanız kâr marjınızı artıracaktır.
              </p>
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

      {/* Footer */}
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
              onClick={() => {
                approveOrders(selectedOrders);
                onAction(task.id, true, `${selectedOrders.length} sipariş kargoya verildi!`);
              }}
              disabled={selectedOrders.length === 0}
            >
              Seçilenleri Kargoya Ver ({selectedOrders.length})
            </AnimatedButton>
          )}
          {task.id === 'stok' && currentAlert && (
            <AnimatedButton
              variant={stokAction === 'ignore' ? 'outline' : 'primary'}
              onClick={() => {
                if (stokAction === 'increase_stock') {
                  resolveStockAlert(currentAlert.id);
                  onAction(task.id, true, `${stockAmount} adet stok artışı yapıldı!`);
                } else if (stokAction === 'increase_price') {
                  resolveStockAlert(currentAlert.id);
                  onAction(task.id, true, `%${priceStrategy} fiyat artışı uygulandı!`);
                } else {
                  onAction(task.id, false);
                }
              }}
            >
              {stokAction === 'ignore' ? 'Uyarıyı Kapat' : 'Onayla ve Uygula'}
            </AnimatedButton>
          )}
          {task.id === 'yorum' && (
            <AnimatedButton
              variant="primary"
              onClick={() => { markReviewsRead(); onAction(task.id, true, 'Tüm yorumlar okundu olarak işaretlendi.'); }}
            >
              Tümü Okundu
            </AnimatedButton>
          )}
          {task.id === 'analiz' && (
            <AnimatedButton
              variant="primary"
              onClick={() => { markAnalysisRead(); onAction(task.id, true, 'Analiz okundu olarak işaretlendi.'); }}
            >
              Okundu Olarak İşaretle
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  );
};
