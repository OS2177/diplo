
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import CampaignCard from '../components/CampaignCard';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error.message);
      } else {
        setCampaigns(data);
      }

      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Global Pulse</h1>
      {loading && <p>Loading campaigns...</p>}
      {!loading && campaigns.length === 0 && <p>No campaigns yet. Be the first to create one!</p>}
      {!loading &&
        campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
    </div>
  );
}
