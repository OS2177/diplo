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

// Example campaigns data for active campaigns
export const activeCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    title: "Clean Ocean Initiative",
    description: "Global effort to reduce plastic pollution in oceans",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    daysLeft: 12,
    scope: "Global",
    votes: 15482,
    sponsor: {
      name: "Ocean Alliance",
      colorClass: "text-blue-600"
    },
    latitude: 34.0522,
    longitude: -118.2437,
    radius: 5000
  },
  {
    id: "campaign-2",
    title: "Renewable Energy Transition",
    description: "Accelerating the global shift to renewable energy sources",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    daysLeft: 8,
    scope: "Global",
    votes: 12901,
    sponsor: {
      name: "Climate Coalition",
      colorClass: "text-green-600"
    }
  }
];