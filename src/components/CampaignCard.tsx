
export default function CampaignCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Campaign Title</h3>
        <p className="text-gray-600 mb-4">Campaign description goes here...</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Votes: 42</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Vote
          </button>
        </div>
      </div>
    </div>
  );
}
