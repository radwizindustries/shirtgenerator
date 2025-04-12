/**
 * pages/api/generate.js
 *
 * API route handler for generating images using OpenAI's DALL-E 3 model.
 * Replaces previous Replicate implementation.
 */

// Import the OpenAI library (make sure you've installed it: npm install openai)
import OpenAI from 'openai';
import { supabase } from '../../lib/supabase';

// Instantiate the OpenAI client.
// It automatically looks for the OPENAI_API_KEY environment variable.
// Ensure OPENAI_API_KEY is set in your .env.local file for local development
// and in your Vercel environment variables for deployment.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // apiKey is the default parameter name
});

// The main handler function for the API route
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's generation count
    const { count, error } = await supabase
      .from('user_generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching generation count:', error);
      return res.status(500).json({ error: 'Failed to fetch generation count' });
    }

    res.status(200).json({ count: count || 0 });
  } catch (error) {
    console.error('Error in generate API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}