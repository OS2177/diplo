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

type Props = {
  campaignId: string;
};

type Vote = {
  gender: string;
};

export default function VoterGenderDistributionChart({ campaignId }: Props) {
  const theme = chartThemes.genderDistribution;
  const [voteData, setVoteData] = useState<{ name: string; value: number }[]>([]);

  const fetchVotes = async () => {
    const { data, error } = await supabase
      .from('votes')
      .select('gender')
      .eq('campaign_id', campaignId);

    if (error) {
      console.error('Error fetching gender votes:', error);
      return;
    }

    const counts: Record<string, number> = {};

    data?.forEach((v: Vote) => {
      const g = v.gender?.toLowerCase() || 'unspecified';
      counts[g] = (counts[g] || 0) + 1;
    });

    const result = Object.entries(counts).map(([name, value]) => ({ name, value }));
    setVoteData(result);
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

  if (voteData.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading gender breakdown...</p>;

  const colorPalette = ['#C084FC', '#F472B6', '#60A5FA', '#FBBF24', '#A5B4FC'];

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={voteData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            label={{ fill: theme.primary, fontSize: theme.fontSize }}
          >
            {voteData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              fontSize: `${theme.fontSize}px`,
              color: theme.tooltipText,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
