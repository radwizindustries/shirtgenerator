export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // For DALL-E URLs, try to fetch directly first
    if (url.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          return res.send(Buffer.from(imageBuffer));
        }
      } catch (error) {
        console.error('Error fetching DALL-E image:', error);
        // If direct fetch fails, try redirecting
        return res.redirect(url);
      }
    }

    // For other URLs, proxy the request
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Image proxy error:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      });
      
      // Return a placeholder image for missing images
      if (response.status === 404) {
        return res.redirect('/placeholder.png');
      }
      
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
    // Return a placeholder image for any errors
    return res.redirect('/placeholder.png');
  }
} 