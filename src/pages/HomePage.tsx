export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center mt-20"> {/* Adjusted margin-top to move sections down */}
      {/* Diplo Logo and Name */}
      <div className="mb-6">
        <img 
          src="/images/diplo_logo.png" 
          alt="Diplo Logo" 
          className="h-14 mx-auto" 
        />
      </div>

      {/* Welcome Heading */}
      <h1 className="text-3xl font-bold mb-4">Welcome to Diplo</h1>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        A new model for truth-based, public sentiment and collective diplomacy
      </p>

      {/* Learn More Link */}
      <a 
        href="https://diplo.cargo.site/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Learn More
      </a>
    </div>
  );
}
