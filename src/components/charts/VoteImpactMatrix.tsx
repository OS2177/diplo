import { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
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
  const theme = chartThemes.voteImpactMatrix;
  const { title, subtitle } = chartDescriptions.voteImpactMatrix;
  const [votes, setVotes] = useState<Vote[]>([]);

  const fetchVotes = async () => {
    const { data: voteData } = await supabase
      .from('votes')
      .select('integrity, proximity, impact')
      .eq('campaign_id', campaignId);

    if (Array.isArray(voteData)) setVotes(voteData);
    else setVotes([]);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:impact-matrix')
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
    return <p className="text-sm text-gray-500">Loading vote impact matrix...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="proximity" name="Proximity" domain={[0, 1]} />
          <YAxis type="number" dataKey="integrity" name="Integrity" domain={[0, 1]} />
          <ZAxis type="number" dataKey="impact" range={[50, 300]} name="Impact" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            name="Votes"
            data={safeVotes}
            fill={theme.primary}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
