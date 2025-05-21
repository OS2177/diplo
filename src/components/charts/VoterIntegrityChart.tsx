import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
  campaign_id: string;
};

type Bin = {
  label: string;
  count: number;
};

export default function VoterIntegrityChart({ campaignId }: Props) {
  const theme = chartThemes.voterIntegrity;
  const { title, subtitle } = chartDescriptions.voterIntegrity;
  const [data, setData] = useState<Bin[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('integrity')
      .eq('campaign_id', campaignId);

    const bins: Bin[] = [
      { label: '0.0–0.2', count: 0 },
      { label: '0.2–0.4', count: 0 },
      { label: '0.4–0.6', count: 0 },
      { label: '0.6–0.8', count: 0 },
      { label: '0.8–1.0', count: 0 },
    ];

    votes?.forEach((vote: Vote) => {
      const i = vote.integrity;
      if (i < 0.2) bins[0].count += 1;
      else if (i < 0.4) bins[1].count += 1;
      else if (i < 0.6) bins[2].count += 1;
      else if (i < 0.8) bins[3].count += 1;
      else bins[4].count += 1;
    });

    setData(bins);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:integrity-hist')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading voter integrity...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.primary} />
          <XAxis dataKey="label" stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <YAxis allowDecimals={false} stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
          <Bar dataKey="count" fill={theme.primary} />
        </BarChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
