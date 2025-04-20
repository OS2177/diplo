// src/pages/GlobalPulse.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';

export default function GlobalPulse() {
  const campaigns = useCampaigns();

  if (!campaigns.length) {
    return <div className="p-6 text-center">No campaigns yet. Be the first to create one!</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">🌐 Global Pulse</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            to={`/campaign/${c.id}`}
            className="border rounded-xl p-4 hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-bold mb-1">{c.title}</h2>
            <p className="text-sm text-gray-700 line-clamp-3">{c.description}</p>
            <span className="text-xs text-indigo-500 font-medium mt-2 inline-block">
              Scope: {c.scope}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
