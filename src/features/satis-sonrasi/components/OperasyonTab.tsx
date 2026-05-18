import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle, Sparkles, MessageSquare, ShieldAlert, FlaskConical, Brain } from 'lucide-react';
import { Reveal } from '../../../components/animation/Reveal';
import { GlowCard } from '../../../components/ui/glow-card';
import { TASK_DEFINITIONS, ActiveTaskContent, type TaskId } from '../../dashboard/components/InteractiveTaskHub';
import { BorderBeam } from '../../../components/ui/border-beam';
import { useInsights, type InsightType } from '../../../hooks/useInsights';

const OPERASYON_PRODUCTS = [
  {
    id: 'p1',
    name: 'Kablosuz Kulaklık V2',
    variants: 'Beyaz',
    sold: 1245,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=100&q=80',
    status: 'critical',
    aiSummary: "Müşterilerin %80'i ses kalitesinden memnun, ancak son haftadaki yorumların %60'ında kargo gecikmeleri raporlanmış. Ürün puanı düşüşte, acil lojistik müdahalesi önerilir.",
    task: 'stok' as TaskId, // Will map to "Stok Uyarısı"
  },
  {
    id: 'p2',
    name: 'Akıllı Saat Pro Max',
    variants: 'Siyah, Gümüş',
    sold: 856,
    stock: 145,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=100&q=80',
    status: 'warning',
    aiSummary: "Batarya ömrü genel olarak olumlu bulunuyor fakat yazılım güncellemesi sonrası donma yaşandığı belirtilmiş. Bekleyen siparişlerin gönderilmeden önce incelenmesi tavsiye edilir.",
    task: 'siparis' as TaskId, // Will map to "Sipariş Geldi"
  },
  {
    id: 'p3',
    name: 'Mekanik Klavye Blue Switch',
    variants: 'Siyah',
    sold: 2130,
    stock: 320,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=100&q=80',
    status: 'good',
    aiSummary: "Kullanıcılar tuş hassasiyetini ve aydınlatmayı oldukça beğenmiş. Herhangi bir donanımsal veya kargo odaklı şikayet tespit edilmedi. Satışlar stabil.",
    task: null,
  }
];

import { useSatisSonrasiData } from '../hooks/useSatisSonrasiData';

// ─── Severity helpers ──────────────────────────────────────────────────────────
const severityConfig = {
  high: { border: 'border-red-500/30', bg: 'bg-red-500/5', dot: 'bg-red-500', label: 'Kritik' },
  medium: { border: 'border-orange-400/30', bg: 'bg-orange-400/5', dot: 'bg-orange-400', label: 'Önemli' },
  low: { border: 'border-emerald-400/30', bg: 'bg-emerald-400/5', dot: 'bg-emerald-400', label: 'Bilgi' },
};

