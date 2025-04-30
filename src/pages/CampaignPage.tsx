import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import CampaignCard from '../components/CampaignCard';

export default function CampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error.message);
      } else {
        setCampaign(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link to="/global-pulse" className="text-blue-600 underline hover:text-blue-800">
          ← Back to Global Pulse
        </Link>
      </div>
      <CampaignCard campaign={campaign} />
    </div>
  );
}