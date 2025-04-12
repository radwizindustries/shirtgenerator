import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRINTFUL_API_URL = 'https://api.printful.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, color } = req.body;

    if (!process.env.PRINTFUL_API_KEY) {
      throw new Error('Printful API key not configured');
    }

    // Get product templates
    const templatesResponse = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
    });

    if (!templatesResponse.ok) {
      const error = await templatesResponse.json();
      throw new Error(error.message || 'Failed to fetch product templates');
    }

    const templates = await templatesResponse.json();
    console.log('Available templates:', templates);

    // Find the appropriate product variant based on color
    const targetColor = (color === '#FFFFFF' ? 'white' : 'black');
    const product = templates.result.find(product => 
      product.variants && product.variants.some(variant => 
        variant.color && variant.color.toLowerCase() === targetColor
      )
    );

    if (!product) {
      console.error('Available products:', templates.result);
      throw new Error(`Product not found for the selected color: ${targetColor}`);
    }

    const variant = product.variants.find(v => v.color.toLowerCase() === targetColor);

    // Create a product with the image
    const productResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${product.id}/variants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sync_product: {
          name: 'Custom T-Shirt Design',
          thumbnail: imageUrl
        },
        sync_variants: [
          {
            variant_id: variant.id,
            retail_price: '29.99',
            files: [
              {
                url: imageUrl,
                type: 'front'
              }
            ]
          }
        ]
      }),
    });

    if (!productResponse.ok) {
      const error = await productResponse.json();
      throw new Error(error.message || 'Failed to create product');
    }

    const productCreated = await productResponse.json();
    console.log('Product created:', productCreated);

    // Get mockups for the product
    const mockupResponse = await fetch(`${PRINTFUL_API_URL}/mockup-generator/create-task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: product.id,
        variant_ids: [variant.id],
        format: 'jpg',
        files: [
          {
            placement: 'front',
            image_url: imageUrl
          }
        ]
      }),
    });

    if (!mockupResponse.ok) {
      const error = await mockupResponse.json();
      throw new Error(error.message || 'Failed to generate mockups');
    }

    const mockupTask = await mockupResponse.json();
    console.log('Mockup task created:', mockupTask);

    // Poll for mockup completion
    let mockupUrl = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!mockupUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const taskStatusResponse = await fetch(`${PRINTFUL_API_URL}/mockup-generator/task/${mockupTask.result.task_key}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
        }
      });

      if (!taskStatusResponse.ok) {
        throw new Error('Failed to check mockup status');
      }

      const taskStatus = await taskStatusResponse.json();
      
      if (taskStatus.result.status === 'completed') {
        mockupUrl = taskStatus.result.mockups[0].mockup_url;
        break;
      }

      attempts++;
    }

    if (!mockupUrl) {
      throw new Error('Failed to generate mockup after multiple attempts');
    }

    return res.status(200).json({ mockupUrl });
  } catch (error) {
    console.error('Error in Printful API:', error);
    res.status(500).json({ error: error.message });
  }
} 