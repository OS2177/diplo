import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser'; // ✅ Add this

const linkClasses = 'text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium';
const activeClasses = 'bg-gray-200 text-black';

export default function Header() {
  const { user } = useUser(); // ✅ Get user from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { state: { message: 'logout-success' } });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="flex space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
        >
          Create Campaign
        </NavLink>

        <NavLink
          to="/global-pulse"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
        >
          Global Pulse
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
        >
          Profile
        </NavLink>
      </div>

      {/* ✅ Logout button shown if logged in */}
      {user && (
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
