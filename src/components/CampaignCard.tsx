import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { calculateUserIntegrity, calculateProximity } from '../utils/integrity';
import { useChartVisibility } from '../context/ChartVisibilityContext';

// Chart components
import VoteSplitChart from './charts/VoteSplitChart';
import CampaignIntegrityChart from './charts/CampaignIntegrityChart';
import ProximityReachChart from './charts/ProximityReachChart';
import VoteMomentumChart from './charts/VoteMomentumChart';
import VotePulseChart from './charts/VotePulseChart';
import VoteImpactMatrix from './charts/VoteImpactMatrix';
import VoterIntegrityChart from './charts/VoterIntegrityChart';
import VoterAgeDistributionChart from './charts/VoterAgeDistributionChart';
import VoterGenderDistributionChart from './charts/VoterGenderDistributionChart';
import VoteMapChart from './charts/VoteMapChart';
import VoteOriginMap from './charts/VoteOriginMap';

type Campaign = {
  id: string;
  title: string;
  description: string;
  scope?: string;
  image?: string;
  url?: string;
  created_at?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  campaign_latitude?: number;
  campaign_longitude?: number;
  creator_integrity?: number;
  campaign_integrity?: number;
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [voted, setVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState('');
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [voteImpact, setVoteImpact] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState<number | null>(null);

  const { visibleCharts } = useChartVisibility();

  useEffect(() => {
    checkIfUserVoted();
    fetchVoteCount();
  }, []);

  const checkIfUserVoted = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const { data: vote } = await supabase
      .from('votes')
      .select('choice, impact')
      .eq('user_id', user.id)
      .eq('campaign_id', campaign.id)
      .maybeSingle();

    if (vote) {
      setVoteChoice(vote.choice);
      setVoteImpact(vote.impact);
      setVoted(true);
    }
  };

  const fetchVoteCount = async () => {
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaign.id);

    if (count !== null) setVoteCount(count);
  };

  const updateCampaignIntegrity = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('integrity')
      .eq('campaign_id', campaign.id);

    if (!votes || votes.length === 0) return;

    const avg_vote_integrity = votes.reduce((sum, v) => sum + (v.integrity || 0), 0) / votes.length;
    const vote_count_score = Math.min(votes.length / 20, 1.0);
    const creator_integrity = campaign.creator_integrity || 0;

    const campaign_integrity = parseFloat(
      (
        0.5 * creator_integrity +
        0.3 * avg_vote_integrity +
        0.2 * vote_count_score
      ).toFixed(4)
    );

    await supabase
      .from('campaigns')
      .update({ campaign_integrity })
      .eq('id', campaign.id);
  };

  const castVote = async (choice: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert('Please log in to vote.');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return alert('Profile not found.');

    if (!navigator.geolocation) {
      setVoteError('Geolocation not supported in your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;

        const integrity = calculateUserIntegrity(profile);
        const proximity = campaign.latitude && campaign.longitude
          ? calculateProximity(userLat, userLon, campaign.latitude, campaign.longitude)
          : 0;

        const proximityScore = proximity <= 10 ? 1 : proximity <= 50 ? 0.7 : proximity <= 200 ? 0.4 : 0;
        const globalModifier = 1.0;
        const impact = parseFloat((integrity * proximityScore * globalModifier).toFixed(4));

        const { error } = await supabase.from('votes').insert({
          campaign_id: campaign.id,
          user_id: user.id,
          choice,
          latitude: userLat,
          longitude: userLon,
          integrity,
          proximity: proximityScore,
          impact,
          age: profile.age ?? null,
          gender: profile.gender ?? null,
        });

        if (error) {
          setVoteError(error.message);
        } else {
          setVoteChoice(choice);
          setVoteImpact(impact);
          setVoted(true);
          setVoteSuccess(true);
          fetchVoteCount();
          await updateCampaignIntegrity();
          setTimeout(() => setVoteSuccess(false), 3000);
        }
      },
      (err) => {
        setVoteError('Failed to get location: ' + err.message);
      }
    );
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4 border border-gray-100">
      {campaign.image && (
        <div className="w-full overflow-hidden rounded mt-6 mb-4">
          <img src={campaign.image} alt={campaign.title} className="w-full" />
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{campaign.scope}</p>
      <p className="text-gray-700 mb-2">{campaign.description}</p>

      {campaign.creator_integrity !== undefined && (
        <p className="text-sm text-purple-600 mb-2">
          🧬 Creator Integrity: <strong>{(campaign.creator_integrity * 100).toFixed(0)}%</strong>
        </p>
      )}

      {campaign.campaign_integrity !== undefined && (
        <p className="text-sm text-indigo-600 mb-2">
          📊 Campaign Integrity: <strong>{(campaign.campaign_integrity * 100).toFixed(1)}%</strong>
        </p>
      )}

      {(campaign.city || campaign.country) && (
        <p className="text-sm text-gray-500 mb-4">
          📍 Location: {campaign.city && campaign.country ? `${campaign.city}, ${campaign.country}` : campaign.city || campaign.country}
        </p>
      )}

      {campaign.url && (
        <div className="mt-4">
          <img
            src={`https://api.microlink.io/?url=${encodeURIComponent(campaign.url)}&meta=true&embed=image.url`}
            alt="Website preview"
            className="w-full rounded mb-2 border"
          />
          <a
            href={campaign.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Learn more
          </a>
        </div>
      )}

      <div className="mt-4">
        {voteCount !== null && (
          <p className="text-sm text-gray-700 mb-2">Total Votes: {voteCount}</p>
        )}

        {!voted ? (
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => castVote('yes')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Vote Yes
            </button>
            <button
              onClick={() => castVote('no')}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Vote No
            </button>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-green-700">
              ✅ You voted <strong>{voteChoice.toUpperCase()}</strong>.
            </p>
            {voteImpact !== null && (
              <p className="text-sm text-blue-700">
                🧠 Your vote impact: <strong>{(voteImpact * 100).toFixed(1)}%</strong>
              </p>
            )}
          </>
        )}

        {voteSuccess && (
          <div className="mt-4 text-green-700 text-sm">
            ✅ Your vote was submitted successfully.
          </div>
        )}

        {voteError && (
          <div className="mt-4 text-red-600 text-sm">
            ❌ {voteError}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleCharts.includes('VoteSplitChart') && <VoteSplitChart campaignId={campaign.id} />}
        {visibleCharts.includes('CampaignIntegrityChart') && <CampaignIntegrityChart campaignId={campaign.id} />}
        {visibleCharts.includes('ProximityReachChart') && <ProximityReachChart campaignId={campaign.id} />}
        {visibleCharts.includes('VoteMomentumChart') && <VoteMomentumChart campaignId={campaign.id} />}
        {visibleCharts.includes('VotePulseChart') && <VotePulseChart campaignId={campaign.id} />}
        {visibleCharts.includes('VoteImpactMatrix') && <VoteImpactMatrix campaignId={campaign.id} />}
        {visibleCharts.includes('VoterIntegrityChart') && <VoterIntegrityChart campaignId={campaign.id} />}
        {visibleCharts.includes('VoterAgeDistributionChart') && <VoterAgeDistributionChart campaignId={campaign.id} />}
        {visibleCharts.includes('VoterGenderDistributionChart') && <VoterGenderDistributionChart campaignId={campaign.id} />}
        {visibleCharts.includes('VoteMapChart') && <VoteMapChart campaignId={campaign.id} />}
        {visibleCharts.includes('VoteOriginMap') && <VoteOriginMap campaignId={campaign.id} />}
      </div>
    </div>
  );
}
