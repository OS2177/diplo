import { calculateVoteWeight } from '../utils/calculateVoteWeight';

interface Props {
  integrityScore: number; // normalized 0–1
  userLocation: { lat: number; lng: number };
  campaignLocation: { lat: number; lng: number };
  globalModifier?: number; // optional
}

export default function VoteImpact({
  integrityScore,
  userLocation,
  campaignLocation,
  globalModifier = 1.0,
}: Props) {
  const weight = calculateVoteWeight({
    integrityScore,
    userLocation,
    campaignLocation,
    globalModifier,
  });

  return (
    <div className="bg-blue-100 border border-blue-300 p-4 rounded mt-6">
      <h3 className="text-lg font-semibold text-blue-900">Your Vote Impact</h3>
      <p className="text-2xl font-bold text-blue-800">{weight}</p>
      <p className="text-sm text-bluimport { calculateVoteWeight } from '../utils/calculateVoteWeight';

        interface Props {
          integrityScore: number; // 0–100
          userLocation: { lat: number; lng: number };
          campaignLocation: { lat: number; lng: number };
          campaignRadius: number; // in kilometers
        }

        export default function VoteImpact({
          integrityScore,
          userLocation,
          campaignLocation,
          campaignRadius,
        }: Props) {
          const weight = calculateVoteWeight({
            integrityScore,
            userLocation,
            campaignLocation,
            campaignRadius,
          });

          return (
            <div className="bg-blue-100 border border-blue-300 p-4 rounded mt-6">
              <h3 className="text-lg font-semibold text-blue-900">Your Vote Impact</h3>
              <p className="text-2xl font-bold text-blue-800">{weight}</p>
              <p className="text-sm text-blue-700">
                Your influence on this vote is based on your profile integrity and location proximity.
              </p>
            </div>
          );
        }
e-700">
        Your vote impact is based on your integrity and proximity to the campaign.
      </p>
    </div>
  );
}
