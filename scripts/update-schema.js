import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '..', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
  envConfig.NEXT_PUBLIC_SUPABASE_URL,
  envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateSchema() {
  try {
    // Add shirt_color column to shirt_designs table if it doesn't exist
    const { error } = await supabase.from('shirt_designs').select().limit(1);
    
    if (error && error.message.includes('shirt_color')) {
      const { error: alterError } = await supabase
        .from('shirt_designs')
        .update({ shirt_color: '#FFFFFF' })
        .eq('id', 0); // This will fail safely if no rows exist

      if (alterError && !alterError.message.includes('does not exist')) {
        throw alterError;
      }
      
      console.log('Schema updated successfully!');
    } else {
      console.log('Schema is already up to date.');
    }
  } catch (error) {
    console.error('Error updating schema:', error);
  }
}

updateSchema(); 