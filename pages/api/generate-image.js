import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    const userId = req.headers.authorization?.split(' ')[1];

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate image with DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a t-shirt design with the following description: ${prompt}. The design should be centered and fit well on a t-shirt.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;

    // Save to Supabase if user is authenticated
    if (userId) {
      const { data: design, error: insertError } = await supabase
        .from('shirt_designs')
        .insert([
          {
            user_id: userId,
            prompt: prompt,
            image_url: imageUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        console.error('Error saving design:', insertError);
      }
    }

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message });
  }
}
  