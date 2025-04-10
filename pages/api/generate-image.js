// /pages/api/generate-image.ts
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3", // Make sure you're using DALL·E 3
        prompt,
        n: 1,
        size: "1024x1024", // High-quality size
        response_format: "url",
      }),
    });

    const json = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error:", json);
      return res.status(500).json({ error: json.error?.message || "Failed to generate image" });
    }

    return res.status(200).json({ imageUrl: json.data[0].url });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
