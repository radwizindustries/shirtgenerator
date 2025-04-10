import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [shirtColor, setShirtColor] = useState("white");
  const [size, setSize] = useState("M");

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
        throw new Error(data.error || "Something went wrong generating the image");
      }

      const generatedUrl = data.imageUrl;

      const saveRes = await fetch("/api/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: generatedUrl,
          prompt,
          shirtColor,
          size,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to save image");
      }

      setImageUrl(saveData.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Shirt Generator</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧙‍♂️</text></svg>"
        />
      </Head>

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

          <div className="flex gap-2 mb-4">
            <select
              value={shirtColor}
              onChange={(e) => setShirtColor(e.target.value)}
              className="flex-1 p-3 rounded text-black"
            >
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="pink">Pink</option>
              <option value="blue">Blue</option>
            </select>

            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-24 p-3 rounded text-black"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

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
    </>
  );
}
