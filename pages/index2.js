
import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";


export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setImage(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-4xl font-bold text-purple-300">AI T-Shirt Generator</h1>
      <p className="text-lg text-purple-100 max-w-xl text-center">
        Enter a prompt below to generate a custom AI artwork and preview it on a t-shirt design.
      </p>
      <div className="w-full max-w-xl space-y-4">
        <Input
          className="text-black"
          placeholder="Describe your t-shirt design..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          onClick={generateImage}
          disabled={loading || !prompt}
          className="w-full bg-purple-700 hover:bg-purple-600"
        >
          {loading ? "Generating..." : "Generate Image"}
        </Button>
      </div>
      {image && (
        <Card className="mt-10 p-4 bg-black border border-purple-800">
          <CardContent className="flex flex-col items-center">
            <p className="mb-4 text-purple-200">Preview:</p>
            <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src={image} alt="AI Generated Design" className="object-cover" />
            </div>
            <p className="mt-4 text-purple-100">Your design on a t-shirt!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


