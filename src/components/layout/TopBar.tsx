import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Bell, Search, AlertTriangle, ShieldAlert, FlaskConical, Loader2, Menu as MenuIcon } from "lucide-react";
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { useInsights, type Insight, type InsightType } from '../../hooks/useInsights';

// Severity rengini döndür
const severityColor: Record<string, string> = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
};

// Type'a göre icon
const typeIcon = (type: InsightType) => {
  if (type === 'crisis_management') return <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />;
  if (type === 'supplier_advice') return <FlaskConical className="w-4 h-4 text-orange-400 shrink-0" />;
  return <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />;
};

export const TopBar = ({ toggleAIAssistant, toggleSidebar }: { toggleAIAssistant?: () => void, toggleSidebar?: () => void }) => {
  const navigate = useNavigate();
  const { insights, loading, unreadCount, markAllRead } = useInsights();

  const handleBellOpen = () => {
    markAllRead();
  };
  return (
    <header className="h-[72px] bg-[#0A0A0A]/40 backdrop-blur-xl border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={toggleSidebar}
          className="text-[var(--color-fg)] opacity-50 hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-[var(--color-surface)]"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
          <input
            type="text"
            placeholder="Arama yapın..."
            className="w-full bg-[#1A1A1A]/50 border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--color-fg)] focus:outline-none focus:border-[var(--color-accent)] focus:bg-[#1A1A1A] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleAIAssistant}
          className="flex items-center gap-2 bg-[#E2E8F0] text-gray-900 px-4 py-2 rounded-lg font-medium font-body text-sm hover:bg-white transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Assistant</span>
        </button>

        <div className="flex items-center gap-5 text-[var(--color-fg)] opacity-70">

          {/* ── Mail menüsü (sabit) ── */}
          <Menu.Root positioning={{ placement: "bottom-end", gutter: 12 }}>
            <Menu.Trigger className="hover:opacity-100 transition-opacity relative cursor-pointer outline-none">
              <Mail className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-bg)] translate-x-1/3 -translate-y-1/3"></span>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-2 min-w-[280px] focus-visible:outline-none font-body text-white">
                  <div className="px-2 py-1.5 text-sm font-bold border-b border-[#2a2a2a] mb-2 text-[#737373] tracking-wide">Mesajlar</div>
                  <Menu.Item value="msg-1" className="flex flex-col gap-1 px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors">
                    <span className="font-semibold text-[var(--color-accent)]">Destek Ekibi</span>
                    <span className="text-xs text-[#a3a3a3]">Yeni bir talebiniz var.</span>
                  </Menu.Item>
                  <Menu.Item value="msg-2" className="flex flex-col gap-1 px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors mt-1">
                    <span className="font-semibold text-[var(--color-accent)]">Müşteri Temsilcisi</span>
                    <span className="text-xs text-[#a3a3a3]">Toplantı notları sisteme eklendi.</span>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          {/* ── Zil (AI Insights) ── */}
          <Menu.Root positioning={{ placement: "bottom-end", gutter: 12 }} onOpenChange={handleBellOpen}>
            <Menu.Trigger className="hover:opacity-100 transition-opacity relative cursor-pointer outline-none">
              <Bell className="w-5 h-5" />
              {/* Badge — sadece okunmamış varsa göster */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 rounded-full border border-[var(--color-bg)] flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                  {unreadCount}
                </span>
              )}
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-2 min-w-[320px] max-w-[360px] focus-visible:outline-none font-body text-white">
                  <div className="px-2 py-1.5 text-sm font-bold border-b border-[#2a2a2a] mb-2 text-[#737373] tracking-wide flex items-center justify-between">
                    <span>AI Operasyon Uyarıları</span>
                    {loading && <Loader2 className="w-3 h-3 animate-spin text-[#737373]" />}
                  </div>

                  {loading && (
                    <div className="px-3 py-4 text-center text-xs text-[#737373]">
                      Ajan analiz ediyor...
                    </div>
                  )}

                  {!loading && insights.length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-[#737373]">
                      Şu an kritik bir uyarı yok 🎉
                    </div>
                  )}

                  {!loading && insights.map((insight, i) => (
                    <Menu.Item
                      key={i}
                      value={`insight-${i}`}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors mt-1"
                      onClick={() => navigate('/ajanlar/satis-sonrasi?tab=Operasyon Merkezi')}
                    >
                      {typeIcon(insight.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-semibold text-sm leading-tight"
                            style={{ color: severityColor[insight.severity] }}
                          >
                            {insight.title}
                          </span>
                        </div>
                        {insight.product_name && (
                          <span className="text-[10px] text-[#737373] font-medium">📦 {insight.product_name}</span>
                        )}
                        <p className="text-xs text-[#a3a3a3] mt-0.5 leading-relaxed line-clamp-2">
                          {insight.message}
                        </p>
                      </div>
                    </Menu.Item>
                  ))}

                  {!loading && insights.length > 0 && (
                    <div
                      className="mt-2 pt-2 border-t border-[#2a2a2a] px-3 py-1.5 text-xs text-center text-[var(--color-accent)] cursor-pointer hover:underline"
                      onClick={() => navigate('/ajanlar/satis-sonrasi?tab=Operasyon Merkezi')}
                    >
                      Operasyon Merkezi'nde detayları gör →
                    </div>
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

        </div>
      </div>
    </header>
  );
};
