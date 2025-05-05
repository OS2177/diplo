import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  bio: string;
  location_permission?: boolean;
  two_factor_enabled?: boolean;
  blockchain_id?: string;
  community_verified?: boolean;
}

interface Vote {
  id: string;
  choice: string;
  created_at: string;
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
  latitude?: number;
  longitude?: number;
  creator_integrity?: number;
}

function calculateIntegrityScore(profile: any): number {
  let score = 0;
  if (profile?.location_permission) score += 0.2;
  if (profile?.name && profile?.age && profile?.city && profile?.country && profile?.gender) score += 0.2;
  if (profile?.two_factor_enabled) score += 0.2;
  if (profile?.blockchain_id) score += 0.3;
  if (profile?.community_verified) score += 0.1;
  return Math.min(score, 1.0);
}

import { calculateDistance } from '../utils/calculateDistance';


function calculateCreatorIntegrityScore(
  profile: Profile,
  campaigns: Campaign[],
  votes: Vote[],
  userLatLng?: { latitude: number; longitude: number }
): number {
  const voteIntegrity = calculateIntegrityScore(profile);
  const numCampaigns = campaigns.length;
  const numVotes = votes.length;

  let proximityBonus = 0;
  if (userLatLng) {
    const distances = campaigns
      .filter((c) => c.latitude && c.longitude)
      .map((c) => calculateDistance(userLatLng.latitude, userLatLng.longitude, c.latitude!, c.longitude!));
    const closeProximities = distances.filter((d) => d < 50).length;
    proximityBonus = closeProximities > 0 ? Math.min(closeProximities / campaigns.length, 1.0) : 0;
  }

  const score =
    voteIntegrity * 0.4 +
    Math.min(numCampaigns / 5, 1) * 0.25 +
    Math.min(numVotes / 10, 1) * 0.2 +
    proximityBonus * 0.15;

  return Math.min(score, 1.0);
}

export default function ProfilePage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<Campaign[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setUserLocation({ latitude: lat, longitude: lon });

            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || '';
            const country = data.address.country || '';

            setProfile((prev) => prev ? {
              ...prev,
              city,
              country,
              location_permission: true,
            } : prev);
          },
          (err) => console.warn('Geolocation error:', err.message),
          { enableHighAccuracy: true }
        );
      }
    } else if (!user && !loading) {
      navigate('/login', { state: { message: 'login-to-view-profile' } });
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      const { data: votesData } = await supabase.from('votes').select('id, choice, created_at, campaign_id, campaigns(title)').eq('user_id', user?.id);
      const { data: campaignsData } = await supabase.from('campaigns').select('*').eq('created_by', user?.id);
      if (profileData) setProfile(profileData);
      if (votesData) setVotes(votesData);
      if (campaignsData) setCreatedCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ... rest of the component unchanged


  const saveProfile = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      email: user.email, // ✅ ensure email is saved to profile
      updated_at: new Date().toISOString(),
    });
    if (error) console.error('Error updating profile:', error);
    else alert('Profile updated successfully!');
  };

  const deleteProfile = async () => {
    if (!user) return;
    const confirmDelete = window.confirm('This will delete your account and all related data. Continue?');
    if (!confirmDelete) return;
    try {
      const { error: votesError } = await supabase.from('votes').delete().eq('user_id', user.id);
      if (votesError) throw new Error(votesError.message);
      const { error: campaignsError } = await supabase.from('campaigns').delete().eq('created_by', user.id);
      if (campaignsError) throw new Error(campaignsError.message);
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
      if (profileError) throw new Error(profileError.message);
      await supabase.auth.signOut();
      alert('Your account and all associated data have been deleted.');
      navigate('/');
    } catch (err: any) {
      alert('Deletion failed: ' + err.message);
    }
  };

  const unvote = async (voteId: string) => {
    const { error } = await supabase.from('votes').delete().eq('id', voteId);
    if (error) return alert('Failed to unvote');
    setVotes(votes.filter((v) => v.id !== voteId));
  };

  const deleteCampaign = async (campaignId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
    if (!confirmDelete) return;
    const { error } = await supabase.from('campaigns').delete().eq('id', campaignId);
    if (error) return alert('Failed to delete campaign');
    setCreatedCampaigns(createdCampaigns.filter((c) => c.id !== campaignId));
  };

  const voteIntegrity = profile ? calculateIntegrityScore(profile) : 0;
  const creatorIntegrity = profile ? calculateCreatorIntegrityScore(profile, createdCampaigns, votes, userLocation ?? undefined) : null;

  if (loading || loadingProfile) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      <div className="grid gap-4">
        {["name", "city", "country", "age", "gender", "bio"].map((field) => (
          <input
            key={field}
            type={field === "age" ? "number" : "text"}
            name={field}
            placeholder={field === "gender" ? "Gender / Identifies as" : field.charAt(0).toUpperCase() + field.slice(1)}
            value={profile ? (profile[field as keyof Profile] as string) : ""}
            onChange={(e) => setProfile((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null))}
            className="border px-3 py-2 rounded"
          />
        ))}
        <input type="text" name="email" value={user?.email ?? ''} disabled className="bg-gray-100 border px-3 py-2 rounded" />
        <div className="flex gap-4">
          <button onClick={saveProfile} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">Save Profile</button>
          <button onClick={deleteProfile} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Profile</button>
        </div>
      </div>

      <ProfileIntegrity profile={profile} />

      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <h4 className="text-md font-semibold text-blue-700 mb-2">🔐 Vote Integrity Score (Live)</h4>
        <p className="text-sm text-blue-800">{(voteIntegrity * 100).toFixed(1)}%</p>
      </div>

      <div className="bg-green-50 border border-green-200 p-4 rounded">
        <h4 className="text-md font-semibold text-green-700 mb-2">🧬 Creator Integrity (Live)</h4>
        <p className="text-sm text-green-800">{creatorIntegrity !== null ? `${(creatorIntegrity * 100).toFixed(1)}%` : 'N/A'}</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 p-4 rounded">
        <h4 className="text-md font-semibold text-purple-700 mb-2">🧭 How to Improve Your Creator Integrity</h4>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>🔒 Enable <strong>Two-Factor Authentication</strong> in your account settings.</li>
          <li>📍 Allow <strong>location access</strong> when voting or creating campaigns.</li>
          <li>🧾 Fill in all <strong>required profile fields</strong>: name, age, city, country, gender.</li>
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
                  <Link to={`/campaign/${vote.campaign_id}`} className="text-blue-600 hover:underline">{vote.campaigns?.title}</Link>
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(vote.created_at).toLocaleString()}
                  {vote.locationName ? ` | ${vote.locationName}` : ''}
                </p>
                <button
                  onClick={() => unvote(vote.id)}
                  className="text-red-500 text-xs hover:underline"
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
                <Link to={`/campaign/${campaign.id}`} className="text-lg font-medium text-blue-700 hover:underline">
                  {campaign.title}
                </Link>
                <p className="text-sm text-gray-600">{campaign.description}</p>
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
