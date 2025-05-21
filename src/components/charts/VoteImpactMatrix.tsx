import { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Props = {
  campaignId: string;
};

type Vote = {
  integrity: number;
  proximity: number;
  impact: number;
};

export default function VoteImpactMatrix({ campaignId }: Props) {
  const theme = chartThemes.voteImpact;
  const { title, subtitle } = chartDescriptions.voteImpact;
  const [data, setData] = useState<Vote[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('integrity, proximity, impact')
      .eq('campaign_id', campaignId);

    if (votes) setData(votes);
  };

  useEffect(() => {
    if (!campaignId) return;
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
    return <p className="text-sm" style={{ color: theme.primary }}>Loading impact matrix...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.primary} />
          <XAxis
            dataKey="integrity"
            name="Integrity"
            type="number"
            domain={[0, 1]}
            stroke={theme.primary}
            tick={{ fill: theme.primary, fontSize: theme.fontSize }}
          />
          <YAxis
            dataKey="proximity"
            name="Proximity"
            type="number"
            domain={[0, 1]}
            stroke={theme.primary}
            tick={{ fill: theme.primary, fontSize: theme.fontSize }}
          />
          <ZAxis dataKey="impact" range={[60, 200]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
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
