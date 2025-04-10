export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Image generation failed:", json.error);
      return null;
    }

    return json.imageUrl;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}
