
import VoteResults from '../components/VoteResults';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import VoteImpact from '../components/VoteImpact';
import { getUserLocation } from '../utils/getUserLocation';

export default function CampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [integrityScore, setIntegrityScore] = useState(0);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

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

  const handleVote = async () => {
    if (!user || !selectedVote) {
      alert('Please log in and choose an option.');
      return;
    }

    const location = await getUserLocation();

    const { error } = await supabase.from('votes').insert({
      campaign_id: campaign.id,
      user_id: user.id,
      choice: selectedVote,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      console.error('Vote error:', error);
      alert('Error submitting your vote.');
    } else {
      alert('Vote submitted successfully.');
      setSelectedVote(null); // reset after vote
    }
  };

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
<VoteResults campaignId={campaign.id} />
      {/* 🔘 Vote Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded text-white ${
            selectedVote === 'yes' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={() => setSelectedVote('yes')}
        >
          Vote YES
        </button>
        <button
          className={`px-4 py-2 rounded text-white ${
            selectedVote === 'no' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
          }`}
          onClick={() => setSelectedVote('no')}
        >
          Vote NO
        </button>
        <button
          onClick={handleVote}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}
