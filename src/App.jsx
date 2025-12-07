import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }
    setError("");
    alert(`You searched for: ${city}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      {/* Centered card */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">
          Weather Dashboard
        </h1>

        {/* Input + Button */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition sm:w-auto w-full"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default App;
