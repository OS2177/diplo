import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { calculateDistance } from '../utils/calculateDistance';

function calculateVoteIntegrity(profile: any): number {
  let score = 0;
  if (profile?.location_permission) score += 0.2;
  if (profile?.name && profile?.age && profile?.city && profile?.country && profile?.gender) score += 0.2;
  if (profile?.two_factor_enabled) score += 0.2;
  if (profile?.blockchain_id) score += 0.3;
  if (profile?.community_verified) score += 0.1;
  return Math.min(score, 1.0);
}

function calculateLocationAccuracy(userLat: number, userLon: number, campLat: number, campLon: number): number {
  const distance = calculateDistance(userLat, userLon, campLat, campLon);
  if (distance <= 10) return 1.0;
  if (distance <= 50) return 0.7;
  if (distance <= 200) return 0.4;
  return 0.0;
}

function calculateCampaignActivityScore(totalCampaigns: number): number {
  if (totalCampaigns >= 7) return 0.2;
  if (totalCampaigns >= 4) return 0.15;
  if (totalCampaigns >= 2) return 0.1;
  if (totalCampaigns >= 1) return 0.05;
  return 0;
}

export default function CreateCampaignPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('personal');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [campaignLocation, setCampaignLocation] = useState('');
  const [campaignLatitude, setCampaignLatitude] = useState<number | null>(null);
  const [campaignLongitude, setCampaignLongitude] = useState<number | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [user, setUser] = useState<any>(null);

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
        }, () => {
          alert('⚠️ Please allow location access to geotag your campaign.');
        });
      } else {
        alert('Geolocation not supported by your browser.');
      }
    };
    fetchLocation();
  }, []);

  const getCampaignCoordinates = async () => {
    if (!campaignLocation) return;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${campaignLocation}`);
    const data = await response.json();
    if (data.length > 0) {
      setCampaignLatitude(parseFloat(data[0].lat));
      setCampaignLongitude(parseFloat(data[0].lon));
    } else {
      alert('Unable to find location for the campaign.');
    }
  };

  useEffect(() => {
    getCampaignCoordinates();
  }, [campaignLocation]);

  useEffect(() => {
    if (campaignLocation.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${campaignLocation}&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          const locations = data.map((item: any) => item.display_name);
          setCitySuggestions(locations);
          setShowCitySuggestions(true);
        });
    } else {
      setShowCitySuggestions(false);
    }
  }, [campaignLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!campaignLocation || campaignLatitude === null || campaignLongitude === null) {
      alert('⚠️ Campaign location and valid coordinates are required to submit.');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      alert('Unable to fetch your profile.');
      return;
    }

    const vote_integrity = calculateVoteIntegrity(profile);
    const location_score = calculateLocationAccuracy(latitude!, longitude!, campaignLatitude, campaignLongitude);
    const { count: campaignCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id);

    const experience_score = calculateCampaignActivityScore(campaignCount || 0);
    const creator_integrity = parseFloat(
      (
        0.5 * vote_integrity +
        0.3 * location_score +
        0.2 * experience_score
      ).toFixed(4)
    );

    const { error } = await supabase.from('campaigns').insert([
      {
        title,
        description,
        scope,
        image,
        url,
        city,
        country,
        latitude,
        longitude,
        campaign_location: campaignLocation,
        campaign_latitude: campaignLatitude,
        campaign_longitude: campaignLongitude,
        created_by: user.id,
        status: 'published',
        creator_integrity,
        creator_verified_2fa: profile.two_factor_enabled || false,
        created_at: new Date().toISOString()
      },
    ]);

    if (error) {
      console.error('Error creating campaign:', error.message);
      alert('Error: ' + error.message);
    } else {
      alert('✅ Campaign created successfully!');
      navigate('/global-pulse');
    }
  };

  const handleLocationSelect = (location: string) => {
    setCampaignLocation(location);
    setShowCitySuggestions(false);
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

        <input value={campaignLocation} onChange={(e) => setCampaignLocation(e.target.value)} placeholder="Campaign Location" required className="w-full border p-2" />
        {showCitySuggestions && (
          <ul className="bg-white border rounded">
            {citySuggestions.map((location, index) => (
              <li key={index} onClick={() => handleLocationSelect(location)} className="p-2 cursor-pointer hover:bg-gray-200">{location}</li>
            ))}
          </ul>
        )}

        {campaignLatitude && campaignLongitude && (
          <p className="text-sm text-gray-600">
            📍 Location Campaign was Created: {city}, {country} ({latitude?.toFixed(4)}, {longitude?.toFixed(4)})
          </p>
        )}

        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded p-3">
          ⚠️ <strong>Once submitted, this campaign cannot be edited.</strong> Please review all information carefully before publishing.
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Campaign</button>
      </form>
    </div>
  );
}
