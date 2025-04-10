export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
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
        prompt,
        n: 1,
        size: "1024x1024", // You can change this if needed
      }),
    });

    const json = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(500).json({ error: json.error.message || "Failed to generate image" });
    }

    return res.status(200).json({ imageUrl: json.data[0].url });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
