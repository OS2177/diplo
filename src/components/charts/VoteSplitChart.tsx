import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type Props = {
  campaignId: string;
};

type Vote = {
  choice: 'yes' | 'no';
  campaign_id: string;
};

const COLORS = ['#34D399', '#EF4444'];

export default function VoteSplitChart({ campaignId }: Props) {
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

  if (voteData.length === 0) {
    return <p className="text-sm text-gray-500">Loading vote data...</p>;
  }

  return (
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
          label
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {voteData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
