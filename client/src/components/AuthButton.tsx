
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { supabase } from '../lib/supabaseClient';
import { useToast } from "@/hooks/use-toast";

interface AuthButtonProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function AuthButton({ user, setUser }: AuthButtonProps) {
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return user ? (
    <Button onClick={handleLogout} variant="outline" className="whitespace-nowrap">
      Sign Out
    </Button>
  ) : (
    <Button onClick={handleLogin} variant="default" className="whitespace-nowrap">
      Sign in with Google
    </Button>
  );
}
