import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { groupVotesByTime } from '../../utils/chartUtils';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

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
  const theme = chartThemes.voteMomentum;
  const { title, subtitle } = chartDescriptions.voteMomentum;
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

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading vote momentum...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.primary} />
          <XAxis dataKey="time" tick={{ fontSize: theme.fontSize, fill: theme.primary }} />
          <YAxis allowDecimals={false} stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
          <Area
            type="monotone"
            dataKey="votes"
            stroke={theme.primary}
            fill={theme.secondary}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
