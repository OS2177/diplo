import { useChartVisibility } from '../context/ChartVisibilityContext';

export default function ChartSettingsDropdown() {
  const { visibility, toggleChart } = useChartVisibility();

  const chartLabels: { key: keyof typeof visibility; label: string }[] = [
    { key: 'campaignIntegrity', label: '📈 Campaign Integrity' },
    { key: 'campaignScope', label: '🌐 Campaign Scope Grid' },
    { key: 'communityIntegrityMap', label: '🔥 Community Integrity Map' },
    { key: 'proximityReach', label: '🌍 Proximity Reach' },
    { key: 'voteImpactMatrix', label: '🧠 Vote Impact Matrix' },
    { key: 'voteMap', label: '🗺 Vote Map' },
    { key: 'voteMomentum', label: '📊 Vote Momentum' },
    { key: 'voteOriginMap', label: '📡 Vote Origin Map' },
    { key: 'votePulse', label: '💓 Vote Pulse' },
    { key: 'voterAge', label: '👥 Voter Age Distribution' },
    { key: 'voterGender', label: '⚧ Voter Gender Distribution' },
    { key: 'voterIntegrity', label: '🔐 Voter Integrity Distribution' },
    { key: 'voteSplit', label: '☯️ Vote Split' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-2 text-indigo-700">📊 Chart Display Settings</h2>
      <p className="text-sm text-gray-600 mb-4">Toggle which charts appear on campaign cards.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {chartLabels.map(({ key, label }) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visibility[key]}
              onChange={() => toggleChart(key)}
              className="accent-indigo-500"
            />
            <span className="text-sm text-gray-800">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
