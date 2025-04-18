import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [campaignsCreated, setCampaignsCreated] = useState<any[]>([]);
  const [integrityScore, setIntegrityScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getUser();
      if (!session?.user) {
        navigate('/login', { state: { message: 'login-to-view-profile' } });
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(profileData);

      const { data: voteData } = await supabase
        .from('votes')
        .select('*, campaigns(title)')
        .eq('user_id', session.user.id);
      setVotes(voteData || []);

      const { data: createdCampaigns } = await supabase
        .from('campaigns')
        .select('id, title, created_at')
        .eq('created_by', session.user.id);
      setCampaignsCreated(createdCampaigns || []);

      let score = 0;
      if (session.user.email) score += 20;
      if (profileData.name) score += 10;
      if (profileData.city && profileData.country) score += 10;
      if (profileData.age) score += 10;
      if (profileData.bio) score += 10;
      if (profileData.pronouns) score += 10;
      setIntegrityScore(score);
    };

    fetchData();
  }, []);

  if (!profile) return <div className="p-6">Loading your profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">👤 My Profile</h1>
      <div className="border p-4 rounded bg-white space-y-2">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>City:</strong> {profile.city}</p>
        <p><strong>Country:</strong> {profile.country}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Pronouns:</strong> {profile.pronouns}</p>
        <p><strong>Bio:</strong> {profile.bio}</p>
        <p><strong>Integrity Score:</strong> {integrityScore}/70</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📮 Campaigns I Voted On</h2>
        {votes.length === 0 ? (
          <p className="text-gray-500">You haven't voted yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {votes.map((vote) => (
              <li key={vote.id}>
                {vote.campaigns?.title} — <strong>{vote.choice.toUpperCase()}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">🛠 Campaigns I Created</h2>
        {campaignsCreated.length === 0 ? (
          <p className="text-gray-500">You haven't created any campaigns yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {campaignsCreated.map((c) => (
              <li key={c.id}>{c.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
