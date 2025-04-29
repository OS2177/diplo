
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
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [voted, setVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState('');

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
      <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{campaign.scope}</p>
      <p className="text-gray-700 mb-2">{campaign.description}</p>

      {campaign.url && (
        <a href={campaign.url} className="text-blue-600 underline" target="_blank">
          Learn more
        </a>
      )}

      {!voted ? (
        <div className="flex gap-4 mt-4">
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
      {campaign.image && (
  <img
    src={campaign.image}
    alt={campaign.title}
    className="w-full h-64 object-cover rounded mb-4"
  />
)}
    </div>
  );
}
