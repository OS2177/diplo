
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AuthPanelProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function AuthPanel({ user, setUser }: AuthPanelProps) {
  const [email, setEmail] = useState('');

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleEmailLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (!error) {
      alert('Check your email for the login link!');
      setEmail('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex justify-end p-4">
        <Button onClick={handleLogout} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Button onClick={handleGoogleLogin} variant="default">
        Sign in with Google
      </Button>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleEmailLogin} variant="outline">
          Send Magic Link
        </Button>
      </div>
    </div>
  );
}
