import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required and must be a string" });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: "Missing Replicate API token" });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
      {
        input: {
          prompt,
          width: 512,
          height: 512,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          scheduler: "K_EULER"
        },
      }
    );

    if (!output || !Array.isArray(output) || !output[0]) {
      throw new Error("Replicate returned no output image");
    }

    res.status(200).json({ imageUrl: output[0] });
  } catch (error) {
    console.error("Replicate error:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate image",
    });
  }
}
