
import { Campaign } from "@/components/CampaignTile";

export interface VoteResult {
  id: string;
  title: string;
  daysEnded: number;
  inFavor: number;
  countriesParticipated: number;
  totalVotes: number;
}

export const recentResults: VoteResult[] = [
  {
    id: "1",
    title: "Digital Rights Protection",
    daysEnded: 2,
    inFavor: 78,
    countriesParticipated: 45,
    totalVotes: 15234
  },
  {
    id: "2",
    title: "Climate Action Initiative",
    daysEnded: 5,
    inFavor: 82,
    countriesParticipated: 52,
    totalVotes: 18756
  },
  {
    id: "3",
    title: "Education Access Treaty",
    daysEnded: 8,
    inFavor: 91,
    countriesParticipated: 38,
    totalVotes: 12453
  }
];

export const resolvedCampaigns = recentResults.map(result => ({
  ...result,
  status: 'resolved',
  resolution: result.inFavor > 50 ? 'passed' : 'rejected',
  resolutionDate: new Date(Date.now() - result.daysEnded * 24 * 60 * 60 * 1000).toISOString()
}));
