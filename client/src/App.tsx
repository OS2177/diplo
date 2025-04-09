import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import AuthPanel from './components/AuthPanel';
import NewCampaignForm from './components/NewCampaignForm';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 p-4">
        <nav className="flex gap-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <Link to="/create" className="text-blue-600 hover:text-blue-800">Create Campaign</Link>
        </nav>
      </header>

      <main className="p-8">
        <AuthPanel user={user} setUser={setUser} />

        <div className="mt-8">
          <Routes>
            <Route path="/" element={<p>Welcome to Diplo</p>} />
            <Route path="/create" element={<NewCampaignForm user={user} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;