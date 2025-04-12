export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // For DALL-E URLs, we can fetch directly as they include a SAS token
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