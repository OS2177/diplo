import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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

export default function LivePulsePage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const [campaignTitle, setCampaignTitle] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      const { data } = await supabase
        .from('campaigns')
        .select('title')
        .eq('id', campaignId)
        .single();

      if (data) setCampaignTitle(data.title);
    };

    if (campaignId) fetchCampaign();
  }, [campaignId]);

  return (
    <div className="min-h-screen bg-[#EEEDE5] p-6">
      <h1 className="text-3xl font-bold mb-6">📊 {campaignTitle}</h1>

      {campaignId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VoteSplitChart campaignId={campaignId} />
          <CampaignIntegrityChart campaignId={campaignId} />
          <ProximityReachChart campaignId={campaignId} />
          <VoteMomentumChart campaignId={campaignId} />
          <VotePulseChart campaignId={campaignId} />
          <VoteImpactMatrix campaignId={campaignId} />
          <VoterIntegrityChart campaignId={campaignId} />
          <VoterAgeDistributionChart campaignId={campaignId} />
          <VoterGenderDistributionChart campaignId={campaignId} />
          <VoteMapChart campaignId={campaignId} />
          <VoteOriginMap campaignId={campaignId} />
          <CommunityIntegrityMap campaignId={campaignId} />
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">📡 Global Scope Overview</h2>
        <CampaignScopeGridChart />
      </div>
    </div>
  );
}
