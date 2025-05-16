import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { DIPLO_COLORS, chartWrapperStyle } from '../../styles/chartStyles';

type Props = {
  campaignId: string;
};

type Vote = {
  choice: 'yes' | 'no';
  campaign_id: string;
};

const COLORS = [DIPLO_COLORS.foreground, DIPLO_COLORS.foreground];

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
    return <p className="text-sm" style={{ color: DIPLO_COLORS.foreground }}>Loading vote data...</p>;
  }

  return (
    <div style={chartWrapperStyle}>
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
            label={{ fill: DIPLO_COLORS.foreground, fontSize: 10 }}
          >
            {voteData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: DIPLO_COLORS.background,
              border: `1px solid ${DIPLO_COLORS.foreground}`,
              fontSize: '10px',
              color: DIPLO_COLORS.foreground,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
