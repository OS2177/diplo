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
import { DIPLO_COLORS, defaultChartMargins, tickStyle } from '../../styles/chartStyles';

type Props = {
  campaignId: string;
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
    <div className="rounded-2xl overflow-hidden shadow" style={{ backgroundColor: DIPLO_COLORS.background }}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={defaultChartMargins}>
          <CartesianGrid stroke={DIPLO_COLORS.grid} strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={tickStyle} />
          <YAxis allowDecimals={false} tick={tickStyle} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="votes"
            stroke={DIPLO_COLORS.magenta}
            fill={DIPLO_COLORS.magenta}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
