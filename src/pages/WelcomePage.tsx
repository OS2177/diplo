
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [showSecondBg, setShowSecondBg] = useState(false);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    setTimeout(() => setShowSecondBg(true), 1000);
  }, []);

  const bgImage1 = isMobile ? '/1290x2796_iphone_bg.jpg' : '/diplo_bg_fade.jpg';
  const bgImage2 = isMobile ? '/1290x2796_iphone_bg.jpg' : '/diplo_bg_2880x1800.jpg';

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <img 
        src={bgImage1}
        className="bg-image"
        style={{ opacity: showSecondBg ? 0 : 1 }}
        alt=""
      />
      <img 
        src={bgImage2}
        className="bg-image"
        style={{ opacity: showSecondBg ? 1 : 0 }}
        alt=""
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <img 
          src="/diplo_logo_collective.png"
          alt="Diplo"
          className="w-64 md:w-96 fade-in"
        />
        
        <button 
          onClick={() => navigate('/login')}
          className="mt-8 text-white text-xl hover:text-yellow-400 transition-colors fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          Click to Enter
        </button>
      </div>
    </div>
  );
}
