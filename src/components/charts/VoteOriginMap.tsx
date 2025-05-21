import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet.heat';
import { supabase } from '../../lib/supabaseClient';
import VoteHeatLayer from '../layers/VoteHeatLayer';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Props = {
  campaignId: string;
};

type Vote = {
  latitude: number;
  longitude: number;
};

export default function VoterOriginMap({ campaignId }: Props) {
  const theme = chartThemes.voterOriginMap;
  const { title, subtitle } = chartDescriptions.voterOriginMap;
  const [votes, setVotes] = useState<Vote[]>([]);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const fetchVotes = async () => {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('latitude, longitude')
      .eq('id', campaignId)
      .single();

    const { data: voteData } = await supabase
      .from('votes')
      .select('latitude, longitude')
      .eq('campaign_id', campaignId);

    if (campaign) setCenter([campaign.latitude, campaign.longitude]);
    if (Array.isArray(voteData)) setVotes(voteData);
    else setVotes([]);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:origin-map')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  const safeVotes = Array.isArray(votes) ? votes : [];

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <div className="h-[400px] w-full rounded-xl overflow-hidden">
        <MapContainer center={center} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <VoteHeatLayer votes={safeVotes} />
        </MapContainer>
      </div>
    </DiploChartWrapper>
  );
}
