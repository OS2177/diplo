import { useState } from 'react';
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
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [voted, setVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState('');
  const [voteSuccess, setVoteSuccess] = useState(false);

  const castVote = async (choice: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return alert('Please log in to vote.');

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const impact = 1.0;

      const { error } = await supabase.from('votes').insert({
        campaign_id: campaign.id,
        user_id: userData.user.id,
        choice,
        latitude,
        longitude,
        impact,
      });

      if (error) {
        alert('Error submitting vote: ' + error.message);
      } else {
        setVoteChoice(choice);
        setVoted(true);
        setVoteSuccess(true);
        setTimeout(() => setVoteSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4 border border-gray-100">
      {campaign.image && (
        <div className="w-full overflow-hidden rounded mt-6 mb-4">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full"
          />
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{campaign.scope}</p>
      <p className="text-gray-700 mb-2">{campaign.description}</p>

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

      {!voted ? (
        <div className="flex gap-4 mt-6">
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
        <p className="mt-4 text-sm text-green-700">
          You voted <strong>{voteChoice.toUpperCase()}</strong> on this campaign.
        </p>
      )}

      {voteSuccess && (
        <div className="mt-4 text-green-700 text-sm">
          ✅ Your vote was submitted successfully.
        </div>
      )}

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