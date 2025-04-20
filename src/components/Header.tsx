// src/components/Header.tsx
import { NavLink } from 'react-router-dom';

export default function Header() {
  const linkClasses =
    'px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-800 hover:text-white';
  const activeClasses = 'bg-gray-900 text-white';

  return (
    <header className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo / Title */}
        <NavLink to="/" className="text-2xl font-bold text-white">
          Diplo
        </NavLink>

        {/* Nav Links */}
        <nav className="flex space-x-4">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ''}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ''}`
            }
          >
            Create Campaign
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ''}`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/global-pulse"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ''}`
            }
          >
            Global Pulse
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
