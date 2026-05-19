import { useState, useEffect } from 'react';
import { Reveal } from '../../../components/animation/Reveal';
import { User, Mail, Lock, Building2, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[#121212] backdrop-blur-md transition-all duration-300 focus-within:border-[var(--color-accent)] focus-within:bg-[#1a1a1a]">
    {children}
  </div>
);

type AlertType = { type: 'success' | 'error'; message: string } | null;

export const UserInfoForm = () => {
  // Profil bilgileri
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [profileAlert, setProfileAlert] = useState<AlertType>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Şifre değiştirme
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState<AlertType>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Kullanıcı verilerini yükle
  useEffect(() => {
    api.getMe()
      .then(user => {
        setFullName(user.full_name || '');
        setCompanyName(user.company_name || '');
        setEmail(user.email || '');
      })
      .catch(() => setProfileAlert({ type: 'error', message: 'Kullanıcı bilgileri yüklenemedi.' }));
  }, []);

  const handleProfileSave = async () => {
    if (!fullName.trim()) {
      setProfileAlert({ type: 'error', message: 'Ad Soyad boş bırakılamaz.' });
      return;
    }
    setProfileLoading(true);
    setProfileAlert(null);
    try {
      await api.updateProfile({ full_name: fullName.trim(), company_name: companyName.trim() });
      setProfileAlert({ type: 'success', message: 'Bilgileriniz başarıyla güncellendi.' });
    } catch (err: any) {
      setProfileAlert({ type: 'error', message: err.message || 'Güncelleme başarısız.' });
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileAlert(null), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordAlert({ type: 'error', message: 'Tüm şifre alanlarını doldurun.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordAlert({ type: 'error', message: 'Yeni şifre en az 6 karakter olmalı.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordAlert({ type: 'error', message: 'Yeni şifreler eşleşmiyor.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordAlert(null);
    try {
      await api.changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordAlert({ type: 'success', message: 'Şifreniz başarıyla değiştirildi.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordAlert({ type: 'error', message: err.message || 'Şifre değiştirilemedi.' });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordAlert(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil Bilgileri Kartı */}
      <Reveal variant="fadeUp" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Kullanıcı Bilgileri</h3>

        <div className="space-y-4 max-w-md">
          {/* Ad Soyad */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Ad Soyad</label>
            <GlassInputWrapper>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adınızı girin"
                  className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
                />
              </div>
            </GlassInputWrapper>
          </div>

          {/* Şirket Adı */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Şirket Adı</label>
            <GlassInputWrapper>
              <div className="relative">
                <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Şirket adınızı girin"
                  className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-4 py-4 rounded-2xl focus:outline-none"
                />
              </div>
            </GlassInputWrapper>
          </div>

          {/* E-posta (salt okunur) */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">
              E-posta Adresi
              <span className="ml-2 text-xs opacity-50">(değiştirilemez)</span>
            </label>
            <GlassInputWrapper>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-4 py-4 rounded-2xl focus:outline-none opacity-60 cursor-not-allowed"
                />
              </div>
            </GlassInputWrapper>
          </div>

          {/* Alert */}
          {profileAlert && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              profileAlert.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {profileAlert.type === 'success'
                ? <CheckCircle2 size={16} />
                : <AlertCircle size={16} />}
              {profileAlert.message}
            </div>
          )}

          {/* Kaydet Butonu */}
          <div className="pt-2">
            <button
              onClick={handleProfileSave}
              disabled={profileLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-2)] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(160,124,254,0.25)]"
            >
              {profileLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Kaydediliyor...</>
              ) : (
                'Değişiklikleri Kaydet'
              )}
            </button>
          </div>
        </div>
      </Reveal>

      {/* Şifre Değiştir Kartı */}
      <Reveal variant="fadeUp" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="text-lg font-display font-medium text-[var(--color-fg)] mb-6">Şifre Değiştir</h3>

        <div className="space-y-4 max-w-md">
          {/* Mevcut Şifre */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Mevcut Şifre</label>
            <GlassInputWrapper>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifreniz"
                  className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-12 py-4 rounded-2xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          {/* Yeni Şifre */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Yeni Şifre</label>
            <GlassInputWrapper>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-12 py-4 rounded-2xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          {/* Şifre Tekrar */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Yeni Şifre (Tekrar)</label>
            <GlassInputWrapper>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifreyi tekrar girin"
                  className="w-full bg-transparent text-[var(--color-fg)] text-sm pl-12 pr-12 py-4 rounded-2xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          {/* Şifre eşleşme göstergesi */}
          {newPassword && confirmPassword && (
            <div className={`text-xs flex items-center gap-1.5 ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
              {newPassword === confirmPassword
                ? <><CheckCircle2 size={13} /> Şifreler eşleşiyor</>
                : <><AlertCircle size={13} /> Şifreler eşleşmiyor</>}
            </div>
          )}

          {/* Alert */}
          {passwordAlert && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              passwordAlert.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {passwordAlert.type === 'success'
                ? <CheckCircle2 size={16} />
                : <AlertCircle size={16} />}
              {passwordAlert.message}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#2a2a2a] border border-[var(--color-border)] hover:bg-[#333] hover:border-[var(--color-accent)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {passwordLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Değiştiriliyor...</>
              ) : (
                'Şifreyi Değiştir'
              )}
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
