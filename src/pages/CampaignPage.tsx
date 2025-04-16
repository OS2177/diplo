import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import VoteImpact from '../components/VoteImpact';

export default function CampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [integrityScore, setIntegrityScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('campaigns').select('*').eq('id', id).single();
      setCampaign(data);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      let score = 0;
      if (user.email) score += 20;
      if (profileData.name) score += 10;
      if (profileData.city && profileData.country) score += 10;
      if (profileData.age) score += 10;
      if (profileData.bio) score += 10;
      if (profileData.pronouns) score += 10;
      setIntegrityScore(score);

      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    };

    fetchData();
  }, [id]);

  if (!campaign) return <div className="p-6">Loading campaign...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{campaign.title}</h1>
      <p className="text-gray-700 mb-4">{campaign.description}</p>

      {/* 🔥 Vote Impact Section */}
      <VoteImpact
        integrityScore={integrityScore}
        userLocation={userLocation}
        campaignLocation={{ lat: campaign.latitude, lng: campaign.longitude }}
        campaignRadius={campaign.radius}
      />

      {/* 🔘 Placeholder for vote buttons */}
      <div className="mt-6 flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Vote YES</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Vote NO</button>
      </div>
    </div>
  );
}

