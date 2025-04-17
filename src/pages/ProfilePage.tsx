
import ProfileIntegrity from '../components/ProfileIntegrity';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        alert('You must be logged in to access your profile.');
        navigate('/login');
        return;
      }

      setUser(data.user);
      setProfile((prev) => ({ ...prev, email: data.user.email }));
      setLoading(false);
    };

    getUser();
  }, []);

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
  console.error('Supabase error:', error); // Log it to console
  alert('Error saving profile: ' + (error.message || 'Unknown error'));
} else {
  alert('Profile saved!');
}


    if (error) {
      alert('Error saving profile: ' + error.message);
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
    </div>
  );
}
