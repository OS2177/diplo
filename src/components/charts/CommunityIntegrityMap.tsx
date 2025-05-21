import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet.heat';
import { supabase } from '../../lib/supabaseClient';
import GlowingHeatLayer from '../layers/GlowingHeatLayer'; // ✅ NEW COMPONENT
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Vote = {
  latitude: number;
  longitude: number;
  integrity: number;
};

export default function CommunityIntegrityMap() {
  const theme = chartThemes.communityIntegrityMap;
  const { title, subtitle } = chartDescriptions.communityIntegrityMap;
  const [votes, setVotes] = useState<Vote[]>([]);

  const fetchVotes = async () => {
    const { data: voteData } = await supabase
      .from('votes')
      .select('latitude, longitude, integrity');

    if (voteData) setVotes(voteData);
  };

  useEffect(() => {
    fetchVotes();

    const channel = supabase
      .channel('votes:global-integrity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, () => {
        fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <div className="h-[400px] w-full rounded-xl overflow-hidden">
        <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GlowingHeatLayer votes={votes} /> {/* ✅ FIXED JSX HERE */}
        </MapContainer>
      </div>
    </DiploChartWrapper>
  );
}
