import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  const loginMessage = location.state?.message === 'login-to-create-campaign'
    ? 'Please log in to create a campaign.'
    : location.state?.message === 'login-to-view-profile'
    ? 'Please log in to view or edit your profile.'
    : location.state?.message === 'login-to-vote'
    ? 'Please log in to vote on a campaign.'
    : null;

  const loginWithGoogle = async () => {
    await supabase.auth.signOut(); // Clear Supabase session

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://diplo-jackvintage77.replit.app/profile',
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    });

    if (error) console.error('Login error:', error.message);
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
      <button
        onClick={loginWithGoogle}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center gap-2"
      >
        Sign in with Google
      </button>
    </div>
  );
}
