import { useNavigate } from 'react-router-dom';

type Props = {
  campaignId: string;
};

export default function PulsePreviewGallery({ campaignId }: Props) {
  const navigate = useNavigate();

  const images = [
    '/images/square-1.png',
    '/images/square-2.png',
    '/images/square-3.gif', // your animated one
  ];

  return (
    <div
      onClick={() => navigate(`/pulse/${campaignId}`)}
      className="mt-6 cursor-pointer rounded border hover:shadow-md transition-shadow p-2 bg-white"
    >
      <p className="text-xs text-gray-600 mb-2 pl-1">💓 View Pulse</p>
      <div className="flex gap-2 justify-center items-center">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Pulse Frame ${index + 1}`}
            className="h-20 w-20 object-contain rounded"
          />
        ))}
      </div>
    </div>
  );
}
