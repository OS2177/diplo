
import Header from '../components/Header';
import ProfileIntegrity from '../components/ProfileIntegrity';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProfileIntegrity />
          </div>
        </div>
      </main>
    </div>
  );
}
