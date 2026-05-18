import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { Reveal } from './animation/Reveal';
import { Stagger } from './animation/Stagger';
import Grainient from './animation/GrainientBackground';
import { Radio } from './radio';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        setError(err.message || 'Google girişi başarısız.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google ile giriş yapılamadı.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await api.login(email, password);
      setSuccessRedirect(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      const errMsg = err.message || 'Giriş başarısız. Email veya şifrenizi kontrol edin.';
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

      <section className="flex-1 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md">
          <Stagger className="flex flex-col gap-6" staggerDelay={0.25}>
            <Reveal variant="fadeUp" className="mb-4">
              <img src="/pazaralogo.svg" alt="Pazara" className="h-14 w-auto" />
            </Reveal>
            <Reveal variant="fadeUp">
              <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight text-[var(--color-fg)]">
                <span className="font-light text-[var(--color-fg)] tracking-tighter">Hoş Geldiniz!</span>
              </h1>
            </Reveal>
            <Reveal variant="fadeUp">
              <p className="text-[var(--color-muted)]">Giriş yapın ve yolculuğunuza devam edin</p>
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Reveal variant="fadeUp">
                <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Email Adresiniz</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email adresinizi girin"
                    required
                    className="w-full bg-transparent text-[var(--color-fg)] text-sm p-4 rounded-2xl focus:outline-none"
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
                <label className="text-sm font-medium text-[var(--color-muted)] mb-2 block">Şifreniz</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi girin"
                      required
                      className="w-full bg-transparent text-[var(--color-fg)] text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.currentTarget.closest('form')?.requestSubmit();
                        }
                      }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                      {showPassword
                        ? <EyeOff className="w-5 h-5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors" />
                        : <Eye className="w-5 h-5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </Reveal>

              <Reveal variant="fadeUp">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                    <div className="pointer-events-none"><Radio checked={rememberMe} /></div>
                    <span className="text-[var(--color-fg)]/90 select-none">Beni hatırla</span>
                  </div>
                </div>
              </Reveal>

              {successRedirect && (
                <Reveal variant="fadeUp">
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-emerald-400 shrink-0" />
                      <p className="text-sm font-semibold text-white/90">Giriş Başarılı! Yönlendiriliyorsunuz...</p>
                    </div>
                  </div>
                </Reveal>
              )}

              <Reveal variant="fadeUp">
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || successRedirect}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#EBEBEB] py-4 font-medium text-black hover:bg-white transition-all duration-300 disabled:opacity-90 disabled:cursor-not-allowed relative overflow-hidden cursor-pointer"
                  >
                    {successRedirect ? (
                      <span className="text-emerald-700 font-semibold animate-pulse">Başarıyla Giriş Yapıldı!</span>
                    ) : loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Giriş yapılıyor...</>
                    ) : (
                      'Giriş Yap'
                    )}

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
                    className="flex-none flex items-center justify-center w-[56px] border border-white/10 bg-[#0A0A0A] text-white rounded-2xl hover:bg-[#1A1A1A] transition-colors cursor-pointer" 
                    title="Google ile Giriş Yap"
                  >
                    <GoogleIcon />
                  </button>
                </div>
              </Reveal>
            </form>

            <Reveal variant="fadeUp">
              <p className="text-center text-sm text-[var(--color-muted)]">
                Henüz üye değil misiniz?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-[var(--color-accent)] hover:underline transition-colors cursor-pointer"
                >
                  Hesap Oluşturun
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
                E-Ticaret AI Ajan ekibiniz<br />
                <span className="text-[#8B5CF6]">çalışmak için sizi bekliyor.</span>
              </h2>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                Sisteme giriş yapın ve mağazanızın büyümesini tamamen otonom yapay zeka gücüne bırakın.
              </p>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </div>
  );
};