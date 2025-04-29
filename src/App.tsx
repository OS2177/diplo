import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';

import HomePage from './pages/HomePage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignPage from './pages/CampaignPage';
import ProfilePage from './pages/ProfilePage';
import GlobalPulse from './pages/GlobalPulse';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateCampaignPage />} />
        <Route path="/campaign/:id" element={<CampaignPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/global-pulse" element={<GlobalPulse />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}
