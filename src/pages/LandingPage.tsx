import { useNavigate } from 'react-router-dom';
import { Reveal } from '../components/animation/Reveal';
import { BorderBeam } from '../components/ui/border-beam';
import Spline from '@splinetool/react-spline';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body relative overflow-x-hidden selection:bg-gray-900 selection:text-white">

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/pazaralogo-dark.svg" alt="Pazara" className="h-9 w-auto" />
        </div>
        
        {/* Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-600">
          <a href="#ozellikler" className="hover:text-[#9333ff] transition-colors">Özellikler</a>
          <a href="#cozumler" className="hover:text-[#9333ff] transition-colors">Çözümler</a>
          <a href="#sss" className="hover:text-[#9333ff] transition-colors">SSS</a>
          <a href="#destek" className="hover:text-[#9333ff] transition-colors">Destek</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-600 hover:text-[#9333ff] transition-colors">
            Giriş Yap
          </button>
          <div className="relative rounded-full">
            <button onClick={() => navigate('/register')} className="relative z-10 bg-[#9333ff] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#7b22df] transition-colors shadow-md">
              Hesap Oluştur
            </button>
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <BorderBeam size={60} duration={4} borderWidth={3} colorFrom="#3b0764" colorTo="#c084fc" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 w-full h-[calc(100vh-100px)] flex items-center justify-end px-4 overflow-hidden">
        {/* We make the wrapper wider than the screen and shift it left. 
            This keeps the robot perfectly centered, but pushes the bottom-right logo completely off the screen! */}
        <Reveal variant="fadeUp" className="absolute top-0 left-[-300px] w-[calc(100%+600px)] h-full cursor-grab active:cursor-grabbing">
          <Spline scene="https://prod.spline.design/K-fd31LMtV67Aidp/scene.splinecode" />
        </Reveal>
      </main>

    </div>
  );
};
