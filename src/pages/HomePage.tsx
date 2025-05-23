import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEEDE5] p-6">
      {/* Logo and Tagline */}
      <div className="mb-4 text-center">
        <img
          src="/images/diplo_logo.png"
          alt="Diplo Logo"
          className="h-16 mx-auto"
        />
        <h1 className="text-4xl font-black mt-2">diplo</h1>
        <p className="text-pink-500 text-lg font-semibold mt-1">collective diplomacy</p>
        <div className="border-t border-black mt-4 mb-8 w-full" />
      </div>

      {/* 3 Preview Images */}
      <div
        className="cursor-pointer border rounded overflow-hidden hover:shadow-md transition-shadow bg-white"
        onClick={() => navigate('/global-pulse')}
      >
        <div className="flex">
          <img
            src="/images/square-1.png"
            alt="Pulse 1"
            className="w-1/3 h-auto object-cover"
          />
          <img
            src="/images/square-2.png"
            alt="Pulse 2"
            className="w-1/3 h-auto object-cover"
          />
          <img
            src="/images/square-3.gif"
            alt="Pulse 3"
            className="w-1/3 h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
