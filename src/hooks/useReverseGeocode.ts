// src/hooks/useReverseGeocode.ts
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const key = import.meta.env.VITE_GEOCODING_API_KEY;
  if (!key) {
    console.warn('[useReverseGeocode] missing VITE_GEOCODING_API_KEY');
    return null;
  }

  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${key}`
    );
    if (!res.ok) {
      console.error('[useReverseGeocode] HTTP', res.status);
      return null;
    }
    const data = await res.json();
    return data.results?.[0]?.formatted || null;
  } catch (err) {
    console.error('[useReverseGeocode]', err);
    return null;
  }
}
