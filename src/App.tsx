import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import GlobalPulse from './pages/GlobalPulse';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreateCampaignPage from './pages/CreateCampaignPage'; // ✅ Correct component
import CampaignPage from './pages/CampaignPage'; // Optional, if you have a single campaign route

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateCampaignPage />} /> {/* ✅ FIXED */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/global-pulse" element={<GlobalPulse />} />
        <Route path="/campaign/:id" element={<CampaignPage />} /> {/* optional */}
      </Routes>
    </Router>
  );
}
