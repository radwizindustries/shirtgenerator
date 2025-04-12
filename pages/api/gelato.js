import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const GELATO_API_URL = 'https://api.gelato.com/v2';
const TEMPLATE_ID = '5fc7cef1-8fd3-4361-855f-59f41a83cd57';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, color } = req.body;

    if (!process.env.GELATO_API_KEY) {
      throw new Error('Gelato API key not configured');
    }

    // First, upload the image to Gelato
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const uploadResponse = await fetch(`${GELATO_API_URL}/images`, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY,
        'Content-Type': 'image/png',
      },
      body: Buffer.from(imageBuffer),
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const { id: imageId } = await uploadResponse.json();
    console.log('Image uploaded successfully:', imageId);

    // Get the template
    const templateResponse = await fetch(`${GELATO_API_URL}/templates/${TEMPLATE_ID}`, {
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!templateResponse.ok) {
      const error = await templateResponse.json();
      throw new Error(error.message || 'Failed to fetch template');
    }

    const template = await templateResponse.json();
    console.log('Template response:', template);

    // Get the variant ID based on the color
    const targetColor = (color === '#FFFFFF' ? 'white' : 'black');
    const variant = template.variants?.find(v => 
      v.attributes?.some(attr => 
        attr.name === 'color' && 
        attr.value.toLowerCase() === targetColor
      )
    );

    if (!variant) {
      console.error('Available variants:', template.variants);
      throw new Error(`Variant not found for the selected color: ${targetColor}`);
    }

    // Create a product with the image
    const productResponse = await fetch(`${GELATO_API_URL}/products`, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        variantId: variant.id,
        images: [{
          layerId: 'front', // This should match the layer ID in your template
          url: `https://api.gelato.com/v2/images/${imageId}`
        }]
      }),
    });

    if (!productResponse.ok) {
      const error = await productResponse.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const product = await productResponse.json();
    console.log('Product created:', product);

    // Get mockups for the product
    const mockupResponse = await fetch(`${GELATO_API_URL}/products/${product.id}/mockups`, {
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!mockupResponse.ok) {
      const error = await mockupResponse.json();
      throw new Error(error.message || 'Failed to fetch mockups');
    }

    const mockups = await mockupResponse.json();
    console.log('Mockups:', mockups);

    // Return the first mockup URL
    const mockupUrl = mockups.mockups?.[0]?.url;
    if (!mockupUrl) {
      throw new Error('No mockup URL found');
    }

    return res.status(200).json({ mockupUrl });
  } catch (error) {
    console.error('Error in Gelato API:', error);
    res.status(500).json({ error: error.message });
  }
} 