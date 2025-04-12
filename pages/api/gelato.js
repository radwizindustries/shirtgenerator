import { createClient } from '@supabase/supabase-js';

const GELATO_API_KEY = process.env.GELATO_API_KEY;
const GELATO_API_URL = 'https://api.gelato.com/v2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User error:', userError);
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.method === 'GET') {
      // Get template information
      const templateId = '5fc7cef1-8fd3-4361-855f-59f41a83cd57'; // T-shirt template ID
      const response = await fetch(`${GELATO_API_URL}/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.GELATO_API_KEY.split(':')[0]}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch template');
      }

      const template = await response.json();
      return res.status(200).json(template);
    }

    // Handle POST request for creating a product
    const { imageUrl, prompt } = req.body;
    if (!imageUrl || !prompt) {
      return res.status(400).json({ error: 'Image URL and prompt are required' });
    }

    // First, get template information
    const templateId = '5fc7cef1-8fd3-4361-855f-59f41a83cd57'; // T-shirt template ID
    const templateResponse = await fetch(`${GELATO_API_URL}/templates/${templateId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GELATO_API_KEY.split(':')[0]}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!templateResponse.ok) {
      const error = await templateResponse.json();
      throw new Error(error.message || 'Failed to fetch template');
    }

    const template = await templateResponse.json();

    // Create product using template
    const productResponse = await fetch(`${GELATO_API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GELATO_API_KEY.split(':')[0]}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        templateId,
        name: prompt,
        description: `AI-generated t-shirt design: ${prompt}`,
        variants: template.variants.map(variant => ({
          ...variant,
          images: [{
            url: imageUrl,
            position: 'front'
          }]
        }))
      })
    });

    if (!productResponse.ok) {
      const error = await productResponse.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const product = await productResponse.json();
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error in Gelato API:', error);
    return res.status(500).json({ error: error.message });
  }
} 