import { useEffect, useState } from 'react';
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
    <nav className="flex items-center justify-between px-8 py-4 bg-[#EEEDE5] shadow-md relative">
      {/* Left side: Logo + diplo + tagline */}
      <div className="flex items-center gap-4">
        <img src="/images/diplo_logo.png" alt="Diplo Logo" className="h-10 w-10" />
        <div>
          <h1 className="text-3xl font-black leading-none">diplo</h1>
          <p className="text-sm text-pink-500 font-semibold -mt-1">collective diplomacy</p>
        </div>
      </div>

      {/* Right side nav links (desktop) */}
      <div className="hidden lg:flex items-center space-x-6">
        <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
          Home
        </NavLink>

        <NavLink to="/global-pulse" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
          Global Pulse
        </NavLink>

        <NavLink to="/create" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
          Create Campaign
        </NavLink>

        {isAdmin && (
          <>
            <NavLink to="/admin-campaigns" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
              Admin
            </NavLink>
            <NavLink to="/admin-charts" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
              Admin Charts
            </NavLink>
          </>
        )}

        {user ? (
          <>
            <NavLink to="/profile" className={`${linkClasses} px-4 py-2 rounded-md bg-gray-100`}>
              Profile
            </NavLink>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>
            Login
          </NavLink>
        )}
      </div>

      {/* Mobile menu icon */}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute left-0 top-20 w-full bg-[#EEEDE5] shadow-lg z-50 lg:hidden">
          <NavLink to="/" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/global-pulse" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
            Global Pulse
          </NavLink>

          <NavLink to="/create" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
            Create Campaign
          </NavLink>

          {isAdmin && (
            <>
              <NavLink to="/admin-campaigns" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
                Admin
              </NavLink>
              <NavLink to="/admin-charts" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
                Admin Charts
              </NavLink>
            </>
          )}

          {user ? (
            <>
              <NavLink to="/profile" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}