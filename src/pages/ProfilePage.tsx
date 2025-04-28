// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import ProfileIntegrity from '../components/ProfileIntegrity';
import { reverseGeocode } from '../hooks/useReverseGeocode';

interface Profile { ... } // same
interface Vote { ... } // same

export default function ProfilePage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<any[]>([]);
  const [integrityScore, setIntegrityScore] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => { ... }); // same
  useEffect(() => { ... }); // same
  useEffect(() => { ... }); // same
  useEffect(() => { ... }); // same

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };
  const saveProfile = async () => { ... };

  if (loading || loadingProfile) {
    return <div className="p-6">Loading profile…</div>;
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
            value={profile ? profile[field as keyof Profile] as any : ''}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        ))}
        <input
          type="text"
          name="email"
          value={profile?.email ?? ''}
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

      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Your Votes</h3>
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

      <div>
        <h3 className="text-xl font-semibold mt-10 mb-3">Campaigns You Created</h3>
        {createdCampaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {createdCampaigns.map((c) => (
              <li key={c.id}>{c.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
