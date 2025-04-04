/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
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

/**
 * Calculate vote impact percentage based on distance from campaign center
 * @param distance Distance in kilometers
 * @param radius Campaign radius in kilometers
 * @returns Impact percentage (5-100)
 */
export function getImpactPercent(distance: number, radius: number): number {
  if (distance <= radius * 0.2) return 100;
  if (distance <= radius * 0.5) return 75;
  if (distance <= radius) return 50;
  if (distance <= radius * 3) return 25;
  return 5;
}