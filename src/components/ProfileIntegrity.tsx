interface Props {
  profile: {
    name: string;
    email: string;
    city: string;
    country: string;
    age: string;
    pronouns: string;
    bio: string;
  };
}

export default function ProfileIntegrity({ profile }: Props) {
  let rawScore = 0;

  if (profile.email) rawScore += 0.2;
  if (profile.name) rawScore += 0.1;
  if (profile.city && profile.country) rawScore += 0.1;
  if (profile.age) rawScore += 0.1;
  if (profile.bio) rawScore += 0.1;
  if (profile.pronouns) rawScore += 0.1;

  const normalizedScore = Math.min(rawScore, 1.0);

  return (
    <div className="bg-gray-100 p-4 mt-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Integrity Score</h3>
      <p className="text-xl font-bold">{(normalizedScore * 100).toFixed(0)}%</p>
      <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
        {normalizedScore < 1 && <li>Complete your profile to increase your vote influence.</li>}
        <li>Vote on campaigns to build public integrity.</li>
      </ul>
    </div>
  );
}
