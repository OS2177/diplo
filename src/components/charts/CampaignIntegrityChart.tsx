import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import { formatTimestamp } from '../../utils/chartUtils';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Props = {
  campaignId: string;
};

type Vote = {
  created_at: string;
  integrity: number;
};

type Point = {
  time: string;
  integrity: number;
};

export default function CampaignIntegrityChart({ campaignId }: Props) {
  const theme = chartThemes.campaignIntegrity;
  const { title, subtitle } = chartDescriptions.campaignIntegrity;
  const [data, setData] = useState<Point[]>([]);

  const fetchData = async () => {
    const { data: campaignData } = await supabase
      .from('campaigns')
      .select('creator_integrity')
      .eq('id', campaignId)
      .single();

    const creatorIntegrity = campaignData?.creator_integrity ?? 0;

    const { data: voteData } = await supabase
      .from('votes')
      .select('integrity, created_at')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true });

    const cumulative: Point[] = [];

    voteData?.forEach((vote: Vote, index: number) => {
      const avgVoteIntegrity =
        voteData.slice(0, index + 1).reduce((sum, v) => sum + v.integrity, 0) / (index + 1);

      const voteCountScore = Math.min((index + 1) / 100, 1);

      const integrity = parseFloat(
        (
          0.5 * creatorIntegrity +
          0.3 * avgVoteIntegrity +
          0.2 * voteCountScore
        ).toFixed(3)
      );

      cumulative.push({
        time: formatTimestamp(vote.created_at),
        integrity
      });
    });

    setData(cumulative);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchData();

    const channel = supabase
      .channel('votes:integrity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading integrity chart...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.primary} />
          <XAxis dataKey="time" tick={{ fontSize: theme.fontSize, fill: theme.primary }} />
          <YAxis domain={[0, 1]} stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
          <Line
            type="monotone"
            dataKey="integrity"
            stroke={theme.primary}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
