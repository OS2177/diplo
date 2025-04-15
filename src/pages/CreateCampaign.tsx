
import Header from '../components/Header';

export default function CreateCampaign() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
        <form className="max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Campaign Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
