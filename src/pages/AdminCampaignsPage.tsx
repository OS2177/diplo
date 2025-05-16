import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

export default function AdminCampaignsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error.message);
        return;
      }

      if (data?.is_admin) {
        setIsAdmin(true);
        fetchPendingCampaigns();
      } else {
        navigate('/'); // redirect if not admin
      }
    };

    const fetchPendingCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error.message);
      } else {
        setPendingCampaigns(data);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [user, navigate]);

  const updateCampaignStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Failed to update campaign status');
    } else {
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🛡️ Admin: Pending Campaigns</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pendingCampaigns.length === 0 ? (
        <p className="text-gray-500">No pending campaigns.</p>
      ) : (
        <ul className="space-y-4">
          {pendingCampaigns.map((campaign) => (
            <li key={campaign.id} className="border p-4 rounded bg-white shadow space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-blue-700">{campaign.title}</h2>
                  <p className="text-sm text-gray-700">{campaign.description}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => updateCampaignStatus(campaign.id, 'approved')}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateCampaignStatus(campaign.id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
