import { NavLink } from 'react-router-dom';

const linkClasses = 'text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium';
const activeClasses = 'bg-gray-200 text-black';

function Header() {
  return (
    <nav className="flex space-x-4 p-4 bg-white shadow">
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
  );
}

export default Header;
