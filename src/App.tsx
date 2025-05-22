import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignPage from './pages/CampaignPage';
import ProfilePage from './pages/ProfilePage';
import GlobalPulse from './pages/GlobalPulse';
import LoginPage from './pages/LoginPage';
import AdminCampaignsPage from './pages/AdminCampaignsPage';
import AdminChartsPage from './pages/AdminChartsPage';

import { ChartVisibilityProvider } from './context/ChartVisibilityContext'; // ✅ New

import 'leaflet/dist/leaflet.css';

export default function App() {
  return (
    <ChartVisibilityProvider> {/* ✅ Wrap app with context */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateCampaignPage />} />
            <Route path="/campaign/:id" element={<CampaignPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/global-pulse" element={<GlobalPulse />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-campaigns" element={<AdminCampaignsPage />} />
            <Route path="/admin-charts" element={<AdminChartsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ChartVisibilityProvider>
  );
}
