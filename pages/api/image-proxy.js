export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // For DALL-E URLs, check if the URL is expired
    if (url.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      try {
        // Extract the expiry time from the URL
        const expiryMatch = url.match(/se=([^&]+)/);
        if (expiryMatch) {
          const expiryTime = new Date(decodeURIComponent(expiryMatch[1]));
          const currentTime = new Date();
          
          // If URL is expired, return placeholder
          if (currentTime > expiryTime) {
            console.log('DALL-E URL expired:', {
              url,
              expiryTime,
              currentTime
            });
            return res.redirect('/placeholder.png');
          }
        }

        // Try to fetch the image if URL is still valid
        const response = await fetch(url);
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          return res.send(Buffer.from(imageBuffer));
        }
      } catch (error) {
        console.error('Error fetching DALL-E image:', error);
        return res.redirect('/placeholder.png');
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
      
      // Return placeholder for any errors
      return res.redirect('/placeholder.png');
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
    return res.redirect('/placeholder.png');
  }
} 