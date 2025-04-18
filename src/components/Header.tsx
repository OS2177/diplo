import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-black text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-6 text-lg font-medium">
          <Link to="/">Home</Link>
          <Link to="/global-pulse">Global Pulse</Link>
          <Link to="/create">Create Campaign</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/my-profile">My Profile</Link>
          
        </nav>

        {/* ✅ Tailwind test block */}
        <div className="mt-4 bg-pink-500 text-white p-4 text-xl font-bold rounded">
          TAILWIND IS WORKING 🎉
        </div>
      </div>
    </header>
  );
}

