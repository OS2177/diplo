import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
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
  gender: string;
  campaign_id: string;
};

export default function VoterGenderDistributionChart({ campaignId }: Props) {
  const theme = chartThemes.voterGender;
  const { title, subtitle } = chartDescriptions.voterGender;
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  const COLORS = ['#6366F1', '#EC4899', '#FBBF24', '#10B981', '#A855F7'];

  const fetchVotes = async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('gender')
      .eq('campaign_id', campaignId);

    const safeVotes = Array.isArray(votes) ? votes : [];

    const genderCounts: Record<string, number> = {};

    safeVotes.forEach((vote: Vote) => {
      const gender = vote.gender || 'Unspecified';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    const formatted = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));
    setData(formatted);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:gender-dist')
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
    return <p className="text-sm text-gray-500">Loading gender data...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={safeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {safeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
