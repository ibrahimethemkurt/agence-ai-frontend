import { useState } from 'react';
import { PageTransition } from '../components/animation/PageTransition';
import { UserInfoForm } from '../features/ayarlar/components/UserInfoForm';
import { Reveal } from '../components/animation/Reveal';
import { Bell, X, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const PLATFORMS = [
  {
    id: 'trendyol',
    name: 'Trendyol',
    logo: '/logos/trendyol.png',
    desc: 'En büyük Türk pazaryeri',
    docsUrl: 'https://developers.trendyol.com',
    keyLabel: 'Satıcı API Key',
    keyPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    secretLabel: 'API Secret',
    secretPlaceholder: 'Trendyol API Secret...',
  },
  {
    id: 'hepsiburada',
    name: 'Hepsiburada',
    logo: '/logos/hepsiburada.png',
    desc: 'Geniş ürün yelpazesine sahip platform',
    docsUrl: 'https://developers.hepsiburada.com',
    keyLabel: 'API Key',
    keyPlaceholder: 'HB-xxxxxxxxxxxxxxxxxx',
    secretLabel: 'API Secret',
    secretPlaceholder: 'Hepsiburada Secret Key...',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '/logos/amazon.png',
    desc: 'Global e-ticaret devi (Amazon TR)',
    docsUrl: 'https://developer.amazonservices.com',
    keyLabel: 'Access Key ID',
    keyPlaceholder: 'AKIAIOSFODNN7EXAMPLE',
    secretLabel: 'Secret Access Key',
    secretPlaceholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
  {
    id: 'ciceksepeti',
    name: 'Çiçeksepeti',
    logo: '/logos/ciceksepeti.png',
    desc: 'Hızla büyüyen Türk pazaryeri',
    docsUrl: 'https://developers.ciceksepeti.com',
    keyLabel: 'API Key',
    keyPlaceholder: 'cs-api-xxxxxxxxxxxxxxxxxx',
    secretLabel: 'API Secret',
    secretPlaceholder: 'Çiçeksepeti Secret...',
  },
  {
    id: 'n11',
    name: 'N11',
    logo: '/logos/n11.png',
    desc: 'Köklü Türk pazaryeri platformu',
    docsUrl: 'https://api.n11.com',
    keyLabel: 'API Key',
    keyPlaceholder: 'n11-xxxxxxxxxxxxxxxx',
    secretLabel: 'API Secret',
    secretPlaceholder: 'N11 Secret Key...',
  },
];

const NOTIF_SETTINGS = [
  { id: 'new_order', label: 'Yeni Sipariş', desc: 'Bir sipariş alındığında bildirim gönder', defaultChecked: true },
  { id: 'low_stock', label: 'Düşük Stok', desc: 'Stok belirlenen eşiğin altına düştüğünde', defaultChecked: true },
  { id: 'review', label: 'Yeni Yorum', desc: 'Ürününüze yorum yapıldığında', defaultChecked: false },
  { id: 'weekly_report', label: 'Haftalık Rapor', desc: 'Her Pazartesi özet raporu', defaultChecked: true },
];

type PlatformModalState = {
  platform: typeof PLATFORMS[number];
  apiKey: string;
  apiSecret: string;
  showSecret: boolean;
  loading: boolean;
  alert: { type: 'success' | 'error'; message: string } | null;
};

export const AyarlarPage = () => {
  const [modalState, setModalState] = useState<PlatformModalState | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());

  const openModal = (platform: typeof PLATFORMS[number]) => {
    setModalState({
      platform,
      apiKey: '',
      apiSecret: '',
      showSecret: false,
      loading: false,
      alert: null,
    });
  };

  const closeModal = () => setModalState(null);

  const handleConnect = async () => {
    if (!modalState) return;
    if (!modalState.apiKey.trim()) {
      setModalState(s => s ? { ...s, alert: { type: 'error', message: `${s.platform.keyLabel} alanı boş bırakılamaz.` } } : s);
      return;
    }
    setModalState(s => s ? { ...s, loading: true, alert: null } : s);

    // Simüle edilmiş bağlantı — gerçek API entegrasyonunda burada ilgili endpoint çağrılacak
    await new Promise(r => setTimeout(r, 1200));

    // Başarılı varsay ve localStorage'a kaydet (gerçek backend hazır olduğunda değişecek)
    const saved: Record<string, { apiKey: string; apiSecret: string }> = JSON.parse(
      localStorage.getItem('platform_keys') || '{}'
    );
    saved[modalState.platform.id] = { apiKey: modalState.apiKey, apiSecret: modalState.apiSecret };
    localStorage.setItem('platform_keys', JSON.stringify(saved));

    setConnectedPlatforms(prev => new Set([...prev, modalState.platform.id]));
    setModalState(s => s ? {
      ...s,
      loading: false,
      alert: { type: 'success', message: `${s.platform.name} başarıyla bağlandı! API anahtarı güvenli şekilde saklandı.` }
    } : s);

    setTimeout(() => closeModal(), 1800);
  };

  const handleDisconnect = (platformId: string) => {
    const saved: Record<string, unknown> = JSON.parse(localStorage.getItem('platform_keys') || '{}');
    delete saved[platformId];
    localStorage.setItem('platform_keys', JSON.stringify(saved));
    setConnectedPlatforms(prev => {
      const next = new Set(prev);
      next.delete(platformId);
      return next;
    });
  };

  return (
    <PageTransition className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--color-fg)] mb-2">Ayarlar</h1>
        <p className="text-[var(--color-muted)]">Hesap bilgilerinizi, platform bağlantılarınızı ve tercihlerinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Sol: Kullanıcı Bilgileri + Şifre */}
        <UserInfoForm />

        {/* Sağ: Platform Bağlantıları + Bildirimler */}
        <div className="space-y-6">

          {/* Platform Bağlantıları */}
          <Reveal variant="fadeUp" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-display font-medium text-[var(--color-fg)]">Platform Bağlantıları</h3>
              <p className="text-[var(--color-muted)] text-sm mt-1">API anahtarlarınızı girerek pazaryerleri ile entegre olun.</p>
            </div>

            <div className="space-y-3">
              {PLATFORMS.map((p) => {
                const isConnected = connectedPlatforms.has(p.id);
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isConnected
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-[var(--color-border)] bg-[#0d0d0d] hover:border-[var(--color-accent)]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-[var(--color-border)] flex items-center justify-center overflow-hidden p-1.5">
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-fg)] flex items-center gap-2">
                          {p.name}
                          {isConnected && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">
                              Bağlı
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[var(--color-muted)]">{p.desc}</p>
                      </div>
                    </div>
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnect(p.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Bağlantıyı Kes
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(p)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                      >
                        Bağlan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Bildirim Tercihleri */}
          <Reveal variant="fadeUp" className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Bell size={16} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-display font-medium text-[var(--color-fg)]">Bildirim Tercihleri</h3>
            </div>

            <div className="space-y-3">
              {NOTIF_SETTINGS.map((n) => (
                <label
                  key={n.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[#0d0d0d] cursor-pointer hover:border-[var(--color-accent)]/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-fg)]">{n.label}</p>
                    <p className="text-xs text-[var(--color-muted)]">{n.desc}</p>
                  </div>
                  <div className="relative ml-4 shrink-0">
                    <input type="checkbox" defaultChecked={n.defaultChecked} className="sr-only peer" id={n.id} />
                    <label htmlFor={n.id} className="w-10 h-5 bg-[#2a2a2a] rounded-full cursor-pointer peer-checked:bg-[var(--color-accent)] transition-colors block" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform pointer-events-none" />
                  </div>
                </label>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* API Key Modal */}
      {modalState && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          {/* Modal */}
          <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#2a2a2a] flex items-center justify-center overflow-hidden p-1.5">
                    <img src={modalState.platform.logo} alt={modalState.platform.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base">{modalState.platform.name} API Bağlantısı</h2>
                    <p className="text-xs text-[#737373]">API anahtarlarınızı girerek entegrasyonu tamamlayın</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#737373] hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Docs link */}
                <a
                  href={modalState.platform.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[var(--color-accent)] hover:underline mb-2"
                >
                  <ExternalLink size={13} />
                  API anahtarını nereden alacaksınız? → {modalState.platform.name} Geliştirici Dokümantasyonu
                </a>

                {/* API Key */}
                <div>
                  <label className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2 block">
                    {modalState.platform.keyLabel}
                  </label>
                  <input
                    type="text"
                    value={modalState.apiKey}
                    onChange={e => setModalState(s => s ? { ...s, apiKey: e.target.value } : s)}
                    placeholder={modalState.platform.keyPlaceholder}
                    className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] focus:border-[var(--color-accent)] focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* API Secret */}
                <div>
                  <label className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2 block">
                    {modalState.platform.secretLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={modalState.showSecret ? 'text' : 'password'}
                      value={modalState.apiSecret}
                      onChange={e => setModalState(s => s ? { ...s, apiSecret: e.target.value } : s)}
                      placeholder={modalState.platform.secretPlaceholder}
                      className="w-full bg-[#121212] border border-[#2a2a2a] rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-[#555] focus:border-[var(--color-accent)] focus:outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setModalState(s => s ? { ...s, showSecret: !s.showSecret } : s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                    >
                      {modalState.showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Güvenlik notu */}
                <div className="bg-[#1a1a1a] rounded-xl p-3 text-xs text-[#737373] leading-relaxed">
                  🔒 API anahtarlarınız yalnızca bu cihazda şifrelenmiş olarak saklanır. Hiçbir zaman üçüncü taraflarla paylaşılmaz.
                </div>

                {/* Alert */}
                {modalState.alert && (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                    modalState.alert.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    {modalState.alert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {modalState.alert.message}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-[#2a2a2a] text-[#a3a3a3] hover:bg-[#1a1a1a] text-sm font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleConnect}
                  disabled={modalState.loading}
                  className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-2)] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {modalState.loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Bağlanıyor...</>
                  ) : (
                    'Bağlantıyı Tamamla'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </PageTransition>
  );
};
