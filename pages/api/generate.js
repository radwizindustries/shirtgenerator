
import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45e2c50842f8d7f3581b9c2a44fae9053b4",
      {
        input: { prompt },
      }
    );

    res.status(200).json({ imageUrl: output[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate image" });
  }
}
