import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import ProfileIntegrity from '../components/ProfileIntegrity';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    city: '',
    country: '',
    age: '',
    pronouns: '',
    bio: '',
  });
  const [votes, setVotes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!data?.user) {
        navigate('/login', { state: { message: 'login-to-view-profile' } });
        return;
      }

      setUser(data.user);
      setProfile((prev) => ({ ...prev, email: data.user.email }));
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('votes')
        .select('id, choice, timestamp, campaign_id, campaigns(title)')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (data) {
        const formatted = data.map((v) => ({
          ...v,
          campaign_title: v.campaigns?.title || 'Untitled Campaign',
        }));
        setVotes(formatted);
      } else {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...profile,
      age: parseInt(profile.age, 10),
    });

    if (error) {
      console.error('Supabase error:', error);
      alert('Error saving profile: ' + (error.message || 'Unknown error'));
    } else {
      alert('Profile saved!');
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="grid gap-4">
        {['name', 'city', 'country', 'age', 'pronouns', 'bio'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={profile[field]}
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

      {/* ✅ Vote History */}
      {votes.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-3">🗳️ Your Votes</h3>
          <ul className="space-y-3">
            {votes.map((vote) => (
              <li key={vote.id} className="border rounded p-4 shadow-sm bg-white">
                <p className="text-sm text-gray-800">
                  Voted <strong>{vote.choice.toUpperCase()}</strong> on{' '}
                  <span className="font-medium">{vote.campaign_title}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(vote.timestamp).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
