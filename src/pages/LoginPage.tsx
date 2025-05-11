import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Redirect to the main page if already logged in
        navigate('https://diplo.cargo.site/');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  const loginMessage =
    location.state?.message === 'login-to-create-campaign'
      ? 'Please log in to create a campaign.'
      : location.state?.message === 'login-to-view-profile'
      ? 'Please log in to view or edit your profile.'
      : location.state?.message === 'login-to-vote'
      ? 'Please log in to vote on a campaign.'
      : null;

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Login error:', error.message);
    else {
      // Redirect to the main page after login
      navigate('https://diplo.cargo.site/');
    }
  };

  const loginWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('Login error:', error.message);
    else {
      navigate('https://diplo.cargo.site/');
    }
  };

  const loginWithX = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'twitter' });
    if (error) console.error('Login error:', error.message);
    else {
      navigate('https://diplo.cargo.site/');
    }
  };

  const loginWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
    if (error) console.error('Login error:', error.message);
    else {
      navigate('https://diplo.cargo.site/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Login to Diplo</h1>
      {loginMessage && <div className="text-red-600 mb-4">{loginMessage}</div>}

      {/* Sign-In Options */}
      <button
        onClick={loginWithGoogle}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center gap-2 mb-2"
      >
        Sign in with Google
      </button>

      <button
        onClick={loginWithGitHub}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center gap-2 mb-2"
      >
        Sign in with GitHub
      </button>

      <button
        onClick={loginWithX}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center gap-2 mb-2"
      >
        Sign in with X
      </button>

      <button
        onClick={loginWithApple}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center gap-2"
      >
        Sign in with Apple
      </button>
    </div>
  );
}
