import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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
  creator_integrity?: number;
};

function calculateIntegrityScore(profile: any): number {
  let score = 0;
  if (profile?.location_permission) score += 0.2;
  if (profile?.profile_complete) score += 0.2;
  if (profile?.two_factor_enabled) score += 0.2;
  if (profile?.blockchain_id) score += 0.3;
  if (profile?.community_verified) score += 0.1;
  return Math.min(score, 1.0);
}

function calculateProximity(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [voted, setVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState('');
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [voteImpact, setVoteImpact] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState<number | null>(null);

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

        const integrity = calculateIntegrityScore(profile);

        const proximity = campaign.latitude && campaign.longitude
          ? calculateProximity(userLat, userLon, campaign.latitude, campaign.longitude)
          : 1000;

        const globalModifier = 1.0;
        const impact = integrity * (1 / (proximity + 1)) * globalModifier;

        const { error } = await supabase.from('votes').insert({
          campaign_id: campaign.id,
          user_id: user.id,
          choice,
          latitude: userLat,
          longitude: userLon,
          integrity,
          proximity,
          impact,
        });

        if (error) {
          setVoteError(error.message);
        } else {
          setVoteChoice(choice);
          setVoteImpact(impact);
          setVoted(true);
          setVoteSuccess(true);
          fetchVoteCount();
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

      {(campaign.city || campaign.country) && (
        <p className="text-sm text-gray-500 mb-4">
          📍 {Array.isArray(campaign.city) ? campaign.city[0] : campaign.city}
          {campaign.city && campaign.country ? ', ' : ''}
          {campaign.country}
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
              ✅ You voted <strong>{voteChoice.toUpperCase()}</strong> on this campaign.
            </p>
            {voteImpact !== null && (
              <p className="text-sm text-blue-700">
                🧠 Your vote impact: <strong>{voteImpact.toFixed(4)}</strong>
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

      {campaign.latitude && campaign.longitude && (
        <div className="mt-6 mb-4">
          <iframe
            width="100%"
            height="250"
            className="rounded border"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${campaign.longitude - 0.01}%2C${campaign.latitude - 0.01}%2C${campaign.longitude + 0.01}%2C${campaign.latitude + 0.01}&layer=mapnik&marker=${campaign.latitude}%2C${campaign.longitude}`}
          ></iframe>
          <p className="text-xs text-gray-500 mt-2">
            <a
              href={`https://www.openstreetmap.org/?mlat=${campaign.latitude}&mlon=${campaign.longitude}#map=15/${campaign.latitude}/${campaign.longitude}`}
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