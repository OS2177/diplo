import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const linkClasses =
  'text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-[#EEEDE5] shadow-md relative">
      {/* Left Side: Logo */}
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

      {/* Right Side: Index Link */}
      <div className="flex items-center space-x-6 lg:flex">
        {/* Only the Index Link */}
        <a
          href="https://diplo.cargo.site/nav"
          className={`${linkClasses} text-white bg-[#F69BE4] hover:bg-[#F69BE4] px-4 py-2 rounded-md text-sm font-medium`}
        >
          index
        </a>
      </div>

      {/* Mobile Menu (Pop-up menu when Hamburger is clicked) */}
      {menuOpen && (
        <div className="lg:hidden absolute left-0 top-20 w-full bg-[#EEEDE5] shadow-lg z-50">
          <a
            href="https://diplo.cargo.site/nav"
            className={`${linkClasses} block px-4 py-2`}
            onClick={() => setMenuOpen(false)}
          >
            Index
          </a>
        </div>
      )}
    </nav>
  );
}
