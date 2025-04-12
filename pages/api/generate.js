/**
 * pages/api/generate.js
 *
 * API route handler for generating images using OpenAI's DALL-E 3 model.
 * Replaces previous Replicate implementation.
 */

// Import the OpenAI library (make sure you've installed it: npm install openai)
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The main handler function for the API route
export default async function handler(req, res) {
  // Set a longer timeout for this route
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=60');

  // Handle both GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the session using the token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return res.status(401).json({ error: 'Invalid session' });
    }

    if (req.method === 'GET') {
      // Get user's generation count
      const { count, error } = await supabase
        .from('user_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching generation count:', error);
        return res.status(500).json({ error: 'Failed to fetch generation count' });
      }

      return res.status(200).json({ count: count || 0 });
    }

    // Handle POST request for image generation
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Generating image with DALL-E 3 for prompt: "${prompt}"`);

    // Set a timeout for the OpenAI API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out. Please try again.'));
      }, 30000); // 30 second timeout
    });

    const imagePromise = openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
      quality: "standard",
      style: "vivid",
    });

    // Race between the timeout and the API call
    const response = await Promise.race([imagePromise, timeoutPromise]);

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('Failed to get image URL from OpenAI');
    }

    // Save the generation to the database
    const { error: insertError } = await supabase
      .from('user_generations')
      .insert([
        {
          user_id: session.user.id,
          prompt: prompt,
          image_url: imageUrl
        }
      ]);

    if (insertError) {
      console.error('Error saving generation:', insertError);
      // Don't fail the request if saving fails, just log it
    }

    // Also save to shirt_designs table for the gallery
    const { error: designError } = await supabase
      .from('shirt_designs')
      .insert([
        {
          user_id: session.user.id,
          prompt: prompt,
          image_url: imageUrl,
          created_at: new Date().toISOString()
        }
      ]);

    if (designError) {
      console.error('Error saving to gallery:', designError);
      // Don't fail the request if saving fails, just log it
    }

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error in generate API:', error);
    
    if (error.message === 'Request timed out. Please try again.') {
      return res.status(504).json({ error: error.message });
    }
    
    if (error instanceof OpenAI.APIError) {
      const statusCode = error.status || 500;
      let errorMessage = `OpenAI API Error: ${error.message || 'Unknown error'}`;
      
      if (error.code === 'content_policy_violation') {
        errorMessage = "Your prompt was rejected by OpenAI's content policy. Please modify your prompt and try again.";
      }
      
      return res.status(statusCode).json({ error: errorMessage });
    }
    
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}