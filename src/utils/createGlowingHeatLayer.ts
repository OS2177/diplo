import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

type Vote = {
  latitude: number;
  longitude: number;
  integrity: number;
};

export function createGlowingHeatLayer(votes: Vote[]) {
  const HeatLayer = () => {
    const map = useMap();

    const points = votes.map((v) => [v.latitude, v.longitude, v.integrity]);

    L.heatLayer(points, {
      radius: 25,
      blur: 25,
      maxZoom: 6,
      gradient: {
        0.0: '#440154',
        0.3: '#3B82F6',
        0.7: '#06B6D4',
        1.0: '#E0F2FE'
      }
    }).addTo(map);

    return null;
  };

  return <HeatLayer />;
}
