import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import GlobalPulse from './pages/GlobalPulse';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignPage from './pages/CampaignPage';
import { Navigate } from 'react-router-dom';


export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get session on load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateCampaignPage />} />
            <Route path="/global-pulse" element={<GlobalPulse />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/campaign/:id" element={<CampaignPage />} />
            <Route path="/home" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
