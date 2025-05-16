import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { groupVotesByTime } from '../../utils/chartUtils';

type Props = {
  campaignId: string;
};

type Vote = {
  created_at: string;
  choice: 'yes' | 'no';
  campaign_id: string;
};

type ChartPoint = {
  time: string;
  votes: number;
};

export default function VoteMomentumChart({ campaignId }: Props) {
  const [data, setData] = useState<ChartPoint[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('created_at, choice')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true });

    const grouped = groupVotesByTime(votes || [], 'hour');
    const formatted = grouped.map(d => ({ time: d.time, votes: d.yesCount + d.noCount }));
    setData(formatted);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:momentum')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0) return <p className="text-sm text-gray-500">Loading vote momentum...</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="votes"
          stroke="#6366F1"
          fill="#A5B4FC"
          strokeWidth={2}
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
