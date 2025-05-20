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
    } else {
      addPulse(0.5); // Fallback visual on first load
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
    <div className="relative h-[250px] w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: DIPLO_COLORS.background }}>
      <RadarRings count={10} />
      {pulses.map((pulse) => (
        <Ripple key={pulse.id} impact={pulse.impact} />
      ))}
    </div>
  );
}

function RadarRings({ count = 10 }: { count: number }) {
  const springs = useSprings(
    count,
    new Array(count).fill(0).map((_, i) => ({
      from: { scale: 0.1, opacity: 0.4 },
      to: async (next) => {
        while (true) {
          await next({ scale: 3, opacity: 0 });
          await next({ scale: 0.1, opacity: 0.4 });
        }
      },
      config: {
        duration: 3000 + i * 100,
      },
      delay: i * 250,
      loop: true,
    }))
  );

  return (
    <>
      {springs.map((style, index) => (
        <animated.div
          key={index}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `1px solid ${DIPLO_COLORS.foreground}`,
            transform: style.scale.to((s) => `translate(-50%, -50%) scale(${s})`),
            opacity: style.opacity,
          }}
        />
      ))}
    </>
  );
}

function Ripple({ impact }: { impact: number }) {
  const { scale, opacity } = useSpring({
    from: { scale: 0.1, opacity: 1 },
    to: { scale: 3 + impact * 1.2, opacity: 0 },
    config: config.slow,
    reset: true,
  });

  return (
    <animated.div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: `2px solid ${DIPLO_COLORS.foreground}`,
        transform: scale.to((s) => `translate(-50%, -50%) scale(${s})`),
        opacity,
      }}
    />
  );
}
