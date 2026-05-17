import { AnimatedButton } from '../../../components/ui/AnimatedButton';
import { Reveal } from '../../../components/animation/Reveal';
import { User, Mail, Lock } from 'lucide-react';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[#121212] backdrop-blur-md transition-all duration-300 focus-within:border-[var(--color-accent)] focus-within:bg-[#1a1a1a]">
    {children}
  </div>
);

export const UserInfoForm = () => {
  return (
    <Reveal variant="fadeUp" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
      <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Kullanıcı Bilgileri</h3>
      
      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Ad Soyad</label>
          <GlassInputWrapper>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input 
                type="text" 
                defaultValue="Ethem Kurt"
                className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
              />
            </div>
          </GlassInputWrapper>
        </div>
        
        <div>
          <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">E-posta Adresi</label>
          <GlassInputWrapper>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input 
                type="email" 
                defaultValue="ethem@ajansai.com"
                className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
              />
            </div>
          </GlassInputWrapper>
        </div>

        <div className="pt-2">
          <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Yeni Şifre</label>
          <GlassInputWrapper>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
              />
            </div>
          </GlassInputWrapper>
        </div>
        
        <div className="pt-4">
          <AnimatedButton>Değişiklikleri Kaydet</AnimatedButton>
        </div>
      </div>
    </Reveal>
  );
};
