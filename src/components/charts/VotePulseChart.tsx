import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';

type Props = {
  campaignId: string;
};

type Pulse = {
  time: string;
  count: number;
};

export default function VotePulseChart({ campaignId }: Props) {
  const theme = chartThemes.votePulse;
  const [data, setData] = useState<Pulse[]>([]);

  useEffect(() => {
    if (!campaignId) return;

    const updatePulse = async () => {
      const { data: votes } = await supabase
        .from('votes')
        .select('created_at')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true });

      const now = Date.now();
      const interval = 1000 * 30; // 30s pulse window
      const grouped = new Array(10).fill(0).map((_, i) => {
        const t = now - interval * (9 - i);
        return { time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), count: 0 };
      });

      votes?.forEach((v) => {
        const voteTime = new Date(v.created_at).getTime();
        const i = Math.floor((voteTime - (now - interval * 10)) / interval);
        if (i >= 0 && i < grouped.length) {
          grouped[i].count++;
        }
      });

      setData(grouped);
    };

    updatePulse();

    const channel = supabase
      .channel('votes:pulse')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        if (payload.new.campaign_id === campaignId) updatePulse();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Pulsing data...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <YAxis stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={theme.primary}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
