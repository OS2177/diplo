import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEEDE5] px-[20px] py-12">
      <div
        onClick={() => navigate('/global-pulse')}
        className="cursor-pointer overflow-hidden pt-12"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-16">
          <img
            src="/images/square-1.png"
            alt="Pulse 1"
            className="w-full md:w-1/3 object-cover"
          />
          <img
            src="/images/square-2.png"
            alt="Pulse 2"
            className="w-full md:w-1/3 object-cover"
          />
          <img
            src="/images/square-3.gif"
            alt="Pulse 3"
            className="w-full md:w-1/3 object-cover"
          />
        </div>
      </div>

      <a
        href="https://diplo.cargo.site/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xl md:text-2xl font-bold tracking-wide"
        style={{ fontFamily: 'MD Nichrome Bold, sans-serif' }}
      >
        learn more about diplo
      </a>
    </div>
  );
}
