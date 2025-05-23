import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';

const linkClasses =
  'text-gray-600 hover:text-black px-3 py-2 rounded-md text-base font-medium';
const activeClasses = 'bg-gray-200 text-black';

export default function Header() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!error && data?.is_admin) {
        setIsAdmin(true);
      }
    };

    fetchAdminStatus();
  }, [user]);

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
  <h1 className="text-4xl font-extrabold text-black flex items-baseline">
    diplo
    <span className="ml-2 text-sm text-gray-600" style={{ fontFamily: 'MD Nichrome Light, sans-serif' }}>
      beta
    </span>
  </h1>
</a>

      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 hover:text-black"
        >
          {menuOpen ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
          )}
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

        {isAdmin && (
          <>
            <NavLink
              to="/admin-campaigns"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : ''}`
              }
            >
              Admin
            </NavLink>
            <NavLink
              to="/admin-charts"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : ''}`
              }
            >
              Admin Charts
            </NavLink>
          </>
        )}

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
        <div className="fixed inset-0 z-50 bg-[#EEEDE5] flex flex-col items-center justify-center space-y-6 text-center lg:hidden">
          <a
            href="https://diplo.cargo.site/"
            className={`${linkClasses} text-xl`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <NavLink
            to="/global-pulse"
            className={`${linkClasses} text-xl`}
            onClick={() => setMenuOpen(false)}
          >
            Global Pulse
          </NavLink>
          <NavLink
            to="/create"
            className={`${linkClasses} text-xl`}
            onClick={() => setMenuOpen(false)}
          >
            Create Campaign
          </NavLink>

          {isAdmin && (
            <>
              <NavLink
                to="/admin-campaigns"
                className={`${linkClasses} text-xl`}
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </NavLink>
              <NavLink
                to="/admin-charts"
                className={`${linkClasses} text-xl`}
                onClick={() => setMenuOpen(false)}
              >
                Admin Charts
              </NavLink>
            </>
          )}

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={`${linkClasses} text-xl`}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-xl text-red-600 hover:bg-gray-100 px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={`${linkClasses} text-xl`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}

          <button
            onClick={() => setMenuOpen(false)}
            className="text-xl text-gray-500 hover:text-black"
            style={{ fontFamily: 'MD Nichrome Bold, sans-serif' }}
          >
            X
          </button>
        </div>
      )}
    </nav>
  );
}
