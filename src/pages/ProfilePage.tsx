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
  const [profile, setProfile] = useState<Profile>({
    id: '',
    name: '',
    email: '',
    city: '',
    country: '',
    age: '',
    gender: '',
    phone_number: '',
    street: '',
    postcode: '',
    bio: '',
    location_permission: false,
    two_factor_enabled: false,
    blockchain_id: '',
    community_verified: false,
  });
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
        .maybeSingle();

      if (profileError) throw profileError;

      setProfile((prev) => ({ ...prev, ...profileData }));

      const { data: votesData } = await supabase
        .from('votes')
        .select('id, choice, created_at, campaign_id, campaigns(title)')
        .eq('user_id', user?.id);

      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('created_by', user?.id);

      if (votesData) setVotes(votesData);
      if (campaignsData) setCreatedCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setProfile((prev) => ({ ...prev, [name]: newValue }));
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

    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      alert('❌ Error deleting profile: ' + profileError.message);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      alert('⚠️ Profile deleted, but sign-out failed: ' + signOutError.message);
    } else {
      alert('✅ Your profile has been deleted and you’ve been signed out.');
    }

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
            value={(profile as any)[field] || ''}
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
    </div>
  );
}
