import { useNavigate, NavLink } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export default function HomePage() {
  const { user } = useUser();
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

      {/* Learn More Section */}
      <div className="max-w-2xl mx-auto p-6 text-center mt-20">
        {/* Diplo Logo and Name */}
        <div className="mb-6">
          <img 
            src="/images/diplo_logo.png" 
            alt="Diplo Logo" 
            className="h-14 mx-auto" 
          />
        </div>

        {/* Welcome Heading with Unbounded-Light font */}
        <h1
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: 'Unbounded-Light, sans-serif' }}
        >
          Welcome to Diplo
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          A new model for truth-based, public sentiment and collective diplomacy
        </p>

        {/* Conditional Call-to-Action Link */}
        {user ? (
          <NavLink
            to="/profile"
            className="text-blue-500 hover:text-blue-700"
          >
            Complete Profile to Create a Campaign
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="text-blue-500 hover:text-blue-700"
          >
            Sign In to Create a Campaign
          </NavLink>
        )}
      </div>
    </div>
  );
}
