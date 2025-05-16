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
import {
  DIPLO_COLORS,
  defaultChartMargins,
  tickStyle,
  axisLineStyle,
  gridStyle,
  chartWrapperStyle
} from '../../styles/chartStyles';

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

  if (data.length === 0) return <p className="text-sm" style={{ color: DIPLO_COLORS.foreground }}>Loading vote momentum...</p>;

  return (
    <div style={chartWrapperStyle}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={defaultChartMargins}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="time" tick={tickStyle} axisLine={axisLineStyle} />
          <YAxis allowDecimals={false} tick={tickStyle} axisLine={axisLineStyle} />
          <Tooltip
            contentStyle={{
              backgroundColor: DIPLO_COLORS.background,
              border: `1px solid ${DIPLO_COLORS.foreground}`,
              fontSize: '10px',
              color: DIPLO_COLORS.foreground,
            }}
          />
          <Area
            type="monotone"
            dataKey="votes"
            stroke={DIPLO_COLORS.foreground}
            fill={DIPLO_COLORS.foreground}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
