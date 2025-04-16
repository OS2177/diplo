import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

interface Campaign {
  id: string;
  title: string;
  description: string;
  scope: string;
  created_at: string;
}

export default function GlobalPulse() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title, description, scope, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error.message);
      } else {
        setCampaigns(data || []);
      }

      setLoading(false);
    }

    fetchCampaigns();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading campaigns...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">🌐 Global Pulse</h1>
      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns yet. Be the first to create one!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/campaign/${campaign.id}`}
              className="border rounded-xl p-4 hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-bold mb-1">{campaign.title}</h2>
              <p className="text-sm text-gray-700 line-clamp-3">{campaign.description}</p>
              <span className="text-xs text-indigo-500 font-medium mt-2 inline-block">Scope: {campaign.scope}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
