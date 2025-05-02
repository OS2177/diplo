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
  gender: string;
  phone_number?: string;
  street?: string;
  postcode?: string;
  bio: string;
  location_permission?: boolean;
  two_factor_enabled?: boolean;
  blockchain_id?: string;
  community_verified?: boolean;
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
  creator_verified_2fa?: boolean;
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
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .limit(1)
      .maybeSingle(); // ✅ avoids 406 error when profile is missing

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
    }

    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select('id, choice, created_at, campaign_id, campaigns(title)')
      .eq('user_id', user?.id);

    if (votesError) {
      console.error('Error fetching votes:', votesError.message);
    }

    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('created_by', user?.id);

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError.message);
    }

    if (profileData) setProfile(profileData);
    if (votesData) setVotes(votesData);
    if (campaignsData) setCreatedCampaigns(campaignsData);
  } catch (error) {
    console.error('Unexpected error fetching user data:', error);
  } finally {
    setLoadingProfile(false);
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setProfile((prev) => prev ? { ...prev, [name]: newValue } : null);
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    const cleanedAge = profile.age && !isNaN(Number(profile.age)) ? parseInt(profile.age) : null;

    const updatePayload: any = {
      id: user.id,
      name: profile.name?.trim() || '',
      street: profile.street?.trim() || '',
      postcode: profile.postcode?.trim() || '',
      city: profile.city?.trim() || '',
      country: profile.country?.trim() || '',
      gender: profile.gender?.trim() || '',
      phone_number: profile.phone_number?.trim() || '',
      bio: profile.bio || '',
      two_factor_enabled: !!profile.two_factor_enabled,
      updated_at: new Date().toISOString(),
    };

    if (cleanedAge !== null) {
      updatePayload.age = cleanedAge;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(updatePayload);

    if (error) {
      console.error('❌ Supabase error:', error);
      alert('❌ Error saving profile');
    } else {
      alert('✅ Profile saved');
      await fetchUserData();
    }
  };

  const deleteProfile = async () => {
  if (!user) return;

  const confirmDelete = window.confirm(
    'This will delete your profile data and log you out. Continue?'
  );
  if (!confirmDelete) return;

  // Step 1: Delete from public 'profiles' table
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (profileError) {
    alert('❌ Error deleting profile: ' + profileError.message);
    return;
  }

  // Step 2: Sign out the user
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    alert('⚠️ Profile deleted, but sign-out failed: ' + signOutError.message);
  } else {
    alert('✅ Your profile has been deleted and you’ve been signed out.');
  }

  // Step 3: Redirect
  navigate('/');
};


  const calculateIntegrityScore = (profile: Profile): number => {
    let score = 0;
    if (profile?.location_permission) score += 0.2;
    if (profile?.two_factor_enabled) score += 0.2;
    if (profile?.blockchain_id) score += 0.3;
    if (profile?.community_verified) score += 0.1;
    return Math.min(score, 1.0);
  };

  const creatorIntegrity = profile ? calculateIntegrityScore(profile) : 0;

  if (loading || loadingProfile) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      <div className="grid gap-4">
        {['name', 'street', 'postcode', 'city', 'country', 'age', 'gender', 'phone_number', 'bio'].map((field) => (
          <input
            key={field}
            type={field === 'age' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}
            value={profile ? (profile as any)[field] || '' : ''}
            onChange={handleChange}
            className={`border px-3 py-2 rounded ${field === 'age' ? 'appearance-none' : ''}`}
          />
        ))}
        <input
          type="text"
          name="email"
          value={user?.email ?? ''}
          disabled
          className="bg-gray-100 border px-3 py-2 rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="two_factor_enabled"
            checked={profile?.two_factor_enabled || false}
            onChange={handleChange}
          />
          <span>Enable Two-Factor Authentication (2FA)</span>
        </label>
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

      {profile && <ProfileIntegrity profile={profile} />}

      <div className="bg-purple-50 border border-purple-200 p-4 rounded mt-4">
        <h4 className="text-md font-semibold text-purple-700 mb-2">🧬 Creator Integrity Score</h4>
        <p className="text-sm text-purple-800 mb-2">{(creatorIntegrity * 100).toFixed(0)}%</p>
        <h4 className="text-md font-semibold text-purple-700 mb-2">🧭 How to Improve Your Creator Integrity</h4>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>🔒 Enable <strong>Two-Factor Authentication</strong> in your account settings.</li>
          <li>📍 Allow <strong>location access</strong> when voting or creating campaigns.</li>
          <li>🧾 Fill in key <strong>profile fields</strong> to increase your score: name, age, city, country, gender, phone number.</li>
          <li>🪪 Connect a <strong>blockchain ID</strong> (coming soon).</li>
          <li>🤝 Get <strong>community verified</strong> through trusted interactions (coming soon).</li>
        </ul>
      </div>

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
                      await fetchUserData();
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

      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Campaigns You Created</h3>
        {createdCampaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <ul className="space-y-3">
            {createdCampaigns.map((campaign) => (
              <li key={campaign.id} className="border rounded p-4 bg-white shadow space-y-2">
                <h4 className="font-medium">{campaign.title}</h4>
                {campaign.creator_verified_2fa && (
                  <span className="inline-block text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">✅ 2FA Verified Creator</span>
                )}
                <p className="text-sm text-gray-600">{campaign.description}</p>
                <button
                  onClick={async () => {
                    const confirm = window.confirm(`Delete campaign \"${campaign.title}\"?`);
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
