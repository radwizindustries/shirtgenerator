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
      // For DALL-E URLs, proxy the request with authentication
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        console.error('DALL-E image proxy error:', {
          status: response.status,
          statusText: response.statusText,
          url: url
        });
        throw new Error(`Failed to fetch DALL-E image: ${response.statusText}`);
      }

      // Get the image data
      const imageBuffer = await response.arrayBuffer();
      
      // Set appropriate headers
      res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      // Send the image data
      return res.send(Buffer.from(imageBuffer));
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
    const imageBuffer = await response.arrayBuffer();

    // Set appropriate headers
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Send the image data
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: error.message });
  }
} 