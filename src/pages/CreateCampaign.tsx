
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    scope: 'local', // default value
    region: '',
    latitude: '',
    longitude: '',
    radius: '',
    image: '',
    url: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please login to create a campaign');
        navigate('/login');
        return;
      }

      const { error } = await supabase.from('campaigns').insert({
        ...campaign,
        created_by: user.id,
        latitude: parseFloat(campaign.latitude) || null,
        longitude: parseFloat(campaign.longitude) || null,
        radius: parseFloat(campaign.radius) || null,
      });

      if (error) throw error;
      
      alert('Campaign created successfully!');
      navigate('/');
    } catch (error) {
      alert('Error creating campaign: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Campaign Title*</label>
              <input
                type="text"
                name="title"
                required
                value={campaign.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1">Description*</label>
              <textarea
                name="description"
                required
                value={campaign.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
              />
            </div>
            <div>
              <label className="block mb-1">Scope</label>
              <select
                name="scope"
                value={campaign.scope}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="local">Local</option>
                <option value="regional">Regional</option>
                <option value="global">Global</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Region</label>
              <input
                type="text"
                name="region"
                value={campaign.region}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={campaign.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={campaign.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1">Radius (km)</label>
                <input
                  type="number"
                  step="any"
                  name="radius"
                  value={campaign.radius}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={campaign.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1">External URL</label>
              <input
                type="url"
                name="url"
                value={campaign.url}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
