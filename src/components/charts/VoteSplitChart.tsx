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
  choice: 'yes' | 'no';
  campaign_id: string;
};

const COLORS = ['#34D399', '#EF4444'];

export default function VoteSplitChart({ campaignId }: Props) {
  const theme = chartThemes.voteSplit;
  const { title, subtitle } = chartDescriptions.voteSplit;
  const [voteData, setVoteData] = useState<{ name: string; value: number }[]>([]);

  const fetchVotes = async () => {
    const { data, error } = await supabase
      .from('votes')
      .select('choice')
      .eq('campaign_id', campaignId);

    if (error) {
      console.error('Error fetching votes:', error);
      return;
    }

    const safeData = Array.isArray(data) ? data : [];

    const yesVotes = safeData.filter((v: Vote) => v.choice === 'yes').length;
    const noVotes = safeData.length - yesVotes;

    setVoteData([
      { name: 'Yes', value: yesVotes },
      { name: 'No', value: noVotes }
    ]);
  };

  useEffect(() => {
    if (!campaignId) return;

    fetchVotes();

    const channel = supabase
      .channel('votes:realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          const newVote = payload.new as Vote;
          if (newVote.campaign_id === campaignId) {
            fetchVotes();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  const safeVoteData = Array.isArray(voteData) ? voteData : [];

  if (safeVoteData.length === 0) {
    return <p className="text-sm text-gray-500">Loading vote data...</p>;
  }

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={safeVoteData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            label
          >
            {safeVoteData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
