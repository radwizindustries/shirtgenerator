export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Check if it's a Supabase Storage URL
    if (url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
      // For Supabase Storage URLs, redirect directly
      return res.redirect(307, url);
    }

    // For DALL-E URLs, check expiry
    if (url.includes('oaidalleapiprodscus.blob.core.windows.net')) {
      const expiryMatch = url.match(/se=([^&]+)/);
      if (expiryMatch) {
        const expiryTime = new Date(decodeURIComponent(expiryMatch[1]));
        const currentTime = new Date();
        
        if (currentTime > expiryTime) {
          console.log('DALL-E URL expired:', {
            url,
            expiryTime: expiryTime.toISOString(),
            currentTime: currentTime.toISOString()
          });
          return res.redirect(307, '/placeholder.png');
        }
      }
      
      // Try to fetch the image directly first
      try {
        const response = await fetch(url);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=31536000');
          return res.send(Buffer.from(buffer));
        }
      } catch (error) {
        console.error('Error fetching DALL-E image:', error);
      }
      
      // If direct fetch fails, redirect to original URL
      return res.redirect(307, url);
    }

    // For other URLs, try to fetch and proxy
    const response = await fetch(url);
    if (!response.ok) {
      return res.redirect(307, '/placeholder.png');
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error in image proxy:', error);
    return res.redirect(307, '/placeholder.png');
  }
} 