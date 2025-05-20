// src/components/charts/VotePulseChart.tsx

import { useEffect, useState } from 'react';
import { animated, useSpring, useSprings, config } from '@react-spring/web';
import { supabase } from '../../lib/supabaseClient';
import { DIPLO_COLORS } from '../../styles/chartStyles';

type Props = {
  campaignId: string;
};

type Pulse = {
  id: string;
  timestamp: number;
  impact: number;
};

export default function VotePulseChart({ campaignId }: Props) {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  const addPulse = (impact: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newPulse: Pulse = {
      id,
      timestamp: Date.now(),
      impact,
    };
    setPulses((prev) => [...prev.slice(-10), newPulse]);
  };

  const fetchInitialVotes = async () => {
    const { data } = await supabase
      .from('votes')
      .select('created_at, impact')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      data.forEach((v: any) => addPulse(v.impact));
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    fetchInitialVotes();

    const channel = supabase
      .channel('votes:pulse')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) {
          addPulse(payload.new.impact || 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return (
    <div
      className="relative"
      style={{
        width: 256,
        height: 256,
        backgroundColor: DIPLO_COLORS.offWhite,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      <svg width={256} height={256}>
        <BaseConcentricRings center={128} count={10} spacing={12} />
      </svg>
      {pulses.map((pulse) => (
        <VoteRipple key={pulse.id} impact={pulse.impact} />
      ))}
    </div>
  );
}

function BaseConcentricRings({ center, count, spacing }: { center: number; count: number; spacing: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const radius = spacing * (i + 1);
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            stroke="#000"
            strokeWidth={1.5}
            fill="none"
          />
        );
      })}
    </>
  );
}

function VoteRipple({ impact }: { impact: number }) {
  const styles = useSpring({
    from: { r: 0, opacity: 0.9 },
    to: { r: 140 + impact * 5, opacity: 0 },
    config: config.slow,
    reset: true,
  });

  return (
    <animated.svg
      width={256}
      height={256}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <animated.circle
        cx={128}
        cy={128}
        stroke="#000"
        strokeWidth={2}
        fill="none"
        style={{
          r: styles.r,
          opacity: styles.opacity,
        }}
      />
    </animated.svg>
  );
}

