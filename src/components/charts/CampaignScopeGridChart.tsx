import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';

type ScopeBin = {
  scope: string;
  count: number;
};

export default function CampaignScopeGridChart() {
  const theme = chartThemes.scopeGrid;
  const [data, setData] = useState<ScopeBin[]>([]);

  const fetchScopes = async () => {
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('scope');

    const bins: Record<string, number> = {};

    campaigns?.forEach((c) => {
      const scope = (c.scope || 'Unspecified').toLowerCase();
      bins[scope] = (bins[scope] || 0) + 1;
    });

    setData(Object.entries(bins).map(([scope, count]) => ({ scope, count })));
  };

  useEffect(() => {
    fetchScopes();
  }, []);

  if (data.length === 0)
    return <p className="text-sm" style={{ color: theme.primary }}>Loading campaign scopes...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.primary} />
          <XAxis dataKey="scope" stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <YAxis allowDecimals={false} stroke={theme.primary} tick={{ fill: theme.primary, fontSize: theme.fontSize }} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.primary}`,
              color: theme.tooltipText,
              fontSize: theme.fontSize,
            }}
          />
          <Bar dataKey="count" fill={theme.primary} />
        </BarChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
