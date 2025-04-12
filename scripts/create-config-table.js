import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createConfigTable() {
  try {
    // Create config table if it doesn't exist
    const { error: createError } = await supabase.rpc('create_config_table');
    if (createError) throw createError;

    // Insert Gelato API key if not exists
    const { error: insertError } = await supabase
      .from('config')
      .upsert({
        id: 1,
        gelato_api_key: process.env.GELATO_API_KEY
      });

    if (insertError) throw insertError;

    console.log('Config table created and API key inserted successfully');
  } catch (error) {
    console.error('Error setting up config table:', error);
  }
}

createConfigTable(); 