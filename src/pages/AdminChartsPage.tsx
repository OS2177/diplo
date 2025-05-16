export default function AdminChartsPage() {
  return (
    <div className="min-h-screen bg-[#EEEDE5] p-6">
      <h1 className="text-2xl font-bold mb-4">✅ Admin Charts (Phase 1)</h1>

      <div className="mb-6">
        <label htmlFor="campaign" className="block mb-2 text-lg font-medium">
          Select Campaign
        </label>
        <select
          id="campaign"
          className="w-full p-2 rounded border border-gray-300"
        >
          <option>Example Campaign A</option>
          <option>Example Campaign B</option>
        </select>
      </div>
    </div>
  );
}
