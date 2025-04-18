import GlobalPulse from './pages/GlobalPulse';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
// 👇 Use the newer campaign page
import CreateCampaignPage from './pages/CreateCampaignPage';
import ProfilePage from './pages/ProfilePage';

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
        <Route path="/global-pulse" element={<GlobalPulse />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* ✅ Updated path to point to the new page */}
        <Route path="/create" element={<CreateCampaignPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
