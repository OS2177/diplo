
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">Diplo</Link>
        <nav className="space-x-4">
          <Link to="/create" className="hover:text-blue-600">Create Campaign</Link>
          <Link to="/profile" className="hover:text-blue-600">Profile</Link>
        </nav>
      </div>
    </header>
  );
}
