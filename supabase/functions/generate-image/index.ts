// supabase/functions/generate-image/index.ts

Deno.serve(async (req) => {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    const json = await openaiRes.json();

    if (!openaiRes.ok) {
      return new Response(JSON.stringify({ error: json.error.message || "Image generation failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ imageUrl: json.data[0].url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow browser access
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error generating image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
