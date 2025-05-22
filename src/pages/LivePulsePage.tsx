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

import { CHART_DESCRIPTIONS } from '../constants/ChartDescriptions';

export default function LivePulsePage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const [campaignTitle, setCampaignTitle] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('title')
        .eq('id', campaignId)
        .single();
      if (data) setCampaignTitle(data.title);
    };
    if (campaignId) fetchCampaign();
  }, [campaignId]);

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">{campaignTitle}</h1>
        <p className="text-lg text-gray-400">Live Campaign Pulse Overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          { Chart: VoteSplitChart, key: 'voteSplit' },
          { Chart: VoteMomentumChart, key: 'voteMomentum' },
          { Chart: CampaignIntegrityChart, key: 'campaignIntegrity' },
          { Chart: VoterIntegrityChart, key: 'voterIntegrity' },
          { Chart: ProximityReachChart, key: 'proximityReach' },
          { Chart: VoteMapChart, key: 'voteMap' },
          { Chart: VotePulseChart, key: 'votePulse' },
          { Chart: VoteImpactMatrix, key: 'voteImpactMatrix' },
          { Chart: VoterAgeDistributionChart, key: 'voterAgeDistribution' },
          { Chart: VoterGenderDistributionChart, key: 'voterGender' },
          { Chart: VoteOriginMap, key: 'voteOriginMap' },
          { Chart: CampaignScopeGridChart, key: 'campaignScope' },
          { Chart: CommunityIntegrityMap, key: 'communityIntegrityMap' },
        ].map(({ Chart, key }) => (
          <div key={key} className="bg-gray-900 rounded-2xl p-4 shadow-xl">
            <h2 className="text-xl font-semibold mb-1">
              {chartDescriptions[key]?.title || key}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              {chartDescriptions[key]?.subtitle}
            </p>
            <Chart campaignId={campaignId!} />
          </div>
        ))}

      </div>
    </div>
  );
}
