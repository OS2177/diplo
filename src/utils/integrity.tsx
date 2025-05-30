import { calculateDistance } from './calculateDistance';

// --- 1️⃣ USER INTEGRITY ---
export function calculateUserIntegrity(profile: any): number {
  let score = 0;
  if (profile?.location_permission) score += 0.2;
  if (profile?.name && profile?.email && profile?.age && profile?.city && profile?.country && profile?.gender) score += 0.2;
  if (profile?.two_factor_enabled) score += 0.2;
  if (profile?.blockchain_id) score += 0.3;
  if (profile?.community_verified) score += 0.1;
  return Math.min(score, 1.0);
}

// --- 2️⃣ VOTE IMPACT ---
export function calculateProximity(
  userLat: number,
  userLon: number,
  campaignLat: number,
  campaignLon: number,
  scope?: string
): number {
  if (scope === 'global') return 1.0;

  const distance = calculateDistance(userLat, userLon, campaignLat, campaignLon);
  if (distance <= 10) return 1.0;
  if (distance <= 50) return 0.7;
  if (distance <= 200) return 0.4;
  return 0.0;
}

export function calculateVoteImpact(userIntegrity: number, proximity: number, globalModifier: number = 1.0): number {
  return parseFloat((userIntegrity * proximity * globalModifier).toFixed(4));
}

// --- 3️⃣ CAMPAIGN INTEGRITY ---
export function calculateCampaignIntegrity(
  creatorIntegrity: number,
  voteIntegrities: number[],
  totalVotes: number
): number {
  const avgVoteIntegrity = voteIntegrities.length > 0
    ? voteIntegrities.reduce((a, b) => a + b, 0) / voteIntegrities.length
    : 0;

  const voteInteractionScore = Math.min(totalVotes / 20, 1); // scale: 0–1 (capped at 20 votes)

  const score =
    0.5 * creatorIntegrity +
    0.3 * avgVoteIntegrity +
    0.2 * voteInteractionScore;

  return parseFloat(Math.min(score, 1.0).toFixed(4));
}

// --- 4️⃣ FUTURE FLAGS ---
export function detectAnomalyInVotes(votes: { integrity: number; proximity: number }[]): boolean {
  const lowIntegrityCount = votes.filter((v) => v.integrity < 0.3 && v.proximity < 0.3).length;
  return votes.length > 10 && lowIntegrityCount / votes.length > 0.5; // More than half low-quality votes
}
