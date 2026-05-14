import { AnimatedButton } from '../../../components/ui/AnimatedButton';
import { Reveal } from '../../../components/animation/Reveal';
import { User, Mail, Lock } from 'lucide-react';

export const UserInfoForm = () => {
  return (
    <Reveal variant="fadeUp" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Kullanıcı Bilgileri</h3>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Ad Soyad</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input 
              type="text" 
              defaultValue="Ethem Kurt"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md pl-10 pr-4 py-2 text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">E-posta Adresi</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input 
              type="email" 
              defaultValue="ethem@ajansai.com"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md pl-10 pr-4 py-2 text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--color-border)]">
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Yeni Şifre</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md pl-10 pr-4 py-2 text-[var(--color-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <AnimatedButton>Değişiklikleri Kaydet</AnimatedButton>
        </div>
      </div>
    </Reveal>
  );
};
