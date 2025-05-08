import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // If you're using Leaflet for maps

function calculateIntegrityScore(profile: any): number {
  let score = 0;
  if (profile?.location_permission) score += 0.2;
  if (profile?.profile_complete) score += 0.2;
  if (profile?.two_factor_enabled) score += 0.2;
  if (profile?.blockchain_id) score += 0.3;
  if (profile?.community_verified) score += 0.1;
  return Math.min(score, 1.0);
}

export default function CreateCampaignPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('personal');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [campaignCity, setCampaignCity] = useState('');
  const [campaignCountry, setCampaignCountry] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [campaignLatitude, setCampaignLatitude] = useState<number | null>(null);
  const [campaignLongitude, setCampaignLongitude] = useState<number | null>(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate('/login', { state: { message: 'login-to-create-campaign' } });
      } else {
        setUser(data.user);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const rawCity = data.address.city || data.address.town || data.address.village || '';
          setCity(typeof rawCity === 'string' ? rawCity : '');
          setCountry(data.address.country || '');
        });
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchCampaignCoordinates = async () => {
      if (campaignCity && campaignCountry) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${campaignCity},${campaignCountry}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCampaignLatitude(parseFloat(lat));
          setCampaignLongitude(parseFloat(lon));
        } else {
          alert('Location not found for Campaign City and Country.');
        }
      }
    };

    if (campaignCity && campaignCountry) {
      fetchCampaignCoordinates();
    }
  }, [campaignCity, campaignCountry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!campaignCity || !campaignCountry) {
      alert('Campaign City and Country are required.');
      return;
    }
    if (campaignLatitude === null || campaignLongitude === null) {
      alert('Unable to fetch coordinates for the Campaign location.');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const creator_integrity = profile ? calculateIntegrityScore(profile) : 0;
    const creator_verified_2fa = profile?.two_factor_enabled || false;

    const { error } = await supabase.from('campaigns').insert([
      {
        title,
        description,
        scope,
        image,
        url,
        city,
        country,
        campaign_latitude: campaignLatitude,
        campaign_longitude: campaignLongitude,
        created_by: user.id,
        status: 'published',
        creator_integrity,
        creator_verified_2fa,
      },
    ]);

    if (error) {
      console.error('Error creating campaign:', error.message);
      alert('Error: ' + error.message);
    } else {
      alert('Campaign created successfully!');
      navigate('/global-pulse');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full border p-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className="w-full border p-2" />
        <select value={scope} onChange={(e) => setScope(e.target.value)} className="w-full border p-2">
          <option value="personal">Personal</option>
          <option value="social">Social</option>
          <option value="local">Local</option>
          <option value="global">Global</option>
          <option value="ecological">Ecological</option>
        </select>
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (optional)" className="w-full border p-2" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Reference URL (optional)" className="w-full border p-2" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required className="w-full border p-2" />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" required className="w-full border p-2" />
        <input value={campaignCity} onChange={(e) => setCampaignCity(e.target.value)} placeholder="Campaign Town/City" required className="w-full border p-2" />
        <input value={campaignCountry} onChange={(e) => setCampaignCountry(e.target.value)} placeholder="Campaign Country" required className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Campaign</button>
      </form>
    </div>
  );
}
