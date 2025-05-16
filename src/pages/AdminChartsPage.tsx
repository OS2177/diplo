import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';

import VoteSplitChart from '../components/charts/VoteSplitChart';
import CampaignIntegrityChart from '../components/charts/CampaignIntegrityChart';
import ProximityReachChart from '../components/charts/ProximityReachChart'; // ✅ New chart

type Campaign = {
  id: string;
  title: string;
};

export default function AdminChartsPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !data?.is_admin) {
        console.error('Access denied or error:', error);
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [user, navigate]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title')
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      setCampaigns(data || []);
      if (data?.length > 0) {
        setSelectedCampaignId(data[0].id);
      }
    };

    if (isAdmin) fetchCampaigns();
  }, [isAdmin]);

  if (isAdmin === null) {
    return <div className="p-6 text-center">Checking admin access...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EEEDE5] p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Admin Charts (Phase 6)</h1>

      <div className="mb-6">
        <label htmlFor="campaign" className="block mb-2 text-lg font-medium">
          Select Campaign
        </label>
        <select
          id="campaign"
          value={selectedCampaignId || ''}
          onChange={(e) => setSelectedCampaignId(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        >
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCampaignId && (
        <>
          <div className="text-green-700 text-sm mb-4">
            Selected campaign ID: <code>{selectedCampaignId}</code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">🗳 Vote Split</h2>
              <VoteSplitChart campaignId={selectedCampaignId} />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">📈 Campaign Integrity</h2>
              <CampaignIntegrityChart campaignId={selectedCampaignId} />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">🌍 Proximity Reach</h2>
              <ProximityReachChart campaignId={selectedCampaignId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
