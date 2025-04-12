import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TEMPLATE_ID = '5fc7cef1-8fd3-4361-855f-59f41a83cd57';
const GELATO_API_URL = 'https://api.gelato.com/v2';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { color } = req.query;

    if (!process.env.GELATO_API_KEY) {
      throw new Error('Gelato API key not configured');
    }

    // First, list all templates
    const templatesResponse = await fetch(`${GELATO_API_URL}/templates`, {
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY.split('-')[0],
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!templatesResponse.ok) {
      const errorText = await templatesResponse.text();
      console.error('Gelato Templates List API Error Response:', errorText);
      throw new Error(`Failed to fetch templates list from Gelato: ${templatesResponse.statusText}`);
    }

    const templates = await templatesResponse.json();
    console.log('Available templates:', templates); // Debug log

    // Get the specific template
    const templateResponse = await fetch(`${GELATO_API_URL}/templates/${TEMPLATE_ID}`, {
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY.split('-')[0],
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!templateResponse.ok) {
      const errorText = await templateResponse.text();
      console.error('Gelato Template API Error Response:', errorText);
      throw new Error(`Failed to fetch template from Gelato: ${templateResponse.statusText}`);
    }

    const template = await templateResponse.json();
    console.log('Template response:', template); // Debug log

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

    // Get mockups for the specific variant
    const mockupResponse = await fetch(`${GELATO_API_URL}/variants/${variant.id}/mockups`, {
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY.split('-')[0],
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!mockupResponse.ok) {
      const errorText = await mockupResponse.text();
      console.error('Gelato Mockup API Error Response:', errorText);
      throw new Error(`Failed to fetch mockups from Gelato: ${mockupResponse.statusText}`);
    }

    const mockupsData = await mockupResponse.json();
    console.log('Mockups response:', mockupsData); // Debug log

    // Assuming we want the first mockup URL
    const mockupUrl = mockupsData.mockups?.[0]?.url;

    if (!mockupUrl) {
      console.error('No mockup URL found in response:', mockupsData);
      throw new Error('No mockup URL found for the variant');
    }

    res.status(200).json({ mockupUrl });
  } catch (error) {
    console.error('Error fetching mockups:', error);
    res.status(500).json({ error: error.message });
  }
} 