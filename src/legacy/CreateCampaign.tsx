import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CreateCampaign() {
  const [user, setUser] = useState(null);
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    scope: '',
    region: '',
    image: '',
    url: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        alert('Login required to create a campaign');
        navigate('/login');
      } else {
        setUser(data.user);
      }
    });
  }, []);

  const handleChange = (e) => {
    setCampaign({ ...campaign, [e.target.name]: e.target.value });
  };

  const createCampaign = async () => {
    const { error } = await supabase.from('campaigns').insert([
      {
        ...campaign,
        created_by: user.id,
      },
    ]);

    if (error) {
      alert('Error creating campaign: ' + error.message);
    } else {
      alert('Campaign created successfully!');
      navigate('/home'); // or to a campaign view page
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create a Campaign</h2>
      <div className="grid gap-4">
        {['title', 'description', 'scope', 'region', 'image', 'url'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={campaign[field]}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />
        ))}
        <button
          onClick={createCampaign}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Submit Campaign
        </button>
      </div>
    </div>
  );
}