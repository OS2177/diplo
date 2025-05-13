
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';

const linkClasses =
'text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium';
const activeClasses = 'bg-gray-200 text-black';

export default function Header() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { state: { message: 'logout-success' } });
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-[#EEEDE5] shadow-md relative">
      <div className="flex items-center space-x-4">
        <img 
          src="/images/diplo_logo.png" 
          alt="Diplo Logo" 
          className="h-14" 
        />
        <a href="https://diplo.cargo.site/" target="_blank" rel="noopener noreferrer">
          <h1 className="text-4xl font-extrabold text-black">diplo</h1>
        </a>
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 hover:text-black"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="hidden lg:flex items-center space-x-6">
        <a
          href="https://diplo.cargo.site/"
          className={linkClasses}
        >
          Home
        </a>

        <NavLink
          to="/global-pulse"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ''}`
          }
        >
          Global Pulse
        </NavLink>
        <NavLink
          to="/create"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ''}`
          }
        >
          Create Campaign
        </NavLink>
        {user ? (
          <>
            <NavLink
              to="/profile"
              className={`${linkClasses} ${activeClasses} px-4 py-2`}
            >
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:bg-gray-100 px-4 py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ''}`
            }
          >
            Login
          </NavLink>
        )}
      </div>

      {menuOpen && (
        <div className="absolute left-0 top-20 w-full bg-[#EEEDE5] shadow-lg z-50 lg:hidden">
          <a
            href="https://diplo.cargo.site/"
            className={`${linkClasses} block px-4 py-2`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <NavLink
            to="/global-pulse"
            className={`${linkClasses} block px-4 py-2`}
            onClick={() => setMenuOpen(false)}
          >
            Global Pulse
          </NavLink>
          <NavLink
            to="/create"
            className={`${linkClasses} block px-4 py-2`}
            onClick={() => setMenuOpen(false)}
          >
            Create Campaign
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={`${linkClasses} block px-4 py-2`}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={`${linkClasses} block px-4 py-2`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
