export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEOCODING_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { city, town, village, country } = data.results[0].components;
      return `${city || town || village || 'Unknown city'}, ${country || 'Unknown country'}`;
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }

  return null;
}
