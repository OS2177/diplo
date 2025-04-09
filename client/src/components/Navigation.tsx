
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import AuthButton from "./AuthButton";

interface NavigationProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Navigation({ user, setUser }: NavigationProps) {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-neutral-900">
              Diplo
            </Link>
            <nav className="ml-10 flex items-center gap-4">
              <Link to="/" className="text-neutral-600 hover:text-neutral-900">
                Home
              </Link>
              <Link to="/campaigns" className="text-neutral-600 hover:text-neutral-900">
                Campaigns
              </Link>
              {user && (
                <Link to="/create" className="text-neutral-600 hover:text-neutral-900">
                  Create Campaign
                </Link>
              )}
              {user && (
                <Link to="/profile" className="text-neutral-600 hover:text-neutral-900">
                  Profile
                </Link>
              )}
            </nav>
          </div>
          <div>
            <AuthButton user={user} setUser={setUser} />
          </div>
        </div>
      </div>
    </header>
  );
}
