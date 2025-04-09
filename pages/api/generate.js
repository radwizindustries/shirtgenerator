import Replicate from "replicate";
import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  const prompt = body.prompt;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "Missing Replicate API token" }, { status: 500 });
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

    return NextResponse.json({ imageUrl: output[0] });
  } catch (error) {
    console.error("Replicate error:", error);
    return NextResponse.json({
      error: error?.message || "Failed to generate image",
    }, { status: 500 });
  }
}
