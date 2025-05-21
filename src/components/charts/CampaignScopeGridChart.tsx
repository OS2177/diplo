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
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Campaign = {
  scope: string;
};

export default function CampaignScopeGridChart() {
  const theme = chartThemes.scopeGrid;
  const { title, subtitle } = chartDescriptions.scopeGrid;
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  const fetchCampaigns = async () => {
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('scope')
      .eq('status', 'approved');

    const countByScope: Record<string, number> = {};

    campaigns?.forEach((c: Campaign) => {
      const s = c.scope?.toLowerCase() || 'unspecified';
      countByScope[s] = (countByScope[s] || 0) + 1;
    });

    setData(
      Object.entries(countByScope).map(([name, value]) => ({ name, value }))
    );
  };

  useEffect(() => {
    fetchCampaigns();

    const channel = supabase
      .channel('campaigns:scopegrid')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'campaigns' }, () => {
        fetchCampaigns();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading scope chart...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={theme.colors[index % theme.colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
