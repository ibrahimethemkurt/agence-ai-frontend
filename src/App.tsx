import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Reveal } from './components/animation/Reveal';
import './styles/tokens.css';

import Grainient from './components/animation/GrainientBackground';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-[var(--color-fg)] font-body relative">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Grainient
          color1="#1d1c1c"
          color2="#1b1b3e"
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

// Placeholder sayfalar
const Dashboard = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Dashboard</h1></Reveal>;
const Analizler = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Analizler</h1></Reveal>;
const Raporlar = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Raporlar</h1></Reveal>;
const PazarAnalizi = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Pazar Analizi</h1></Reveal>;
const FiyatAnalizi = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Fiyat Analizi</h1></Reveal>;
const Ayarlar = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Ayarlar</h1></Reveal>;
const Yardim = () => <Reveal variant="fade"><h1 className="text-2xl font-display font-bold">Yardım</h1></Reveal>;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analizler" element={<Analizler />} />
          <Route path="raporlar" element={<Raporlar />} />
          <Route path="pazar-analizi" element={<PazarAnalizi />} />
          <Route path="fiyat-analizi" element={<FiyatAnalizi />} />
          <Route path="ayarlar" element={<Ayarlar />} />
          <Route path="yardim" element={<Yardim />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
