
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Reveal } from './components/animation/Reveal';
import './styles/tokens.css';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] font-body">
      <Sidebar />
      <div className="flex flex-col ml-[240px] min-h-screen">
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
