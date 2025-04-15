
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to Diplo</h1>
      <p className="text-xl mb-8">A collective diplomacy platform</p>
      <button 
        onClick={() => navigate('/login')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Get Started
      </button>
    </div>
  );
}
