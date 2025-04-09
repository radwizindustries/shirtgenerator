import React, { useState } from "react";

const shirtColors = ["white", "black", "red", "blue", "green"];
const shirtSizes = ["S", "M", "L", "XL", "XXL"];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shirtColor, setShirtColor] = useState("white");
  const [shirtSize, setShirtSize] = useState("M");

  const generateImage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setImage(data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-purple-300 mb-4">AI Shirt Studio</h1>
        <p className="text-lg text-purple-100">
          Create a custom t-shirt with your own AI-generated art!
        </p>
      </header>

      <main className="max-w-4xl mx-auto bg-black bg-opacity-40 p-8 rounded-xl shadow-lg">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Describe your shirt design..."
            className="w-full p-3 rounded text-black"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={generateImage}
            disabled={!prompt || loading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-600 rounded font-bold"
          >
            {loading ? "Generating..." : "Generate Design"}
          </button>

          {loading && (
            <p className="text-purple-200 text-center animate-pulse">Generating your design, hang tight...</p>
          )}

          {image && (
            <div className="mt-8 flex flex-col items-center">
              <div className={`w-72 h-72 bg-${shirtColor} rounded-xl flex items-center justify-center overflow-hidden border border-purple-600`}>
                <img src={image} alt="Generated shirt design" className="object-contain w-full h-full" />
              </div>

              <div className="mt-4 flex gap-4 items-center">
                <label>Color:</label>
                <select
                  className="text-black rounded p-2"
                  value={shirtColor}
                  onChange={(e) => setShirtColor(e.target.value)}
                >
                  {shirtColors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>

                <label>Size:</label>
                <select
                  className="text-black rounded p-2"
                  value={shirtSize}
                  onChange={(e) => setShirtSize(e.target.value)}
                >
                  {shirtSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <button
                className="mt-6 bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded"
                onClick={() => alert("Buy flow coming soon!")}
              >
                Buy This Shirt
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-purple-300 mt-16">
        <p>&copy; 2025 AI Shirt Studio. All rights reserved.</p>
      </footer>
    </div>
  );
}
