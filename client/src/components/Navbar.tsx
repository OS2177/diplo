
import { User } from '@supabase/supabase-js';
import { Link } from 'wouter';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">Diplo</span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/create">
                <span className="cursor-pointer">Create Campaign</span>
              </Link>
              <Link href="/profile">
                <span className="cursor-pointer">Profile</span>
              </Link>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </>
          ) : (
            <Button onClick={handleLogin}>Login with Google</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
