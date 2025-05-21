// src/components/charts/VoterAgeChart.tsx

import { useEffect, useState } from 'react';
import { animated, useSprings, config } from '@react-spring/web';
import { supabase } from '../../lib/supabaseClient';
import { CHART_THEMES } from '../../styles/chartStyles';

type Props = {
  campaignId: string;
};

const AGE_BRACKETS = ['18–24', '25–34', '35–44', '45–54', '55+'];

export default function VoterAgeChart({ campaignId }: Props) {
  const theme = CHART_THEMES.blackAndOffWhite;
  const [ageCounts, setAgeCounts] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!campaignId) return;

    const fetchVotes = async () => {
      const { data: votes, error } = await supabase
        .from('votes')
        .select('user_id, campaign_id, profiles(age)')
        .eq('campaign_id', campaignId);

      if (votes && !error) {
        const counts = [0, 0, 0, 0, 0];
        votes.forEach((vote: any) => {
          const age = vote.profiles?.age;
          if (age < 25) counts[0]++;
          else if (age < 35) counts[1]++;
          else if (age < 45) counts[2]++;
          else if (age < 55) counts[3]++;
          else counts[4]++;
        });
        setAgeCounts(counts);
      }
    };

    fetchVotes();
  }, [campaignId]);

  const springs = useSprings(
    ageCounts.length,
    ageCounts.map((count) => ({
      to: { height: count * 10 },
      from: { height: 0 },
      config: config.gentle,
    }))
  );

  return (
    <div
      style={{
        width: 256,
        height: 256,
        backgroundColor: theme.background,
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: '0 8px',
      }}
    >
      {springs.map((style, i) => (
        <animated.div
          key={i}
          style={{
            width: 16,
            height: style.height,
            backgroundColor: theme.foreground,
            borderRadius: 4,
          }}
          title={AGE_BRACKETS[i]}
        />
      ))}
    </div>
  );
}
