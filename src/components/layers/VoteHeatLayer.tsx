import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

type Props = {
  votes: {
    latitude: number;
    longitude: number;
  }[];
};

export default function VoteHeatLayer({ votes }: Props) {
  const map = useMap();

  useEffect(() => {
    const layer = L.heatLayer(
      votes.map((v) => [v.latitude, v.longitude, 0.5]),
      {
        radius: 25,
        blur: 15,
        maxZoom: 7,
        gradient: {
          0.2: '#34D399',
          0.6: '#60A5FA',
          1.0: '#6366F1',
        },
      }
    ).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, votes]);

  return null;
}
