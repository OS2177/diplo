// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import ProfileIntegrity from '../components/ProfileIntegrity';
import { reverseGeocode } from '../hooks/useReverseGeocode';

interface Profile {
  name: string;
  email: string;
  city: string;
  country: string;
  age: number;
  pronouns: string;
  bio: string;
}

interface Vote {
  id: string;
  choice: string;
  timestamp: string;
  campaigns: { title: string } | null;
  locationName?: string;
}

export default function ProfilePage() {
const { user, loading } = useUser();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<any[]>([]);
  const [integrityScore, setIntegrityScore] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
  if (!loading && user === null) {
    navigate('/login', { state: { message: 'login-to-view-profile' } });
  }
}, [user, loading, navigate]);


  // Fetch profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile({
          name: data.name ?? '',
          email: data.email ?? '',
          city: data.city ?? '',
          country: data.country ?? '',
          age: data.age ?? 0,
          pronouns: data.pronouns ?? '',
          bio: data.bio ?? '',
        });
      }
      setLoadingProfile(false);
    })();
  }, [user]);

  // Fetch votes + reverse geocode
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('votes')
        .select('id, choice, timestamp, latitude, longitude, campaigns(title)')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
      if (data) {
        const withLoc = await Promise.all(
          data.map(async (v) => ({
            id: v.id,
            choice: v.choice,
            timestamp: v.timestamp,
            campaigns: v.campaigns,
            locationName:
              v.latitude && v.longitude
                ? await reverseGeocode(v.latitude, v.longitude)
                : undefined,
          }))
        );
        setVotes(withLoc);
      }
    })();
  }, [user]);

  // Fetch campaigns created
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('campaigns')
        .select('id, title')
        .eq('created_by', user.id);
      setCreatedCampaigns(data || []);
    })();
  }, [user]);

  // Compute integrity score
  useEffect(() => {
    if (!user || !profile) return;
    let score = 0;
    if (user.email) score += 20;
    if (profile.name) score += 10;
    if (profile.city && profile.country) score += 10;
    if (profile.age) score += 10;
    if (profile.bio) score += 10;
    if (profile.pronouns) score += 10;
    setIntegrityScore(score);
  }, [user, profile]);

  // Handle profile edits
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: name === 'age' ? Number(value) : value });
  };

  const saveProfile = async () => {
    if (!user || !profile) return;
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
    });
    alert(error ? `Error: ${error.message}` : 'Profile saved!');
  };

  if (loading || loadingProfile) {
  return <div className="p-6">Loading profile…</div>;
}

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Your Profile</h2>

      {/* Edit form */}
      <div className="grid gap-4">
        {['name', 'city', 'country', 'age', 'pronouns', 'bio'].map((field) => (
          <input
            key={field}
            type={field === 'age' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={profile[field as keyof Profile] as any}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        ))}
        <input
          type="text"
          name="email"
          value={profile.email}
          disabled
          className="bg-gray-100 border px-3 py-2 rounded"
        />
        <button
          onClick={saveProfile}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Save Profile
        </button>
        <ProfileIntegrity profile={profile} />
      </div>

      {/* Vote history */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Your Votes</h3>
        {votes.length === 0 ? (
          <p className="text-gray-500">No votes yet.</p>
        ) : (
          <ul className="space-y-3">
            {votes.map((v) => (
              <li key={v.id} className="border rounded p-4 bg-white shadow">
                <p>
                  Voted <strong>{v.choice.toUpperCase()}</strong> on{' '}
                  <span className="font-medium">{v.campaigns?.title}</span>
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(v.timestamp).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {v.locationName ? ` | 📍 ${v.locationName}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Campaigns created */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Campaigns You Created</h3>
        {createdCampaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {createdCampaigns.map((c) => (
              <li key={c.id}>{c.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
