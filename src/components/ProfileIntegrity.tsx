
export default function ProfileIntegrity() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Integrity Score</h2>
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold text-green-600">95%</div>
        <div className="flex-1 bg-gray-200 rounded-full h-4">
          <div className="bg-green-600 h-4 rounded-full" style={{ width: '95%' }}></div>
        </div>
      </div>
      <p className="text-gray-600">
        Your integrity score is based on your voting history and community participation.
      </p>
    </div>
  );
}
