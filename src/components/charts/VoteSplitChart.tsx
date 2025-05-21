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

type Props = {
  campaignId: string;
};

type Vote = {
  choice: 'yes' | 'no';
  campaign_id: string;
};

export default function VoteSplitChart({ campaignId }: Props) {
  const theme = chartThemes.voteSplit;
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

    const yesVotes = data.filter((v: Vote) => v.choice === 'yes').length;
    const noVotes = data.length - yesVotes;

    setVoteData([
      { name: 'Yes', value: yesVotes },
      { name: 'No', value: noVotes },
    ]);
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchVotes();

    const channel = supabase
      .channel('votes:split')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (voteData.length === 0) {
    return <p className="text-sm" style={{ color: theme.primary }}>Loading vote data...</p>;
  }

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: theme.background }}>
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
            animationBegin={0}
            animationDuration={800}
            isAnimationActive={true}
          >
            <Cell fill={theme.primary} />
            <Cell fill={theme.secondary} />
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
    </div>
  );
}
