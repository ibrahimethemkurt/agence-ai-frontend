import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Sparkles, MessageSquare, ShieldAlert,
  FlaskConical, Brain, Package, Clock, ShoppingBag, RefreshCw
} from 'lucide-react';
import { Reveal } from '../../../components/animation/Reveal';
import { GlowCard } from '../../../components/ui/glow-card';
import {
  TASK_DEFINITIONS,
  ActiveTaskContent,
  type TaskId,
} from '../../dashboard/components/InteractiveTaskHub';
import { BorderBeam } from '../../../components/ui/border-beam';
import { useInsights } from '../../../hooks/useInsights';
import { useSatisSonrasiStore } from '../store/satisSonrasiStore';

// ─── Severity helpers ───────────────────────────────────────────
const severityConfig = {
  high:   { border: 'border-red-500/30',    bg: 'bg-red-500/5',    dot: 'bg-red-500',    label: 'Kritik' },
  medium: { border: 'border-orange-400/30', bg: 'bg-orange-400/5', dot: 'bg-orange-400', label: 'Önemli' },
  low:    { border: 'border-emerald-400/30',bg: 'bg-emerald-400/5',dot: 'bg-emerald-400',label: 'Bilgi' },
};

const typeConfig = {
  root_cause:      { icon: AlertTriangle, label: 'Kök Neden',    color: 'text-yellow-400' },
  crisis_management:{ icon: ShieldAlert,  label: 'Kriz Yönetimi',color: 'text-red-400' },
  supplier_advice: { icon: FlaskConical,  label: 'Tedarikçi',    color: 'text-orange-400' },
};

