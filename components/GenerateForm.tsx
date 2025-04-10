"use client"

import { useState } from "react"
import { generateImage } from "@/lib/generateImage"
import { saveGeneratedShirt } from "@/lib/saveGeneratedShirt"

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("")
  const [shirtColor, setShirtColor] = useState("white")
  const [size, setSize] = useState("M")
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setImageUrl(null)

    const image = await generateImage(prompt)
    if (!image) {
      alert("Image generation failed")
      setLoading(false)
      return
    }

    const saved = await saveGeneratedShirt({
      imageUrl: image,
      prompt,
      shirtColor,
      size,
    })

    if (saved) {
      setImageUrl(saved)
      console.log("✅ Saved image:", saved)
    } else {
      alert("❌ Failed to save image")
    }

    setLoading(false)
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Generate a Shirt Design</h2>

      <input
        type="text"
        placeholder="Describe your shirt idea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <div className="flex gap-2 mb-4">
        <select
          value={shirtColor}
          onChange={(e) => setShirtColor(e.target.value)}
          className="flex-1 p-3 border rounded"
        >
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="pink">Pink</option>
          <option value="blue">Blue</option>
        </select>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-24 p-3 border rounded"
        >
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Shirt"}
      </button>

      {imageUrl && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Your Shirt Design</h3>
          <img src={imageUrl} alt="Shirt design" className="w-full rounded-lg shadow-md" />
        </div>
      )}
    </div>
  )
}
