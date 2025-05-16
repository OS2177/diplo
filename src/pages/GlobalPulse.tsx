import React from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';

export default function GlobalPulse() {
  const campaigns = useCampaigns();

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const aScore = a.campaign_integrity ?? 0;
    const bScore = b.campaign_integrity ?? 0;
    return bScore - aScore; // High to low
  });

  if (!campaigns.length) {
    return <div className="p-6 text-center">No campaigns yet. Be the first to create one!</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">🌐 Global Pulse</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCampaigns.map((c) => (
          <Link
            key={c.id}
            to={`/campaign/${c.id}`}
            className="border rounded-xl p-4 hover:shadow-md transition bg-white"
          >
            {c.image && (
              <div className="w-full h-40 mb-3 overflow-hidden rounded">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h2 className="text-lg font-bold mb-1">{c.title}</h2>
            <p className="text-sm text-gray-700 line-clamp-3">{c.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-indigo-500 font-medium">
                Scope: {c.scope}
              </span>
              {c.campaign_integrity !== undefined && (
                <span className="text-xs text-green-700 font-semibold">
                  {Math.round(c.campaign_integrity * 100)}% Integrity
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
