// ... [imports remain unchanged]
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../hooks/useUser';
import ProfileIntegrity from '../components/ProfileIntegrity';
import { calculateDistance } from '../utils/calculateDistance';

// ... [interfaces remain unchanged]

export default function ProfilePage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<Campaign[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPromptedOnce, setLocationPromptedOnce] = useState(false);

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

            setProfile((prev) =>
              prev ? { ...prev, city, country, location_permission: true } : prev
            );
          },
          () => {
            // Location denied — don't do anything now
          },
          { enableHighAccuracy: true }
        );
      }
    } else if (!user && !loading) {
      navigate('/login', { state: { message: 'login-to-view-profile' } });
    }
  }, [user, loading]);

  const requestLocationWithPrompt = () => {
    if (locationPromptedOnce || profile?.location_permission) return;

    const confirm = window.confirm(
      'Allowing browser location access improves your Integrity Score.\n\nWould you like to enable location access now?'
    );

    if (confirm && navigator.geolocation) {
      setLocationPromptedOnce(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation({ latitude: lat, longitude: lon });

          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || '';
          const country = data.address.country || '';

          setProfile((prev) =>
            prev ? { ...prev, city, country, location_permission: true } : prev
          );
        },
        () => alert('Location access still denied.'),
        { enableHighAccuracy: true }
      );
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      const { data: votesData } = await supabase.from('votes').select('id, choice, created_at, campaign_id, campaigns(title)').eq('user_id', user?.id);
      const { data: campaignsData } = await supabase.from('campaigns').select('*').eq('created_by', user?.id);

      if (profileData) {
        setProfile(profileData);
      } else if (user) {
        setProfile({
          id: user.id,
          email: user.email || '',
          name: '',
          city: '',
          country: '',
          age: '',
          gender: '',
          bio: '',
          location_permission: false,
          two_factor_enabled: false,
          blockchain_id: '',
          community_verified: false,
        });
      }

      if (votesData) setVotes(votesData);
      if (campaignsData) setCreatedCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    const { name, city, country, age, email } = profile;
    if (!name || !city || !country || !age || !email) {
      alert('Please fill in name, city, country, age, and email before saving your profile.');
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      email: email ?? user.email ?? null,
      updated_at: new Date().toISOString(),
    });

    if (error) console.error('Error updating profile:', error);
    else alert('Profile updated successfully!');
  };

  // ... [deleteProfile, unvote, deleteCampaign functions unchanged]

  const voteIntegrity = profile ? calculateIntegrityScore(profile) : 0;
  const creatorIntegrity = profile ? calculateCreatorIntegrityScore(profile, createdCampaigns, votes, userLocation ?? undefined) : null;

  if (loading || loadingProfile) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      <div className="grid gap-4">
        <input
          type="text"
          name="name"
          placeholder="name"
          value={profile?.name || ''}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="city"
          value={profile?.city || ''}
          onChange={(e) => {
            requestLocationWithPrompt();
            setProfile((prev) => (prev ? { ...prev, city: e.target.value } : null));
          }}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="country"
          value={profile?.country || ''}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, country: e.target.value } : null))}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="age"
          placeholder="age"
          value={profile?.age || ''}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, age: e.target.value } : null))}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="gender"
          placeholder="gender"
          value={profile?.gender || ''}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, gender: e.target.value } : null))}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="bio"
          placeholder="bio"
          value={profile?.bio || ''}
          onChange={(e) => setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : null))}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          value={profile?.email || ''}
          readOnly
          className="border px-3 py-2 rounded bg-gray-100"
        />

        <input disabled value="2FA Setup — Coming Soon" className="bg-gray-100 border text-gray-500 px-3 py-2 rounded italic" />
        <input disabled value="Blockchain ID — Coming Soon" className="bg-gray-100 border text-gray-500 px-3 py-2 rounded italic" />

        <div className="flex gap-4">
          <button onClick={saveProfile} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Update Profile</button>
          <button onClick={deleteProfile} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Profile</button>
        </div>
      </div>

      <ProfileIntegrity profile={profile} />

      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <h4 className="text-md font-semibold text-blue-700 mb-2">🔐 Vote Integrity Score</h4>
        <p className="text-sm text-blue-800">{(voteIntegrity * 100).toFixed(1)}%</p>
      </div>

      <div className="bg-green-50 border border-green-200 p-4 rounded">
        <h4 className="text-md font-semibold text-green-700 mb-2">🧬 Creator Integrity</h4>
        <p className="text-sm text-green-800">{creatorIntegrity !== null ? `${(creatorIntegrity * 100).toFixed(1)}%` : 'N/A'}</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 p-4 rounded">
        <h4 className="text-md font-semibold text-purple-700 mb-2">🧭 How to Improve Your Integrity</h4>
        <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>Enable 2FA</li>
          <li>Allow location access</li>
          <li>Fill in all profile fields</li>
          <li>Connect a blockchain ID</li>
          <li>Get community verified</li>
        </ul>
      </div>
    </div>
  );
}
