export async function saveGeneratedShirt({
    imageUrl,
    prompt,
    shirtColor,
    size,
  }: {
    imageUrl: string
    prompt: string
    shirtColor: string
    size: string
  }): Promise<string | null> {
    try {
      const res = await fetch("/api/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, prompt, shirtColor, size }),
      })
  
      if (!res.ok) {
        const text = await res.text()
        console.error("Save failed:", text)
        return null
      }
  
      const json = await res.json()
      return json.url // This is your saved Supabase image URL
    } catch (err) {
      console.error("Unexpected error saving image:", err)
      return null
    }
  }
  