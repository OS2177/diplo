import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; // Import Footer component

import HomePage from './pages/HomePage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignPage from './pages/CampaignPage';
import ProfilePage from './pages/ProfilePage';
import GlobalPulse from './pages/GlobalPulse';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Ensure the full page height is used */}
      <Header />
      <main className="flex-grow"> {/* This allows the content to grow and push footer down */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateCampaignPage />} />
          <Route path="/campaign/:id" element={<CampaignPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/global-pulse" element={<GlobalPulse />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer /> {/* Footer will always be at the bottom */}
    </div>
  );
}
