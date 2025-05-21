import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

type Props = {
  votes: {
    latitude: number;
    longitude: number;
    integrity: number;
  }[];
};

export default function GlowingHeatLayer({ votes }: Props) {
  const map = useMap();

  useEffect(() => {
    const layer = L.heatLayer(
      votes.map((v) => [v.latitude, v.longitude, v.integrity]),
      {
        radius: 25,
        blur: 25,
        maxZoom: 6,
        gradient: {
          0.0: '#440154',
          0.3: '#3B82F6',
          0.7: '#06B6D4',
          1.0: '#E0F2FE',
        },
      }
    ).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, votes]);

  return null;
}
