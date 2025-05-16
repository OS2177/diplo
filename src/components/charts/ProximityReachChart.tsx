import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';

type Props = {
  campaignId: string;
};

type Vote = {
  proximity: number;
  campaign_id: string;
};

type Bin = {
  label: string;
  count: number;
};

export default function ProximityReachChart({ campaignId }: Props) {
  const [data, setData] = useState<Bin[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('proximity')
      .eq('campaign_id', campaignId);

    const bins: Bin[] = [
      { label: '0–10 km', count: 0 },
      { label: '10–50 km', count: 0 },
      { label: '50–200 km', count: 0 },
      { label: '200+ km', count: 0 }
    ];

    votes?.forEach((vote: Vote) => {
      const p = vote.proximity;
      if (p >= 0.9) bins[0].count += 1;
      else if (p >= 0.6) bins[1].count += 1;
      else if (p >= 0.3) bins[2].count += 1;
      else bins[3].count += 1;
    });

    setData(bins);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:proximity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0) return <p className="text-sm text-gray-500">Loading proximity chart...</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar
          dataKey="count"
          fill="#10B981"
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-in-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
