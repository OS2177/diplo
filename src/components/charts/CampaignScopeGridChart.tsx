import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';
import { chartThemes } from '../../styles/chartThemes';
import DiploChartWrapper from '../DiploChartWrapper';
import { chartDescriptions } from '../../constants/ChartDescriptions';

type Campaign = {
  scope: string;
};

type Bin = {
  label: string;
  count: number;
};

export default function CampaignScopeGridChart() {
  const theme = chartThemes.campaignScope;
  const { title, subtitle } = chartDescriptions.campaignScope;
  const [data, setData] = useState<Bin[]>([]);

  const fetchScopes = async () => {
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('scope');

    const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

    const counts: Record<string, number> = {};

    safeCampaigns.forEach((campaign: Campaign) => {
      const scope = campaign.scope || 'Unspecified';
      counts[scope] = (counts[scope] || 0) + 1;
    });

    const formatted: Bin[] = Object.entries(counts).map(([label, count]) => ({ label, count }));
    setData(formatted);
  };

  useEffect(() => {
    fetchScopes();

    const channel = supabase
      .channel('campaigns:scope')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'campaigns' }, () => {
        fetchScopes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0)
    return <p className="text-sm text-gray-500">Loading campaign scopes...</p>;

  return (
    <DiploChartWrapper background={theme.background} borderColor={theme.primary}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: theme.primary }}>{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill={theme.primary} />
        </BarChart>
      </ResponsiveContainer>
    </DiploChartWrapper>
  );
}
