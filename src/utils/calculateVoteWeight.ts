export function calculateVoteWeight({
  integrityScore,
  userLocation,
  campaignLocation,
  globalModifier = 1.0,
}: {
  integrityScore: number; // 0–1.0 normalized
  userLocation: { lat: number; lng: number };
  campaignLocation: { lat: number; lng: number };
  globalModifier?: number;
}): number {
  const R = 6371; // Earth's radius in km
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(campaignLocation.lat - userLocation.lat);
  const dLng = toRad(campaignLocation.lng - userLocation.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(userLocation.lat)) *
      Math.cos(toRad(campaignLocation.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const proximity = R * c; // Distance in km

  const impact = integrityScore * (1 / (proximity + 1)) * globalModifier;

  return +impact.toFixed(4);
}
