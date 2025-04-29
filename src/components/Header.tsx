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
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow relative">
      {/* Left Nav */}
      <div className="flex space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClasses} ${isActive ? activeClasses : ''}`
          }
        >
          Home
        </NavLink>
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
        
      </div>

      {/* Right: Profile or Login */}
      <div className="relative">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-black"
            >
              <span>Profile</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
    </nav>
  );
}
