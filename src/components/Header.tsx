import { useEffect, useRef, useState } from 'react';
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
  const mobileMenuRef = useRef(null);

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

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (mobileMenuRef.current && !(mobileMenuRef.current as HTMLElement).contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener('scroll', () => setMenuOpen(false));
      document.addEventListener('click', handleClose);
    }
    return () => {
      window.removeEventListener('scroll', () => setMenuOpen(false));
      document.removeEventListener('click', handleClose);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { state: { message: 'logout-success' } });
  };

  return (
    <header className="bg-[#EEEDE5] px-[3vw] pt-6 pb-2">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-start">
          <a href="https://diplo.cargo.site/" className="flex items-center gap-4">
            <img src="/images/diplo_logo.png" alt="Diplo Logo" className="h-14 w-14" />
            <h1 className="text-5xl font-extrabold text-black leading-none">diplo</h1>
          </a>
          <p className="text-[#F69BE4] font-bold text-lg mt-2">collective diplomacy</p>
        </div>

        <div className="lg:hidden mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing immediately
              setMenuOpen(!menuOpen);
            }}
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

        <nav className="hidden lg:flex items-center space-x-6 pt-2">
          <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>Home</NavLink>
          <NavLink to="/global-pulse" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>Global Pulse</NavLink>
          <NavLink to="/create" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>Create Campaign</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin-campaigns" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>Admin</NavLink>
              <NavLink to="/admin-charts" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>Admin Charts</NavLink>
            </>
          )}
          {user ? (
            <>
              <NavLink to="/profile" className={`${linkClasses} px-4 py-2 rounded-md bg-gray-100`}>Profile</NavLink>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}>Login</NavLink>
          )}
        </nav>
      </div>

      <hr className="border-black mt-3 mb-2" />

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div ref={mobileMenuRef} className="absolute left-0 top-20 w-full bg-[#EEEDE5] shadow-lg z-50 lg:hidden">
          <div className="flex justify-end px-4 py-2">
            <button onClick={() => setMenuOpen(false)} className="text-black text-2xl">
              &times;
            </button>
          </div>

          <NavLink to="/" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/global-pulse" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Global Pulse</NavLink>
          <NavLink to="/create" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Create Campaign</NavLink>

          {isAdmin && (
            <>
              <NavLink to="/admin-campaigns" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Admin</NavLink>
              <NavLink to="/admin-charts" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Admin Charts</NavLink>
            </>
          )}

          {user ? (
            <>
              <NavLink to="/profile" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-800">Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={`${linkClasses} block px-4 py-2`} onClick={() => setMenuOpen(false)}>Login</NavLink>
          )}
        </div>
      )}
    </header>
  );
}
