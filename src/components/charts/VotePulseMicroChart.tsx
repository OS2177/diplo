// src/components/charts/VotePulseMicroChart.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
  LineChart, Line, ResponsiveContainer
} from 'recharts';

type Props = {
  campaignId: string;
};

export default function VotePulseMicroChart({ campaignId }: Props) {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: votes } = await supabase
        .from('votes')
        .select('created_at')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true });

      if (!votes) return;

      const pulseData = votes.reduce((acc: Record<string, number>, vote) => {
        const hour = new Date(vote.created_at).toISOString().slice(0, 13); // hour-level
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(pulseData).map(([time, value]) => ({
        time,
        value,
      }));

      setData(chartData);
    };

    if (campaignId) fetchData();
  }, [campaignId]);

  return (
    <div className="w-full h-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
