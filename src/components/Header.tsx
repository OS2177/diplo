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