const InsightsPanel = () => {
  const { insights, loading } = useInsights();

  if (loading) {
    return (
      <Reveal variant="fadeUp" delay={0.45}>
        <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <Brain className="w-5 h-5 text-[var(--color-accent)] animate-pulse shrink-0" />
          <p className="text-sm text-[var(--color-muted)] animate-pulse">Kalite Kontrol Ajanı mağazanı analiz ediyor...</p>
        </div>
      </Reveal>
    );
  }

  if (!insights.length) return null;

  return (
    <Reveal variant="fadeUp" delay={0.45}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="text-sm font-semibold text-white/80 tracking-wide uppercase">AI Operasyon Uyarıları</h3>
          <span className="ml-auto text-xs text-[var(--color-muted)]">{insights.length} tespit</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, i) => {
            const sev = severityConfig[insight.severity] ?? severityConfig.low;
            const typ = typeConfig[insight.type] ?? typeConfig.root_cause;
            const Icon = typ.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`relative flex flex-col gap-2 p-4 rounded-2xl border ${sev.border} ${sev.bg} overflow-hidden`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${typ.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">{typ.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                      <span className="text-[11px] text-white/40">{sev.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/90 leading-tight mt-1">{insight.title}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed pl-6">{insight.message}</p>
                {insight.product_name && (
                  <div className="pl-6">
                    <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                      📦 {insight.product_name}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
};

// ─── Aksiyon badge helper ────────────────────────────────────────
const TASK_BADGE: Record<TaskId, { label: string; color: string; border: string }> = {
  siparis: { label: 'Sipariş Bekliyor',      color: 'text-blue-300',   border: 'border-blue-500/30' },
  stok:    { label: 'Stok Uyarısı',          color: 'text-orange-300', border: 'border-orange-500/30' },
  yorum:   { label: 'Yorum Okunmadı',        color: 'text-green-300',  border: 'border-green-500/30' },
  analiz:  { label: 'Analiz Hazır',          color: 'text-purple-300', border: 'border-purple-500/30' },
};

export const OperasyonTab = () => {
  const store = useSatisSonrasiStore();
  const [activeTask, setActiveTask] = useState<TaskId | null>(null);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [successMessage, setSuccessMessage] = useState('İşlem Başarılı!');
  const navigate = useNavigate();

  // Dinamik task listesi
  const liveTasks = TASK_DEFINITIONS.map(t => ({
    ...t,
    count: store.taskCounts[t.id],
  }));

  const handleAction = (_id: TaskId, isComplete: boolean, customMessage?: string) => {
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

  return (
    <div className="space-y-8">

      {/* Yükleme durumu */}
      {store.loading && (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
          <div className="w-10 h-10 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin" />
          <p className="text-[var(--color-muted)] font-medium animate-pulse">Operasyon verileri yükleniyor...</p>
        </div>
      )}

      {/* Hata durumu */}
      {!store.loading && store.error && (
        <div className="flex flex-col items-center justify-center p-16 gap-4">
          <AlertTriangle className="text-red-400" size={40} />
          <p className="text-red-400 font-medium">{store.error}</p>
          <button
            onClick={store.refetch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <RefreshCw size={16} /> Tekrar Dene
          </button>
        </div>
      )}

      {!store.loading && !store.error && (<>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {liveTasks.map((task, index) => {
          const Icon = task.icon;
          const isCompleted = store.completedTasks.has(task.id);
          const isEmpty = task.count === 0 && !isCompleted;
          const isInteractive = !isCompleted && !isEmpty;
          return (
            <Reveal key={task.id} variant="fadeUp" delay={0.1 * (index + 1)}>
              <motion.div
                layoutId={`hub-top-${task.id}`}
                onClick={() => isInteractive && setActiveTask(task.id)}
                className={`h-[140px] ${
                  isInteractive ? 'cursor-pointer' : 'cursor-default'
                } ${(isCompleted || isEmpty) ? 'opacity-50' : ''}`}
                whileHover={isInteractive ? { scale: 1.02 } : {}}
                whileTap={isInteractive ? { scale: 0.98 } : {}}
              >
                <GlowCard
                  customSize={true}
                  className="h-full p-5 flex flex-col justify-between overflow-hidden group"
                  glowColor={isCompleted ? 'green' : task.glowColor}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-4xl font-display font-bold text-white tracking-tight">
                      {isCompleted ? '\u2713' : task.count}
                    </span>
                  </div>
                  <div className="relative z-10 mt-2">
                    <h3 className="font-display font-semibold text-lg text-white/90 leading-tight">{task.title}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-0.5 group-hover:text-white/70 transition-colors">
                      {isCompleted ? 'Tamamland\u0131' : isEmpty ? 'Bekleyen yok' : '\u0130\u015flem Bekliyor'}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* ═══ AI INSIGHTS PANEL ═══ */}
      <InsightsPanel />

      {/* ═══ PRODUCTS TABLE ═══ */}
      <Reveal variant="fadeUp" delay={0.5}>
        <div className="bg-[#0A0A0A] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#121212] border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                  <th className="p-3 pl-5">GÖRSEL</th>
                  <th className="p-3">ÜRÜN</th>
                  <th className="p-3"></th>
                  <th className="p-3 pr-5 text-left">AKSİYON MERKEZİ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {store.products.map((product) => {
                  // Ürünün bekleyen her aksiyonu için kartlar göster
                  const pendingTaskDefs = product.pendingTasks
                    .filter(tid => !store.completedTasks.has(tid))
                    .map(tid => liveTasks.find(t => t.id === tid))
                    .filter(Boolean) as typeof liveTasks;

                  const hasLowStock = product.stock < 10;

                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">

                      {/* GÖRSEL */}
                      <td className="p-3 pl-5 align-middle w-20">
                        <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden bg-[#1A1A1A] shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>

                      {/* ÜRÜN BİLGİSİ */}
                      <td className="p-3 align-middle min-w-[250px]">
                        <h4 className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-3 mt-1.5 text-xs flex-wrap">
                          <span className="text-[var(--color-muted)]">Varyant: <span className="text-white/70">{product.variants}</span></span>
                          <span className="text-[var(--color-muted)]">Satılan: <span className="text-emerald-400 font-medium">{product.sold}</span></span>
                          <span className="text-[var(--color-muted)]">
                            Kalan:{' '}
                            <span className={hasLowStock ? 'text-red-400 font-bold' : 'text-white/70'}>
                              {product.stock}
                            </span>
                            {hasLowStock && (
                              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-[10px] font-semibold">DÜŞÜK</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* AI YORUM ÖZETİ */}
                      <td className="p-3 align-middle w-full">
                        <div className={`relative flex flex-col border rounded-2xl p-4 min-w-[420px] max-w-[500px] min-h-[120px] transition-colors overflow-hidden ${
                          pendingTaskDefs.length > 0
                            ? 'bg-[#0d0d1a] border-blue-500/20 group-hover:border-blue-500/30'
                            : 'bg-[#0A0A0A] border-white/5 group-hover:border-white/10'
                        }`}>
                          {pendingTaskDefs.length > 0 && (
                            <BorderBeam size={250} duration={12} borderWidth={1.5} colorFrom="#3b82f6" colorTo="#1d4ed8" />
                          )}
                          <div className="flex items-start gap-3 relative z-10">
                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 mt-1.5">
                              <h3 className="font-display font-semibold text-[14px] text-white/90 leading-tight">AI Yorum Özeti</h3>
                            </div>
                          </div>
                          <p className="text-[13px] text-[var(--color-muted)] leading-relaxed relative z-10 mt-3">{product.aiSummary}</p>

                          {/* Bekleyen aksiyon badge'leri */}
                          {pendingTaskDefs.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap relative z-10">
                              {pendingTaskDefs.map(td => {
                                const badge = TASK_BADGE[td.id];
                                return (
                                  <button
                                    key={td.id}
                                    onClick={() => setActiveTask(td.id)}
                                    className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-black/30 ${badge.color} ${badge.border} hover:opacity-80 transition-opacity`}
                                  >
                                    <Clock size={11} />
                                    {badge.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* AKSİYON MERKEZİ */}
                      <td className="p-3 pr-5 align-middle w-[200px]">
                        <div className="flex justify-start">
                          {pendingTaskDefs.length > 0 ? (
                            <div className="flex flex-col gap-2 w-[180px]">
                              {pendingTaskDefs.map(td => (
                                <motion.div
                                  key={td.id}
                                  onClick={() => setActiveTask(td.id)}
                                  className="cursor-pointer"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className={`relative w-full rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center gap-3 p-3 group-hover:border-white/10 transition-colors overflow-hidden`}>
                                    <BorderBeam
                                      size={120}
                                      duration={8}
                                      borderWidth={1.5}
                                      colorFrom={td.id === 'stok' ? '#ef4444' : td.id === 'siparis' ? '#3b82f6' : '#a855f7'}
                                      colorTo={td.id === 'stok' ? '#b91c1c' : td.id === 'siparis' ? '#1d4ed8' : '#7e22ce'}
                                    />
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative z-10">
                                      {td.id === 'siparis' && <Package className="text-blue-300" size={16} strokeWidth={1.5} />}
                                      {td.id === 'stok' && <AlertTriangle className="text-orange-300" size={16} strokeWidth={1.5} />}
                                      {td.id === 'yorum' && <MessageSquare className="text-green-300" size={16} strokeWidth={1.5} />}
                                      {td.id === 'analiz' && <ShoppingBag className="text-purple-300" size={16} strokeWidth={1.5} />}
                                    </div>
                                    <div className="relative z-10">
                                      <p className="text-xs font-semibold text-white/90 leading-tight">{td.title}</p>
                                      <p className="text-[10px] text-[var(--color-muted)]">{td.count} işlem bekliyor</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-[180px] h-[80px] rounded-2xl bg-[#050505] border border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
                              <Sparkles className="w-5 h-5 text-emerald-400/50" />
                              <span className="text-xs text-[var(--color-muted)]">Aksiyon Gerekmiyor</span>
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* ═══ MODAL ═══ */}
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
                layoutId={`hub-top-${activeTask}`}
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

      </>)}  {/* /!store.loading && !store.error */}

    </div>
  );
};
