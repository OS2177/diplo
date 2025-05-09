import { NavLink } from 'react-router-dom';

const linkClasses = 'text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium';

export default function Footer() {
  return (
    <footer className="bg-[#EEEDE5] py-6 mt-auto">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo and Name with Link */}
        <div className="mb-4">
          <a href="https://diplo.cargo.site/" target="_blank" rel="noopener noreferrer">
            <img 
              src="/images/diplo_logo.png" 
              alt="Diplo Logo" 
              className="h-14 mx-auto" 
            />
            <h1 className="text-2xl font-bold text-black mt-2">diplo</h1>
          </a>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <a
            href="https://diplo.cargo.site/"
            className={linkClasses}
          >
            Home
          </a>
          <NavLink
            to="/global-pulse"
            className={linkClasses}
          >
            Global Pulse
          </NavLink>
          <NavLink
            to="/create"
            className={linkClasses}
          >
            Create Campaign
          </NavLink>
          <NavLink
            to="/profile"
            className={linkClasses}
          >
            Profile
          </NavLink>
          <NavLink
            to="/login"
            className={linkClasses}
          >
            Login
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
