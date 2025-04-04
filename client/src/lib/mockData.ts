export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  daysLeft: number;
  scope: "Global" | "Regional";
  region?: string;
  votes: number;
  sponsor: {
    name: string;
    colorClass: string;
  };
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface VoteResult {
  id: string;
  title: string;
  daysEnded: number;
  inFavor: number;
  totalVotes: number;
  countriesParticipated: number;
}

export interface ResolvedCampaign {
  id: string;
  title: string;
  summary: string;
  type: string;
  status: string;
  totalVotes: number;
  inFavor: number;
  countriesParticipated: number;
  daysEnded: number;
}

export const resolvedCampaigns: ResolvedCampaign[] = [
  {
    id: "resolved-1",
    title: "Global Climate Action",
    summary: "Worldwide initiative for climate change mitigation",
    type: "Global",
    status: "resolved",
    totalVotes: 15000,
    inFavor: 68,
    countriesParticipated: 45,
    daysEnded: 5
  },
  {
    id: "resolved-2", 
    title: "Digital Privacy Standards",
    summary: "Setting new standards for online privacy protection",
    type: "Global",
    status: "resolved",
    totalVotes: 12000,
    inFavor: 72,
    countriesParticipated: 38,
    daysEnded: 8
  }
];

export const recentResults: VoteResult[] = [
  {
    id: "123",
    title: "Clean Water Access",
    daysEnded: 2,
    inFavor: 85,
    totalVotes: 24532,
    countriesParticipated: 127
  },
  {
    id: "456",
    title: "Educational Resources Treaty",
    daysEnded: 5,
    inFavor: 62,
    totalVotes: 18945,
    countriesParticipated: 94
  }
];

export const userCampaigns = [
  {
    id: "123",
    title: "Climate Action Vote",
    colorClass: "bg-secondary-light"
  },
  {
    id: "456",
    title: "Ocean Protection",
    colorClass: "bg-accent-light"
  },
  {
    id: "789",
    title: "Digital Rights Treaty",
    colorClass: "bg-primary-light"
  }
];

export const userProfile = {
  name: "Alex Morgan",
  role: "UN Ambassador",
  avatar: "https://i.pravatar.cc/40?img=68"
};

import { useState } from 'react';
import IntegrityVotingCard from '../components/IntegrityVotingCard';
import campaignData from '../data/campaigns.json';

export default function IntegrityVote() {
  const initialPending = campaignData
    .filter(c => c.status === 'pending')
    .map(c => ({ ...c, upvotes: 0, downvotes: 0 }));

  const [pendingCampaigns, setPendingCampaigns] = useState(initialPending);
  const [liveCampaigns, setLiveCampaigns] = useState([]);

  const handleVote = (id, vote) => {
    setPendingCampaigns(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              upvotes: vote === 'up' ? c.upvotes + 1 : c.upvotes,
              downvotes: vote === 'down' ? c.downvotes + 1 : c.downvotes
            }
          : c
      )
    );
  };

  const promoteToLive = (id) => {
    const campaign = pendingCampaigns.find(c => c.id === id);
    if (campaign && campaign.upvotes - campaign.downvotes >= 3) {
      setLiveCampaigns([...liveCampaigns, { ...campaign, status: 'live' }]);
      setPendingCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="heading">Integrity Voting</h1>
      {pendingCampaigns.map(campaign => (
        <div key={campaign.id}>
          <IntegrityVotingCard campaign={campaign} onVote={handleVote} />
          <button className="button-primary" onClick={() => promoteToLive(campaign.id)}>
            Promote to Live (Threshold: 3+ net votes)
          </button>
        </div>
      ))}

      {liveCampaigns.length > 0 && (
        <div className="tile">
          <h2 className="heading">Promoted Campaigns</h2>
          {liveCampaigns.map(c => (
            <p key={c.id} className="caption">{c.title} is now live!</p>
          ))}
        </div>
      )}
    </div>
  );
}

import campaignData from '../data/campaigns.json';

export default function ResultsPage() {
  const resolvedCampaigns = campaignData.filter(c => c.status === 'resolved');

  return (
    <div>
      <h1 className="heading">Archived Campaigns</h1>
      {resolvedCampaigns.length === 0 && <p className="caption">No archived campaigns yet.</p>}
      {resolvedCampaigns.map(c => (
        <div key={c.id} className="tile">
          <h2 className="heading">{c.title}</h2>
          <p className="caption">{c.summary}</p>
        </div>
      ))}
    </div>
  );
}