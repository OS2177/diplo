import { useChartVisibility } from '../context/ChartVisibilityContext'; // ✅ Fix missing import
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';

import VoteSplitChart from '../components/charts/VoteSplitChart';
import VoteMomentumChart from '../components/charts/VoteMomentumChart';
import CampaignIntegrityChart from '../components/charts/CampaignIntegrityChart';
import VoterIntegrityChart from '../components/charts/VoterIntegrityChart';
import ProximityReachChart from '../components/charts/ProximityReachChart';
import VoteMapChart from '../components/charts/VoteMapChart';
import VotePulseChart from '../components/charts/VotePulseChart';
import VoteImpactMatrix from '../components/charts/VoteImpactMatrix';
import VoterAgeDistributionChart from '../components/charts/VoterAgeDistributionChart';
import VoterGenderDistributionChart from '../components/charts/VoterGenderDistributionChart';
import VoteOriginMap from '../components/charts/VoteOriginMap';
import CampaignScopeGridChart from '../components/charts/CampaignScopeGridChart';
import CommunityIntegrityMap from '../components/charts/CommunityIntegrityMap';

import ChartSettingsDropdown from '../components/admin/ChartSettingsDropdown'; // ✅ NEW


type Campaign = {
  id: string;
  title: string;
};


export default function AdminChartsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { visibleCharts } = useChartVisibility();

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
      <h1 className="text-3xl font-bold mb-6">🌐 Admin Data Dashboard</h1>

<div className="mb-6">
  <ChartSettingsDropdown />
</div>

      <div className="mb-6 mt-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visibleCharts.includes('VoteSplitChart') && <VoteSplitChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('CampaignIntegrityChart') && <CampaignIntegrityChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('ProximityReachChart') && <ProximityReachChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoteMomentumChart') && <VoteMomentumChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VotePulseChart') && <VotePulseChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoteImpactMatrix') && <VoteImpactMatrix campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoterIntegrityChart') && <VoterIntegrityChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoterAgeDistributionChart') && <VoterAgeDistributionChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoterGenderDistributionChart') && <VoterGenderDistributionChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoteMapChart') && <VoteMapChart campaignId={selectedCampaignId} />}
          {visibleCharts.includes('VoteOriginMap') && <VoteOriginMap campaignId={selectedCampaignId} />}
          {visibleCharts.includes('CommunityIntegrityMap') && <CommunityIntegrityMap campaignId={selectedCampaignId} />}
        </div>
      )}

      {visibleCharts.includes('CampaignScopeGridChart') && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">📡 Global Scope Overview</h2>
          <CampaignScopeGridChart />
        </div>
      )}
    </div>
  );
}
