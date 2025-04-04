type Coordinates = {
  latitude: number;
  longitude: number;
};

type Location = {
  coordinates: Coordinates | null;
  city: string | null;
  country: string | null;
  error: string | null;
  loading: boolean;
};

// Initial location state
export const initialLocation: Location = {
  coordinates: null,
  city: null,
  country: null,
  error: null,
  loading: true,
};

/**
 * Get user's current location using browser's Geolocation API
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
};

/**
 * Reverse geocode coordinates to get location name
 * In a real app, this would use a geocoding service like Google Maps, Mapbox, etc.
 * This is a simple mock implementation for demonstration purposes
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<{ city: string; country: string }> => {
  // Simplified mock implementation
  // In a real app, this would call an external geocoding API service
  
  // For demonstration, return New York, USA as default
  return {
    city: "New York",
    country: "USA",
  };
};
