import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import Grainient from './components/animation/GrainientBackground';
import { NotificationsContext } from './hooks/useNotifications';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { DashboardPage } from './pages/DashboardPage';
import { FinansPage } from './pages/FinansPage';
import { AnalizlerPage } from './pages/AnalizlerPage';
import { SatisOncesiPage } from './pages/SatisOncesiPage';
import { SatisSureciPage } from './pages/SatisSureciPage';
import { SatisSonrasiPage } from './pages/SatisSonrasiPage';
import { AyarlarPage } from './pages/AyarlarPage';
import { SignInPage } from './components/sign-in';
import { RegisterPage } from './components/register';

import './styles/tokens.css';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-[var(--color-fg)] font-body relative">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Grainient
          color1="#0F1A2E"
          color2="#1E3A5F"
          color3="#120e1d"
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

      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]'}`}>
        <TopBar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationsContext.Provider value={{ notifications: [], isConnected: true }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<SignInPage onCreateAccount={() => window.location.href = '/register'} />} />
            <Route path="/register" element={<RegisterPage onSignInClick={() => window.location.href = '/login'} />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="finans" element={<FinansPage />} />
                <Route path="analizler" element={<AnalizlerPage />} />
                <Route path="ajanlar">
                  <Route path="satis-oncesi" element={<SatisOncesiPage />} />
                  <Route path="satis-sureci" element={<SatisSureciPage />} />
                  <Route path="satis-sonrasi" element={<SatisSonrasiPage />} />
                </Route>
                <Route path="ayarlar" element={<AyarlarPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationsContext.Provider>
    </AuthProvider>
  );
};

export default App;
