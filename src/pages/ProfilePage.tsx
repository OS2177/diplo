import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import ProfileIntegrity from '../components/ProfileIntegrity';

interface Profile {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  age: string;
  pronouns: string;
  bio: string;
}

interface Vote {
  id: string;
  choice: string;
  timestamp: string;
  locationName?: string;
  campaign_id?: string;
  campaigns?: {
    title: string;
  };
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  created_by: string;
}

export default function ProfilePage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<Campaign[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { state: { message: 'login-to-view-profile' } });
    } else {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      const { data: votesData } = await supabase
        .from('votes')
        .select('*, campaigns(title)')
        .eq('user_id', user?.id);

      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('created_by', user?.id);

      if (profileData) setProfile(profileData);
      if (votesData) setVotes(votesData);
      if (campaignsData) setCreatedCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      alert('Profile updated successfully!');
    }
  };

  const deleteProfile = async () => {
    if (!user) return;
    const confirm = window.confirm('This will delete your account and data. Continue?');
    if (!confirm) return;

    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      alert('Error deleting profile: ' + profileError.message);
      return;
    }

    alert('Your profile data has been deleted.');
    navigate('/');
  };

  if (loading || loadingProfile) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      {/* Profile Form */}
      <div className="grid gap-4">
        {['name', 'city', 'country', 'age', 'pronouns', 'bio'].map((field) => (
          <input
            key={field}
            type={field === 'age' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={profile ? profile[field as keyof Profile] as string : ''}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        ))}
        <input
          type="text"
          name="email"
          value={user?.email ?? ''}
          disabled
          className="bg-gray-100 border px-3 py-2 rounded"
        />
        <div className="flex gap-4">
          <button
            onClick={saveProfile}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Save Profile
          </button>
          <button
            onClick={deleteProfile}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Profile
          </button>
        </div>
      </div>

      {/* Profile Integrity */}
      {profile && <ProfileIntegrity profile={profile} />}

      {/* Votes */}
      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Your Votes</h3>
        {votes.length === 0 ? (
          <p className="text-gray-500">No votes yet.</p>
        ) : (
          <ul className="space-y-3">
            {votes.map((vote) => (
              <li key={vote.id} className="border rounded p-4 bg-white shadow space-y-2">
                <p>
                  Voted <strong>{vote.choice.toUpperCase()}</strong> on{' '}
                  <span className="font-medium">{vote.campaigns?.title}</span>
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(vote.timestamp).toLocaleString()}
                  {vote.locationName ? ` | 📍 ${vote.locationName}` : ''}
                </p>
                <button
                  onClick={async () => {
                    const confirm = window.confirm('Remove your vote?');
                    if (!confirm) return;

                    const { error } = await supabase
                      .from('votes')
                      .delete()
                      .eq('id', vote.id);

                    if (error) {
                      alert('Error removing vote: ' + error.message);
                    } else {
                      setVotes((prev) => prev.filter((v) => v.id !== vote.id));
                    }
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Unvote
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Created Campaigns */}
      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Campaigns You Created</h3>
        {createdCampaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <ul className="space-y-3">
            {createdCampaigns.map((campaign) => (
              <li key={campaign.id} className="border rounded p-4 bg-white shadow space-y-2">
                <h4 className="font-medium">{campaign.title}</h4>
                <p className="text-sm text-gray-600">{campaign.description}</p>
                <button
                  onClick={async () => {
                    const confirm = window.confirm(`Delete campaign "${campaign.title}"?`);
                    if (!confirm) return;

                    const { error } = await supabase
                      .from('campaigns')
                      .delete()
                      .eq('id', campaign.id);

                    if (error) {
                      alert('Error deleting campaign: ' + error.message);
                    } else {
                      setCreatedCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
                    }
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete Campaign
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
