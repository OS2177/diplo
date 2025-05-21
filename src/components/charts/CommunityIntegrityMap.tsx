import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import 'leaflet.heat';
import L from 'leaflet';

type Props = {
  campaignId: string;
};

type Vote = {
  latitude: number;
  longitude: number;
  integrity: number;
};

function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    const layer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 18,
      maxZoom: 12,
      gradient: {
        0.2: '#ff4d4f',
        0.4: '#ffa94d',
        0.6: '#ffff4d',
        0.8: '#4dff88',
        1.0: '#00ffff',
      },
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, points]);

  return null;
}

export default function CommunityIntegrityMap({ campaignId }: Props) {
  const theme = chartThemes.communityIntegrityMap;
  const [points, setPoints] = useState<[number, number, number][]>([]);
  const center: [number, number] = [20, 0]; // approximate earth center

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('latitude, longitude, integrity')
      .eq('campaign_id', campaignId);

    if (votes) {
      const heatPoints = votes
        .filter(v => v.latitude && v.longitude && v.integrity)
        .map((v: Vote) => [v.latitude, v.longitude, v.integrity] as [number, number, number]);
      setPoints(heatPoints);
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:heatmap')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <div className="h-[400px] w-full rounded-xl overflow-hidden">
        <MapContainer
          center={center}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatLayer points={points} />
        </MapContainer>
      </div>
    </DiploChartWrapper>
  );
}
