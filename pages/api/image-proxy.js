export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Check if it's a DALL-E URL
    if (url.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      // For DALL-E URLs, redirect to the original URL
      return res.redirect(url);
    }

    // For other URLs, proxy the request
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Image proxy error:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      });
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image data
    const contentType = response.headers.get('content-type') || 'image/png';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Send the image data
    res.send(buffer);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: error.message });
  }
} 