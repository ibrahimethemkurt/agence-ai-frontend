import { Combobox } from "@/components/ui/combobox";
import { Sparkles, History, Mail, Bell } from "lucide-react";

export const TopBar = () => {
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
        <button className="flex items-center gap-2 bg-[#E2E8F0] text-gray-900 px-4 py-2 rounded-lg font-medium font-body text-sm hover:bg-white transition-colors">
          <Sparkles className="w-4 h-4" />
          <span>AI Assistant</span>
        </button>

        <div className="flex items-center gap-5 text-[var(--color-fg)] opacity-70">
          <button className="hover:opacity-100 transition-opacity">
            <History className="w-5 h-5" />
          </button>
          
          <button className="hover:opacity-100 transition-opacity relative">
            <Mail className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-bg)] translate-x-1/3 -translate-y-1/3"></span>
          </button>
          
          <button className="hover:opacity-100 transition-opacity relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-bg)] translate-x-1/2 -translate-y-1/3"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
