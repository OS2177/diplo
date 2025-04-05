
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { supabase } from '../lib/supabaseClient';

interface AuthButtonProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function AuthButton({ user, setUser }: AuthButtonProps) {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return user ? (
    <Button onClick={handleLogout} variant="outline">Logout</Button>
  ) : (
    <Button onClick={handleLogin}>Login with Google</Button>
  );
}
