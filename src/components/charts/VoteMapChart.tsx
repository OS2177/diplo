import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Props = {
  campaignId: string;
};

type Vote = {
  latitude: number;
  longitude: number;
  choice: 'yes' | 'no';
  created_at: string;
  integrity: number;
};

export default function VoteMapChart({ campaignId }: Props) {
  const theme = chartThemes.voteMap;
  const { title, subtitle } = chartDescriptions.voteMap;
  const [votes, setVotes] = useState<Vote[]>([]);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const fetchVotes = async () => {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('latitude, longitude')
      .eq('id', campaignId)
      .single();

    if (campaign) setCenter([campaign.latitude, campaign.longitude]);

    const { data: voteData } = await supabase
      .from('votes')
      .select('latitude, longitude, choice, created_at, integrity')
      .eq('campaign_id', campaignId);

    if (Array.isArray(voteData)) setVotes(voteData);
    else setVotes([]);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:geo-map')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  const safeVotes = Array.isArray(votes) ? votes : [];

  if (safeVotes.length === 0)
    return <p className="text-sm text-gray-500">Loading vote map...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <div className="h-[400px] w-full rounded-xl overflow-hidden">
        <MapContainer center={center} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {safeVotes.map((vote, index) => (
            <CircleMarker
              key={index}
              center={[vote.latitude, vote.longitude]}
              radius={5}
              pathOptions={{
                color: vote.choice === 'yes' ? theme.positive : theme.negative,
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{vote.choice.toUpperCase()}</strong><br />
                  Integrity: {vote.integrity}<br />
                  Time: {new Date(vote.created_at).toLocaleString()}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </DiploChartWrapper>
  );
}
