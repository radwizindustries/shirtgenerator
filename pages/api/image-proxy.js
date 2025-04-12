export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Check if the URL is from DALL-E
    const isDalleUrl = url.includes('oaidalleapiprodscus.blob.core.windows.net');
    
    // For DALL-E URLs, we need to use the original URL directly
    // as the SAS token is already included in the URL
    const response = await fetch(url, {
      headers: {
        'Accept': 'image/*',
        ...(isDalleUrl ? {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        } : {})
      }
    });
    
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