const typeConfig = {
  root_cause: { icon: AlertTriangle, label: 'Kök Neden', color: 'text-yellow-400' },
  crisis_management: { icon: ShieldAlert, label: 'Kriz Yönetimi', color: 'text-red-400' },
  supplier_advice: { icon: FlaskConical, label: 'Tedarikçi', color: 'text-orange-400' },
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

export const OperasyonTab = () => {
  const { operations, loading } = useSatisSonrasiData();
  const [activeTask, setActiveTask] = useState<TaskId | null>(null);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [successMessage, setSuccessMessage] = useState("İşlem Başarılı!");
  
  const navigate = useNavigate();

  const handleAction = (_id: TaskId, isComplete: boolean, customMessage?: string) => {
    if (isComplete) {
      if (customMessage) setSuccessMessage(customMessage);
      else setSuccessMessage("İşlem Başarılı!");

      setIsSuccessAnim(true);
      setTimeout(() => {
        setIsSuccessAnim(false);
        setActiveTask(null);
      }, 1500);
    } else {
      setActiveTask(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="w-10 h-10 border-4 border-t-emerald-500 border-white/10 rounded-full animate-spin"></div>
        <p className="text-[var(--color-muted)] font-medium animate-pulse">Operasyon Ajanı verileri analiz ediyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* ═══════════ TOP DASHBOARD CARDS ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TASK_DEFINITIONS.map((task, index) => {
          const Icon = task.icon;
          return (
            <Reveal key={task.id} variant="fadeUp" delay={0.1 * (index + 1)}>
              <motion.div
                layoutId={`hub-top-${task.id}`}
                onClick={() => setActiveTask(task.id)}
                className="cursor-pointer h-[140px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlowCard customSize={true} className="h-full p-5 flex flex-col justify-between overflow-hidden group" glowColor={task.glowColor}>
                    <div className="flex items-start justify-between relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-white" size={24} strokeWidth={1.5} />
                      </div>
                      <span className="text-4xl font-display font-bold text-white tracking-tight">{task.count}</span>
                    </div>
                    <div className="relative z-10 mt-2">
                      <h3 className="font-display font-semibold text-lg text-white/90 leading-tight">{task.title}</h3>
                      <p className="text-sm text-[var(--color-muted)] mt-0.5 group-hover:text-white/70 transition-colors">İşlem Bekliyor</p>
                    </div>
                </GlowCard>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* ═══════════ AI INSIGHTS PANEL ═══════════ */}
      <InsightsPanel />

      {/* ═══════════ PRODUCTS TABLE ═══════════ */}
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
                {operations.map((product) => {
                  const taskDef = product.task ? TASK_DEFINITIONS.find(t => t.id === product.task) : null;
                  
                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* GÖRSEL */}
                      <td className="p-3 pl-5 align-middle w-20">
                        <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden bg-[#1A1A1A] shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      
                      {/* ÜRÜN */}
                      <td className="p-3 align-middle min-w-[250px]">
                        <h4 className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="text-[var(--color-muted)]">Varyant: <span className="text-white/70">{product.variants}</span></span>
                          <span className="text-[var(--color-muted)]">Satılan: <span className="text-emerald-400 font-medium">{product.sold}</span></span>
                          <span className="text-[var(--color-muted)]">Kalan: <span className={product.stock < 20 ? 'text-red-400 font-bold' : 'text-white/70'}>{product.stock}</span></span>
                        </div>
                      </td>
                      
                      {/* YAPAY ZEKA YORUM ÖZETİ */}
                      <td className="p-3 align-middle w-full">
                        <div className="relative flex flex-col bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 min-w-[420px] max-w-[500px] min-h-[120px] group-hover:border-white/10 transition-colors overflow-hidden">
                          {(product.status === 'critical' || product.status === 'warning') && (
                            <BorderBeam
                              size={250}
                              duration={12}
                              borderWidth={1.5}
                              colorFrom="#3b82f6"
                              colorTo="#1d4ed8"
                            />
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
                        </div>
                      </td>

                      {/* AKSİYON MERKEZİ */}
                      <td className="p-3 pr-5 align-middle w-[200px]">
                        <div className="flex justify-start">
                          {taskDef ? (
                            <motion.div
                              onClick={() => setActiveTask(product.task)}
                              className="cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="relative w-[180px] h-[120px] rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col justify-between p-4 group-hover:border-white/10 transition-colors overflow-hidden">
                                  <BorderBeam
                                    size={150}
                                    duration={8}
                                    borderWidth={1.5}
                                    colorFrom={product.task === 'stok' ? '#ef4444' : '#a855f7'}
                                    colorTo={product.task === 'stok' ? '#b91c1c' : '#7e22ce'}
                                  />
                                  <div className="flex items-start justify-between relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                      {taskDef.icon && <taskDef.icon className="text-white" size={20} strokeWidth={1.5} />}
                                    </div>
                                    <span className="text-3xl font-display font-bold text-white tracking-tight">{taskDef.count}</span>
                                  </div>
                                  <div className="relative z-10 mt-2">
                                    <h3 className="font-display font-semibold text-[15px] text-white/90 leading-tight">{taskDef.title}</h3>
                                    <p className="text-xs text-[var(--color-muted)] mt-0.5 group-hover:text-white/70 transition-colors">İşlem Bekliyor</p>
                                  </div>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="w-[180px] h-[120px] rounded-2xl bg-[#050505] border border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
                              <Sparkles className="w-6 h-6 text-emerald-400/50" />
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

      {/* ═══════════ MODAL INTERACTIVE TASK HUB ═══════════ */}
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
                layoutId={`hub-top-${activeTask}`}
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

    </div>
  );
};
