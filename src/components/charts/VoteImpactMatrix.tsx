import { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';

type Props = {
  campaignId: string;
};

type Vote = {
  integrity: number;
  proximity: number;
};

export default function VoteImpactMatrix({ campaignId }: Props) {
  const theme = chartThemes.voteImpact;
  const [data, setData] = useState<Vote[]>([]);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data: votes } = await supabase
        .from('votes')
        .select('integrity, proximity')
        .eq('campaign_id', campaignId);

      setData(votes || []);
    };

    fetchVotes();

    const channel = supabase
      .channel('votes:impact')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading vote impact data...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.primary} />
          <XAxis
            type="number"
            dataKey="integrity"
            name="Integrity"
            domain={[0, 1]}
            stroke={theme.primary}
            tick={{ fill: theme.primary, fontSize: theme.fontSize }}
          />
          <YAxis
            type="number"
            dataKey="proximity"
            name="Proximity"
            domain={[0, 1]}
            stroke={theme.primary}
            tick={{ fill: theme.primary, fontSize: theme.fontSize }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
          <Scatter data={data} fill={theme.primary} />
        </ScatterChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
