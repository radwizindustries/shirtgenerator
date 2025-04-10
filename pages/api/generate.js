/**
 * pages/api/generate.js
 *
 * API route handler for generating images using OpenAI's DALL-E 3 model.
 * Replaces previous Replicate implementation.
 */

// Import the OpenAI library (make sure you've installed it: npm install openai)
import OpenAI from 'openai';

// Instantiate the OpenAI client.
// It automatically looks for the OPENAI_API_KEY environment variable.
// Ensure OPENAI_API_KEY is set in your .env.local file for local development
// and in your Vercel environment variables for deployment.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // apiKey is the default parameter name
});

// The main handler function for the API route
export default async function handler(req, res) {
  // 1. Basic Request Validation
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Extract the prompt from the request body
  // Assumes the frontend sends a JSON body like: { "prompt": "your image description" }
  const { prompt } = req.body;

  // Check if the prompt exists
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // 2. OpenAI Image Generation Logic
  try {
    // Log the incoming prompt for debugging
    console.log(`Generating image with DALL-E 3 for prompt: "${prompt}"`);

    // Call the OpenAI API to generate an image
    const response = await openai.images.generate({
      model: "dall-e-3",     // Use the DALL-E 3 model
      prompt: prompt,         // The user-provided prompt
      n: 1,                   // Number of images to generate (DALL-E 3 API typically returns 1)
      size: "1024x1024",      // Image size. DALL-E 3 requires specific sizes:
                              // 1024x1024, 1792x1024, or 1024x1792.
                              // Choose the one that best fits your shirt design needs.
      response_format: "url", // We want the API to return a URL to the generated image.
                              // 'b64_json' is the alternative if you want base64 data.
      quality: "standard",    // "standard" or "hd". HD costs more.
      style: "vivid",         // "vivid" or "natural". Vivid leans towards hyper-real, natural is more realistic.
    });

    // Log the raw response from OpenAI for debugging purposes
    console.log("OpenAI API Response:", JSON.stringify(response, null, 2));

    // Extract the URL of the generated image from the response.
    // The response structure is { created: ..., data: [ { url: '...', ... }, ... ] }
    const imageUrl = response.data?.[0]?.url;

    // Check if we actually got a URL
    if (!imageUrl) {
      console.error("Failed to extract image URL from OpenAI response:", response);
      throw new Error('Failed to get image URL from OpenAI'); // Throw error to be caught below
    }

    // Log the successfully extracted URL
    console.log("Generated Image URL:", imageUrl);

    // 3. Send Successful Response
    // Return the image URL to the frontend.
    // Ensure your frontend code expects this structure: { imageUrl: "..." }
    res.status(200).json({ imageUrl: imageUrl });

  } catch (error) {
    // 4. Handle Errors
    console.error("Error calling OpenAI API:", error);

    let errorMessage = 'Failed to generate image due to an internal error.';
    let statusCode = 500;

    // Check if it's a specific OpenAI API error
    if (error instanceof OpenAI.APIError) {
      statusCode = error.status || 500; // Use status from error if available
      errorMessage = `OpenAI API Error: ${error.message || 'Unknown error'}`;

      // Check for specific error codes, like content policy violations
      if (error.code === 'content_policy_violation') {
        errorMessage = "Your prompt was rejected by OpenAI's content policy. Please modify your prompt and try again.";
        statusCode = 400; // Bad Request is appropriate here
      }
      // Log detailed error info if available
      console.error(`OpenAI API Error Details (Status ${statusCode}):`, error.error || error);
    } else if (error.message === 'Failed to get image URL from OpenAI') {
      // Handle the specific case where URL extraction failed after a successful API call (unlikely but possible)
       errorMessage = error.message;
       statusCode = 500;
    }
    // You could add more specific checks for other error types if needed

    // Send the error response back to the frontend
    res.status(statusCode).json({ error: errorMessage });
  }
}