import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { calculateUserIntegrity, calculateProximity } from '../utils/integrity';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

        const proximityScore = campaign.scope === 'global'
          ? 1.0
          : calculateProximity(userLat, userLon, campaign.latitude!, campaign.longitude!, campaign.scope);

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
      {/* Website preview shown first */}
      {campaign.url && (
        <div className="mt-4 mb-4">
          <a
            href={campaign.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            <img
              src={`https://api.microlink.io/?url=${encodeURIComponent(campaign.url)}&meta=true&embed=image.url`}
              alt="Website preview"
              className="w-full rounded mb-2 border"
            />
            Learn more
          </a>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{campaign.scope}</p>
      <p className="text-gray-700 mb-2 whitespace-pre-line">{campaign.description}</p>
      
      {/* Campaign image shown after */}
      {campaign.image && (
        <div className="w-full overflow-hidden rounded mb-4">
          <img src={campaign.image} alt={campaign.title} className="w-full" />
        </div>
      )}


      {campaign.creator_integrity !== undefined && (
        <p className="text-sm text-purple-600 mb-2">
          Creator Integrity: <strong>{(campaign.creator_integrity * 100).toFixed(0)}%</strong>
        </p>
      )}

      {campaign.campaign_integrity !== undefined && (
        <p className="text-sm text-indigo-600 mb-2">
          Campaign Integrity: <strong>{(campaign.campaign_integrity * 100).toFixed(1)}%</strong>
        </p>
      )}

      {(campaign.scope === 'global' || campaign.city || campaign.country) && (
        <p className="text-sm text-gray-500 mb-4">
          📍 Location: {campaign.scope === 'global' ? '🌍 Global' : campaign.city && campaign.country ? `${campaign.city}, ${campaign.country}` : campaign.city || campaign.country}
        </p>
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
                Your vote impact: <strong>{(voteImpact * 100).toFixed(1)}%</strong>
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

      <div
        className="mt-6 cursor-pointer border rounded overflow-hidden hover:shadow-md transition-shadow bg-white"
        onClick={() => navigate(`/pulse/${campaign.id}`)}
      >
        <div className="flex">
          <img
            src="/images/square-1.png"
            alt="Pulse 1"
            className="w-1/3 object-cover"
          />
          <img
            src="/images/square-2.png"
            alt="Pulse 2"
            className="w-1/3 object-cover"
          />
          <img
            src="/images/square-3.gif"
            alt="Pulse 3"
            className="w-1/3 object-cover"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => window.location.href = `/pulse/${campaign.id}`}
          className="text-sm text-blue-600 hover:text-blue-400 underline flex items-center gap-2"
        >
          View Full Pulse
        </button>
      </div>

      {campaign.campaign_latitude && campaign.campaign_longitude && (
        <div className="mt-6 mb-4">
          <iframe
            width="100%"
            height="250"
            className="rounded border"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${campaign.campaign_longitude - 0.01}%2C${campaign.campaign_latitude - 0.01}%2C${campaign.campaign_longitude + 0.01}%2C${campaign.campaign_latitude + 0.01}&layer=mapnik&marker=${campaign.campaign_latitude}%2C${campaign.campaign_longitude}`}
          ></iframe>
          <p className="text-xs text-gray-500 mt-2">
            <a
              href={`https://www.openstreetmap.org/?mlat=${campaign.campaign_latitude}&mlon=${campaign.campaign_longitude}#map=15/${campaign.campaign_latitude}/${campaign.campaign_longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View full map
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
