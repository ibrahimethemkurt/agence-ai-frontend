import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import Grainient from './components/animation/GrainientBackground';
import { NotificationsContext } from './hooks/useNotifications';
import { InsightsProvider } from './hooks/useInsights';
import { AIAssistantSidebar } from './components/layout/AIAssistantSidebar';

import { DashboardPage } from './pages/DashboardPage';
import { FinansPage } from './pages/FinansPage';
import { AnalizlerPage } from './pages/AnalizlerPage';
import { SatisOncesiPage } from './pages/SatisOncesiPage';
import { SatisSureciPage } from './pages/SatisSureciPage';
import { SatisSonrasiPage } from './pages/SatisSonrasiPage';
import { SatistaOlanUrunlerPage } from './pages/SatistaOlanUrunlerPage';
import { AyarlarPage } from './pages/AyarlarPage';
import { YardimPage } from './pages/YardimPage';
import { SignInPage } from './components/sign-in';
import { RegisterPage } from './components/register';
import { LandingPage } from './pages/LandingPage';

import './styles/tokens.css';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsAIAssistantOpen(true);
    window.addEventListener('open-ai-assistant', handler);
    return () => window.removeEventListener('open-ai-assistant', handler);
  }, []);

  return (
    <div className="min-h-screen text-[var(--color-fg)] font-body relative">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Grainient
          color1="#05031a"
          color2="#0f0634"
          color3="#1f0b32"
          timeSpeed={0.9}
          colorBalance={-0.13}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={3.5}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.4}
          gamma={0.75}
          saturation={0.75}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'}`}>
        <TopBar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} toggleAIAssistant={() => setIsAIAssistantOpen(true)} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      <AIAssistantSidebar isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />
    </div>
  );
};

import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <ToastProvider>
      <InsightsProvider>
        <NotificationsContext.Provider value={{ notifications: [], isConnected: true }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<SignInPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/finans" element={<FinansPage />} />
                <Route path="/analizler" element={<AnalizlerPage />} />
                <Route path="/satista-olan-urunler" element={<SatistaOlanUrunlerPage />} />
                <Route path="/ajanlar">
                  <Route path="satis-oncesi" element={<SatisOncesiPage />} />
                  <Route path="satis-sureci" element={<SatisSureciPage />} />
                  <Route path="satis-sonrasi" element={<SatisSonrasiPage />} />
                </Route>
                <Route path="/ayarlar" element={<AyarlarPage />} />
                <Route path="/yardim" element={<YardimPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationsContext.Provider>
      </InsightsProvider>
    </ToastProvider>
  );
};

export default App;
