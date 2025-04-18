import MyProfilePage from './pages/MyProfilePage'; // ✅ Add at the top
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import GlobalPulse from './pages/GlobalPulse';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreateCampaignPage from './pages/CreateCampaignPage'; // ✅ Correct component

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
<Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/global-pulse" element={<GlobalPulse />} />
      </Routes>
    </Router>
  );
}
