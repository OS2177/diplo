import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Props = {
  campaignId: string;
};

type Vote = {
  gender: string;
};

const COLORS = ['#818CF8', '#EC4899', '#FBBF24'];

export default function VoterGenderDistributionChart({ campaignId }: Props) {
  const theme = chartThemes.genderDistribution;
  const { title, subtitle } = chartDescriptions.genderDistribution;
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('gender')
      .eq('campaign_id', campaignId);

    const counts: Record<string, number> = {};

    votes?.forEach((v: Vote) => {
      const g = v.gender?.toLowerCase() || 'unspecified';
      counts[g] = (counts[g] || 0) + 1;
    });

    setData(
      Object.entries(counts).map(([name, value]) => ({ name, value }))
    );
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:gender')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading gender distribution...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
