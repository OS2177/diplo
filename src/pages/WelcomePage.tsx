
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [showSecondImage, setShowSecondImage] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const bgImage1 = isMobile ? '/1290x2796_iphone_bg.jpg' : '/diplo_bg_fade.jpg';
  const bgImage2 = isMobile ? '/1290x2796_iphone_bg.jpg' : '/diplo_bg_2880x1800.jpg';

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSecondImage(true);
    }, 1200); // Delay fade effect

    return () => clearTimeout(timeout);
  }, []);

  const handleEnter = () => {
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src={bgImage1}
        className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
          showSecondImage ? 'opacity-0' : 'opacity-100'
        }`}
        alt="Background Fade"
      />
      <img
        src={bgImage2}
        className="absolute w-full h-full object-cover transition-opacity duration-1000 opacity-100"
        alt="Background"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <img
          src="/diplo_logo_collective.png"
          alt="Diplo Logo"
          className="w-64 mb-6 fade-in"
        />
        <button
          onClick={handleEnter}
          className="text-lg underline hover:text-gray-300 transition fade-in delay-500"
        >
          Click to Enter
        </button>
      </div>
    </div>
  );
}
