// This file creates a standard Leaflet heat layer
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

type Vote = {
  latitude: number;
  longitude: number;
};

export function createHeatLayer(votes: Vote[]) {
  const HeatLayer = () => {
    const map = useMap();

    const points = votes.map((v) => [v.latitude, v.longitude, 0.5]); // third value = intensity

    L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 7,
      gradient: {
        0.2: '#34D399',
        0.6: '#60A5FA',
        1.0: '#6366F1'
      }
    }).addTo(map);

    return null;
  };

  return <HeatLayer />;
}
