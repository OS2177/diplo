import { Link } from 'react-router-dom';

type Campaign = {
  id: string;
  title: string;
  description: string;
  scope?: string;
  image?: string;
  url?: string;
  created_at?: string;
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-4 border border-gray-100">
      <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{campaign.scope}</p>
      <p className="text-gray-700">{campaign.description}</p>
      {campaign.url && (
        <a href={campaign.url} className="text-blue-600 underline mt-2 block" target="_blank">
          Learn more
        </a>
      )}
    </div>
  );
}