import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-purple-300 mb-4">AI Shirt Generator</h1>
        <p className="text-lg text-purple-100 mb-8">
          Describe your dream t-shirt and let AI bring it to life!
        </p>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A glowing dragon on a mountain"
          className="w-full p-3 rounded text-black mb-4"
        />

        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          className="bg-purple-600 hover:bg-purple-500 font-bold py-3 px-6 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Design"}
        </button>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {imageUrl && (
          <div className="mt-8">
            <p className="mb-2 text-purple-200">Here’s your design:</p>
            <img
              src={imageUrl}
              alt="Generated shirt design"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
