export async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported.');
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Error getting location:', err);
        resolve(null);
      }
    );
  });
}
