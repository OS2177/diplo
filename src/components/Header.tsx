import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-black text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-6 text-lg font-medium">
          <Link to="/">Home</Link>
          <Link to="/create">Create Campaign</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/global-pulse">Global Pulse</Link>
        </nav>
      </div>
    </header>
  );
}

