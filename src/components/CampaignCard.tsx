
import { Link } from 'react-router-dom';

export default function CampaignCard({ campaign }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {campaign.image && (
        <img 
          src={campaign.image} 
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 mb-4">{campaign.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {campaign.region || campaign.scope}
          </span>
          {campaign.url && (
            <Link 
              to={campaign.url}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
