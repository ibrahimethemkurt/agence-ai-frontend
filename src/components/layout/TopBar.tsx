import { Combobox } from "@/components/ui/combobox";
import { Sparkles, Mail, Bell } from "lucide-react";
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";

export const TopBar = ({ toggleAIAssistant }: { toggleAIAssistant?: () => void }) => {
  return (
    <header className="h-[72px] bg-[#0A0A0A]/40 backdrop-blur-xl border-b border-[var(--color-border)] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <Combobox placeholder="Arama yapın...">
          <Combobox.Input />
          <Combobox.List emptyMessage="Sonuç bulunamadı">
            <Combobox.Option value="dashboard">Dashboard</Combobox.Option>
            <Combobox.Option value="pazar-analizi">Pazar Analizi</Combobox.Option>
            <Combobox.Option value="fiyat-analizi">Fiyat Analizi</Combobox.Option>
            <Combobox.Option value="raporlar">Raporlar</Combobox.Option>
            <Combobox.Option value="ayarlar">Ayarlar</Combobox.Option>
          </Combobox.List>
        </Combobox>
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
          
          <Menu.Root positioning={{ placement: "bottom-end", gutter: 12 }}>
            <Menu.Trigger className="hover:opacity-100 transition-opacity relative cursor-pointer outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-bg)] translate-x-1/2 -translate-y-1/3"></span>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content className="z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#2a2a2a] rounded-xl shadow-2xl p-2 min-w-[280px] focus-visible:outline-none font-body text-white">
                  <div className="px-2 py-1.5 text-sm font-bold border-b border-[#2a2a2a] mb-2 text-[#737373] tracking-wide">Bildirimler</div>
                  <Menu.Item value="notif-1" className="flex flex-col gap-1 px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors">
                    <span className="font-semibold text-[#22c55e]">Sistem Güncellemesi</span>
                    <span className="text-xs text-[#a3a3a3]">AjansAI yeni versiyona güncellendi.</span>
                  </Menu.Item>
                  <Menu.Item value="notif-2" className="flex flex-col gap-1 px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--color-surface)] cursor-pointer outline-none transition-colors mt-1">
                    <span className="font-semibold text-[#22c55e]">Rapor Hazır</span>
                    <span className="text-xs text-[#a3a3a3]">Haftalık analiz raporunuz tamamlandı.</span>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          
        </div>
      </div>
    </header>
  );
};
