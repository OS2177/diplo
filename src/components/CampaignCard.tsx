import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import supabase

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    scope?: string;
    image?: string;
    url?: string;
    created_at?: string;
    campaign_location?: string; // Now using campaign_location
    campaign_latitude?: number;
    campaign_longitude?: number;
    creator_integrity?: number;
  };
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign
}) => {
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

        const proximity = campaign.campaign_latitude && campaign.campaign_longitude
          ? calculateProximity(userLat, userLon, campaign.campaign_latitude, campaign.campaign_longitude)
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

      {/* Display the Location using campaign_location */}
      {campaign.campaign_location && (
        <p className="text-sm text-gray-500 mb-4">
          📍 Location Campaign was Created: {campaign.campaign_location}
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

      {campaign.campaign_latitude && campaign.campaign_longitude && (
        <div className="mt-6 mb-4">
          <iframe
            width="100%"
            height="250"
            className="rounded border"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
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
};

export default CampaignCard;
