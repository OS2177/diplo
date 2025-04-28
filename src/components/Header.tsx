import { NavLink } from 'react-router-dom';

const linkClasses = 'text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium';
const activeClasses = 'bg-gray-200 text-black';

export default function Header() {
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

        <NavLink
          to="/login"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeClasses : ''}`}
        >
