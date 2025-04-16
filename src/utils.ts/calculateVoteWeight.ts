export function calculateVoteWeight({
  integrityScore,
  userLocation,
  campaignLocation,
  campaignRadius,
}: {
  integrityScore: number; // 0–100
  userLocation: { lat: number; lng: number };
  campaignLocation: { lat: number; lng: number };
  campaignRadius: number; // in kilometers
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
  const distance = R * c;

  // Proximity-based impact scaling
  let proximityMultiplier = 0.1;

  if (distance <= campaignRadius) proximityMultiplier = 1.0;
  else if (distance <= campaignRadius * 2) proximityMultiplier = 0.5;
  else if (distance <= campaignRadius * 3) proximityMultiplier = 0.25;

  const integrityNormalized = integrityScore / 100;

  return +(integrityNormalized * proximityMultiplier).toFixed(3);
}
