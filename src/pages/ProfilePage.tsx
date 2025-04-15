
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    city: '',
    country: '',
    age: '',
    pronouns: '',
    bio: '',
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        setProfile(prev => ({ ...prev, email: data.user.email }));
      }
    });
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
      alert('Error saving profile: ' + error.message);
    } else {
      alert('Profile saved!');
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="grid gap-4">
        {['name', 'city', 'country', 'age', 'pronouns', 'bio'].map(field => (
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
      </div>
    </div>
  );
}
