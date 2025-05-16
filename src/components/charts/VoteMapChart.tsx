import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { supabase } from '../../lib/supabaseClient';

type Props = {
  campaignId: string;
};

type Vote = {
  latitude: number;
  longitude: number;
  choice: 'yes' | 'no';
  created_at: string;
  integrity: number;
  campaign_id: string;
};

export default function VoteMapChart({ campaignId }: Props) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const fetchVotes = async () => {
    const { data: campaignData } = await supabase
      .from('campaigns')
      .select('latitude, longitude')
      .eq('id', campaignId)
      .single();

    if (campaignData) setCenter([campaignData.latitude, campaignData.longitude]);

    const { data: voteData } = await supabase
      .from('votes')
      .select('latitude, longitude, choice, created_at, integrity, campaign_id')
      .eq('campaign_id', campaignId);

    if (voteData) setVotes(voteData);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:map')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-300">
      <MapContainer center={center} zoom={3} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {votes.map((vote, index) => (
          <CircleMarker
            key={`${vote.created_at}-${index}`} // ensures uniqueness on live updates
            center={[vote.latitude, vote.longitude]}
            radius={5}
            pathOptions={{
              color: vote.choice === 'yes' ? '#34D399' : '#EF4444',
              fillOpacity: 0.7,
            }}
            eventHandlers={{
              add: (e) => {
                const el = e.target.getElement();
                if (el) {
                  el.style.opacity = '0';
                  el.style.transition = 'opacity 0.6s ease';
                  requestAnimationFrame(() => {
                    el.style.opacity = '1';
                  });
                }
              }
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
  );
}
