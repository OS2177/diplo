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
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Props = {
  campaignId: string;
};

type Vote = {
  age: number;
};

type AgeBin = {
  label: string;
  count: number;
};

export default function VoterAgeDistributionChart({ campaignId }: Props) {
  const theme = chartThemes.ageDistribution;
  const { title, subtitle } = chartDescriptions.ageDistribution;
  const [data, setData] = useState<AgeBin[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('age')
      .eq('campaign_id', campaignId);

    const bins: AgeBin[] = [
      { label: '18–24', count: 0 },
      { label: '25–34', count: 0 },
      { label: '35–44', count: 0 },
      { label: '45–54', count: 0 },
      { label: '55–64', count: 0 },
      { label: '65+', count: 0 },
    ];

    votes?.forEach((vote: Vote) => {
      const a = vote.age;
      if (a >= 18 && a <= 24) bins[0].count++;
      else if (a <= 34) bins[1].count++;
      else if (a <= 44) bins[2].count++;
      else if (a <= 54) bins[3].count++;
      else if (a <= 64) bins[4].count++;
      else if (a >= 65) bins[5].count++;
    });

    setData(bins);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:age')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading age distribution...</p>;

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
