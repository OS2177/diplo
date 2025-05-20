// src/components/charts/VotePulseChart.tsx

import { useEffect, useState } from 'react';
import { animated, useSpring, config } from '@react-spring/web';
import { supabase } from '../../lib/supabaseClient';
import { DIPLO_COLORS } from '../../styles/chartStyles';

type Props = {
  campaignId: string;
};

type Pulse = {
  id: string;
  timestamp: number;
  impact: number;
  isHeartbeat?: boolean;
};

export default function VotePulseChart({ campaignId }: Props) {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  const addPulse = (impact: number = 1, isHeartbeat = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newPulse: Pulse = {
      id,
      timestamp: Date.now(),
      impact,
      isHeartbeat,
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
      addPulse(0.5, true); // Default heartbeat if no votes yet
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

    const heartbeatInterval = setInterval(() => {
      addPulse(0.3, true);
    }, 6000); // Every 6 seconds — gentle baseline pulse

    return () => {
      supabase.removeChannel(channel);
      clearInterval(heartbeatInterval);
    };
  }, [campaignId]);

  return (
    <div className="relative h-[250px] w-full overflow-hidden" style={{ backgroundColor: DIPLO_COLORS.background }}>
      {pulses.map((pulse) => (
        <Ripple key={pulse.id} impact={pulse.impact} isHeartbeat={pulse.isHeartbeat} />
      ))}
    </div>
  );
}

function Ripple({ impact, isHeartbeat = false }: { impact: number; isHeartbeat?: boolean }) {
  const color = isHeartbeat ? DIPLO_COLORS.heartbeat : DIPLO_COLORS.foreground;

  const { scale, opacity } = useSpring({
    from: { scale: 0.2, opacity: 0.9 },
    to: { scale: 2.8 + impact * 2, opacity: 0 },
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
        borderRadius: '9999px',
        border: `2px solid ${color}`,
        transform: scale.to((s) => `translate(-50%, -50%) scale(${s})`),
        opacity,
      }}
    />
  );
}
