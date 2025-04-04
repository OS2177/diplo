// /src/utils/useGeoImpact.js
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getImpactPercent(distance, radius) {
  if (distance <= radius * 0.2) return 100;
  if (distance <= radius * 0.5) return 75;
  if (distance <= radius) return 50;
  if (distance <= radius * 3) return 25;
  return 5;
}