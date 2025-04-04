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
  radius?: number; // Radius in kilometers
}

export interface VoteResult {
  id: string;
  title: string;
  daysEnded: number;
  inFavor: number;
  totalVotes: number;
  countriesParticipated: number;
}

export const activeCampaigns: Campaign[] = [
  {
    id: "123",
    title: "Climate Action Resolution",
    description: "Vote on the proposed framework for carbon neutrality targets by 2050.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    daysLeft: 3,
    scope: "Global",
    votes: 16439,
    sponsor: {
      name: "UN sponsored",
      colorClass: "bg-secondary-light"
    },
    latitude: 40.7128, // New York
    longitude: -74.0060,
    radius: 3000 // Global campaigns have large radius
  },
  {
    id: "456",
    title: "Ocean Protection Initiative",
    description: "Weigh in on coordinated efforts to reduce plastic waste in oceans.",
    image: "https://images.unsplash.com/photo-1566410845935-2fb3b3eb1ce1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    daysLeft: 5,
    scope: "Regional",
    region: "Americas",
    votes: 8753,
    sponsor: {
      name: "WWF sponsored",
      colorClass: "bg-accent-light"
    },
    latitude: 25.7617, // Miami
    longitude: -80.1918,
    radius: 500 // Regional campaigns have medium radius
  },
  {
    id: "789",
    title: "Digital Rights Treaty",
    description: "Vote on international standards for digital privacy and data protection.",
    image: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    daysLeft: 7,
    scope: "Global",
    votes: 12201,
    sponsor: {
      name: "EU sponsored",
      colorClass: "bg-primary-light"
    },
    latitude: 50.8503, // Brussels
    longitude: 4.3517,
    radius: 2000 // Global campaigns have large radius
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
