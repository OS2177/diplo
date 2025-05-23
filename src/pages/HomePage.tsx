import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEEDE5] p-6">
      {/* Pulse Preview Image Row Only */}
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
