import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';

type Props = {
  campaignId: string;
};

type Vote = {
  latitude: number;
  longitude: number;
};

export default function VoteOriginMap({ campaignId }: Props) {
  const theme = chartThemes.voteOriginMap;
  const [votes, setVotes] = useState<Vote[]>([]);

  const fetchVotes = async () => {
    const { data: voteData } = await supabase
      .from('votes')
      .select('latitude, longitude')
      .eq('campaign_id', campaignId);

    if (voteData) setVotes(voteData);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:origin')
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
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {votes.map((vote, index) => (
            <CircleMarker
              key={index}
              center={[vote.latitude, vote.longitude]}
              radius={3}
              pathOptions={{ color: theme.primary, fillOpacity: 0.6 }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                <span style={{ color: theme.primary }}>📍 Vote</span>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </DiploChartWrapper>
  );
}
