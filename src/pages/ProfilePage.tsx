
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
  updated_at?: string;
}

interface Vote {
  id: string;
  choice: string;
  timestamp: string;
  locationName?: string;
  campaigns?: {
    title: string;
  };
}

export default function ProfilePage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    if (user) {
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
        .eq('creator_id', user?.id);

      if (profileData) setProfile(profileData as Profile);
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

  if (loading || loadingProfile) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

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
        <button
          onClick={saveProfile}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Save Profile
        </button>
      </div>

      {profile && <ProfileIntegrity profile={profile} />}

      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Your Votes</h3>
        {votes.length === 0 ? (
          <p className="text-gray-500">No votes yet.</p>
        ) : (
          <ul className="space-y-3">
            {votes.map((vote) => (
              <li key={vote.id} className="border rounded p-4 bg-white shadow">
                <p>
                  Voted <strong>{vote.choice.toUpperCase()}</strong> on{' '}
                  <span className="font-medium">{vote.campaigns?.title}</span>
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(vote.timestamp).toLocaleString()}
                  {vote.locationName ? ` | 📍 ${vote.locationName}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Your Campaigns</h3>
        {createdCampaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <ul className="space-y-3">
            {createdCampaigns.map((campaign) => (
              <li key={campaign.id} className="border rounded p-4 bg-white shadow">
                <h4 className="font-medium">{campaign.title}</h4>
                <p className="text-sm text-gray-600">{campaign.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
