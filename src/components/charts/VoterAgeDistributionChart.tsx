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
  campaign_id: string;
};

type Bin = {
  label: string;
  count: number;
};

export default function VoterAgeDistributionChart({ campaignId }: Props) {
  const theme = chartThemes.voterAge;
  const { title, subtitle } = chartDescriptions.voterAge;
  const [data, setData] = useState<Bin[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('age')
      .eq('campaign_id', campaignId);

    const safeVotes = Array.isArray(votes) ? votes : [];

    const bins: Bin[] = [
      { label: '<18', count: 0 },
      { label: '18–25', count: 0 },
      { label: '26–35', count: 0 },
      { label: '36–50', count: 0 },
      { label: '51–65', count: 0 },
      { label: '65+', count: 0 }
    ];

    safeVotes.forEach((vote: Vote) => {
      const age = vote.age;
      if (age < 18) bins[0].count += 1;
      else if (age <= 25) bins[1].count += 1;
      else if (age <= 35) bins[2].count += 1;
      else if (age <= 50) bins[3].count += 1;
      else if (age <= 65) bins[4].count += 1;
      else bins[5].count += 1;
    });

    setData(bins);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:age-dist')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0)
    return <p className="text-sm text-gray-500">Loading age distribution...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill={theme.primary} />
        </BarChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
