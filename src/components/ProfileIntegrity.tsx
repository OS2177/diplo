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
  let score = 0;

  if (profile.email) score += 20;
  if (profile.name) score += 10;
  if (profile.city && profile.country) score += 10;
  if (profile.age) score += 10;
  if (profile.bio) score += 10;
  if (profile.pronouns) score += 10;

  // 👇 Optional placeholder for future vote tracking
  const voteCount = 0;
  if (voteCount > 5) score += 20;
  else if (voteCount > 0) score += 10;

  return (
    <div className="bg-gray-100 p-4 mt-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Integrity Score</h3>
      <p className="text-xl font-bold">{score}%</p>
      <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
        {score < 100 && <li>Complete your profile to increase your vote influence.</li>}
        {voteCount === 0 && <li>Vote on campaigns to boost integrity score.</li>}
      </ul>
    </div>
  );
}
