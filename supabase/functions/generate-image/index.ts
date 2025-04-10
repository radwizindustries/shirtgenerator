const openaiKey = Deno.env.get("OPENAI_API_KEY");

const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${openaiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt,
    n: 1,
    size: "512x512",
  }),
});
