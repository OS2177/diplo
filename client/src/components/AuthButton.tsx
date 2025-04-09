
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

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'https://diplo-jackvintage77.replit.app',
          queryParams: {
            prompt: 'select_account'
          }
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

  const handleEmailLogin = async () => {
    try {
      const email = prompt("Please enter your email:");
      if (!email) return;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We sent you a login link",
      });
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
    <div className="flex gap-2">
      <Button onClick={() => handleOAuthLogin('google')} variant="default" className="whitespace-nowrap">
        Google
      </Button>
      <Button onClick={() => handleOAuthLogin('apple')} variant="default" className="whitespace-nowrap">
        Apple
      </Button>
      <Button onClick={handleEmailLogin} variant="default" className="whitespace-nowrap">
        Email
      </Button>
    </div>
  );
}
