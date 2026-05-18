import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Reveal } from './animation/Reveal';
import { Stagger } from './animation/Stagger';
import Grainient from './animation/GrainientBackground';
import { Radio } from './radio';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[#121212] backdrop-blur-md transition-all duration-300 focus-within:border-[var(--color-accent)] focus-within:bg-[#1a1a1a]">
    {children}
  </div>
);

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError(null);
        await api.googleLogin(tokenResponse.access_token);
        setSuccessRedirect(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Google ile kayıt/giriş başarısız.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google ile giriş yapılamadı.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      setError('Kullanıcı sözleşmesini kabul etmeniz gerekmektedir.');
      return;
    }
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
    const company = (form.elements.namedItem('company') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      const errMsg = 'Şifreler eşleşmiyor.';
      setError(errMsg);
      setLoading(false);
      return;
    }

    try {
      await api.register({
        full_name: `${firstName} ${lastName}`.trim(),
        company_name: company,
        email,
        password,
        password_confirm: confirmPassword,
      });
      setSuccessRedirect(true);
      // Kayıt başarılı → otomatik giriş yap
      await api.login(email, password);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      const errMsg = err.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[100dvh] flex flex-col md:flex-row font-body w-[100dvw] bg-[var(--color-bg)] relative overflow-hidden"
      style={{ '--color-accent': '#8B5CF6' } as React.CSSProperties}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Grainient
          color1="#05031a" color2="#251a52" color3="#13071e"
          timeSpeed={0.5} colorBalance={-0.1} warpStrength={2} warpFrequency={4}
          warpSpeed={3} warpAmplitude={50} blendAngle={0.5} blendSoftness={0.1}
          rotationAmount={500} noiseScale={2} grainAmount={0.08} grainScale={2}
          grainAnimated={false} contrast={1.3} gamma={0.8} saturation={0.9}
          centerX={0} centerY={0} zoom={1}
        />
      </div>

      <section className="flex-1 flex items-center justify-center p-8 z-10 overflow-y-auto hidden-scrollbar">
        <div className="w-full max-w-md py-4">
          <Stagger className="flex flex-col gap-4" staggerDelay={0.25}>
            <Reveal variant="fadeUp" className="mb-3">
              <img src="/pazaralogo.svg" alt="Pazara" className="h-14 w-auto" />
            </Reveal>
            <Reveal variant="fadeUp">
              <h1 className="text-3xl md:text-4xl font-display font-semibold leading-tight text-[var(--color-fg)]">
                <span className="font-light tracking-tighter">Hesap Oluşturun</span>
              </h1>
            </Reveal>
            <Reveal variant="fadeUp">
              <p className="text-[var(--color-muted)] text-sm">Geleceğin e-ticaret dünyasına ilk adımınızı atın</p>
            </Reveal>

            {/* Hata Mesajı */}
            {error && (
              <Reveal variant="fadeUp">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </Reveal>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <Reveal variant="fadeUp">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Ad</label>
                    <GlassInputWrapper>
                      <input
                        name="firstName"
                        type="text"
                        placeholder="Adınız"
                        required
                        className="w-full bg-transparent text-[var(--color-fg)] text-sm px-4 py-3 rounded-2xl focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.currentTarget.closest('form')?.requestSubmit();
                          }
                        }}
                      />
                    </GlassInputWrapper>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Soyad</label>
                    <GlassInputWrapper>
                      <input
                        name="lastName"
                        type="text"
                        placeholder="Soyadınız"
                        required
                        className="w-full bg-transparent text-[var(--color-fg)] text-sm px-4 py-3 rounded-2xl focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.currentTarget.closest('form')?.requestSubmit();
                          }
                        }}
                      />
                    </GlassInputWrapper>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="fadeUp">
                <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Şirket Adı</label>
                <GlassInputWrapper>
                  <input
                    name="company"
                    type="text"
                    placeholder="Şirketinizin adı"
                    required
                    className="w-full bg-transparent text-[var(--color-fg)] text-sm px-4 py-3 rounded-2xl focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.closest('form')?.requestSubmit();
                      }
                    }}
                  />
                </GlassInputWrapper>
              </Reveal>

              <Reveal variant="fadeUp">
                <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Email Adresiniz</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email adresinizi girin"
                    required
                    className="w-full bg-transparent text-[var(--color-fg)] text-sm px-4 py-3 rounded-2xl focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.closest('form')?.requestSubmit();
                      }
                    }}
                  />
                </GlassInputWrapper>
              </Reveal>

              <Reveal variant="fadeUp">
                <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Şifre</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi oluşturun"
                      required
                      className="w-full bg-transparent text-[var(--color-fg)] text-sm px-4 py-3 pr-12 rounded-2xl focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.currentTarget.closest('form')?.requestSubmit();
                        }
                      }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      {showPassword ? <EyeOff className="w-5 h-5 text-[var(--color-muted)]" /> : <Eye className="w-5 h-5 text-[var(--color-muted)]" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </Reveal>

              <Reveal variant="fadeUp">
                <label className="text-xs font-medium text-[var(--color-muted)] mb-1.5 block">Şifre (Tekrar)</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi tekrar girin"
                      required
                      className="w-full bg-transparent text-[var(--color-fg)] text-sm px-4 py-3 pr-12 rounded-2xl focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.currentTarget.closest('form')?.requestSubmit();
                        }
                      }}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-[var(--color-muted)]" /> : <Eye className="w-5 h-5 text-[var(--color-muted)]" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </Reveal>

              <Reveal variant="fadeUp">
                <div className="flex items-start gap-3 mt-3 text-xs">
                  <div className="flex items-center gap-3 cursor-pointer pt-0.5" onClick={() => setAgreed(!agreed)}>
                    <div className="pointer-events-none"><Radio checked={agreed} /></div>
                  </div>
                  <span className="text-[var(--color-fg)]/90 cursor-pointer select-none leading-relaxed" onClick={() => setAgreed(!agreed)}>
                    <a href="#" className="text-[var(--color-accent)] hover:underline">Kullanıcı Sözleşmesini</a> ve{' '}
                    <a href="#" className="text-[var(--color-accent)] hover:underline">Gizlilik Politikasını</a> okudum, kabul ediyorum.
                  </span>
                </div>
              </Reveal>

              {successRedirect && (
                <Reveal variant="fadeUp">
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-emerald-400 shrink-0" />
                      <p className="text-sm font-semibold text-white/90">Kayıt Başarılı! Yönlendiriliyorsunuz...</p>
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal variant="fadeUp">
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading || successRedirect}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#EBEBEB] py-3.5 font-medium text-black hover:bg-white transition-all duration-300 disabled:opacity-90 disabled:cursor-not-allowed relative overflow-hidden cursor-pointer"
                  >
                    {successRedirect ? (
                      <span className="text-emerald-700 font-semibold animate-pulse">Başarıyla Kayıt Olundu!</span>
                    ) : loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Kaydediliyor...</>
                    ) : (
                      'Kayıt Ol'
                    )}

                    {/* Sleek green progress line at the bottom of the button */}
                    {successRedirect && (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'linear' }}
                        className="absolute bottom-0 left-0 h-1 bg-emerald-500"
                      />
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleGoogleLogin()}
                    className="flex-none flex items-center justify-center w-[52px] border border-white/10 bg-[#0A0A0A] text-white rounded-2xl hover:bg-[#1A1A1A] transition-colors cursor-pointer" 
                    title="Google ile Kayıt Ol"
                  >
                    <GoogleIcon />
                  </button>
                </div>
              </Reveal>
            </form>

            <Reveal variant="fadeUp">
              <p className="text-center text-sm text-[var(--color-muted)] mt-2">
                Zaten üye misiniz?{' '}
                <button type="button" onClick={() => navigate('/login')} className="text-[var(--color-accent)] hover:underline transition-colors cursor-pointer">
                  Giriş Yapın
                </button>
              </p>
            </Reveal>
          </Stagger>
        </div>
      </section>

      <section className="hidden md:flex flex-1 relative p-4 items-center justify-center z-10">
        <Reveal variant="fadeIn" className="absolute inset-4 rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl bg-[#080808]">
          <div className="absolute inset-0 bg-cover bg-[center_top] transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: "url('/ecommerce-ai-agents.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] from-25% via-[#050505]/80 via-50% to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <Reveal variant="fadeUp">
              <h2 className="text-3xl lg:text-4xl font-display font-semibold text-white mb-4 leading-tight">
                Geleceğin E-Ticaretine<br />
                <span className="text-[#8B5CF6]">hemen katılın.</span>
              </h2>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                Platformumuza katılarak yapay zeka ajanlarımızla mağazanızın kontrolünü devralın ve büyümenizi izleyin.
              </p>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
