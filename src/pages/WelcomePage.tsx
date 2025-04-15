import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const bgImage = isMobile
    ? '/1290x2796_iphone_bg.jpg'
    : '/diplo_bg_2880x1800.jpg';

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <img
        src="/diplo_logo_collective.png"
        alt="Diplo Logo"
        className="w-64 mb-6"
      />
      <button
        onClick={() => navigate('/home')}
        className="text-white underline text-lg hover:text-gray-300"
      >
        Click to Enter
      </button>
    </div>
  );
}