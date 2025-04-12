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

async function updateUser() {
  try {
    // Sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'thebrianexp@gmail.com',
      password: process.argv[2] // Get password from command line argument
    });

    if (signInError) {
      throw signInError;
    }

    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { username: 'radicalwizard' }
    });

    if (error) {
      throw error;
    }

    console.log('User updated successfully!');
    console.log('New metadata:', data.user.user_metadata);

    // Sign out
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

if (process.argv.length < 3) {
  console.error('Please provide your password as a command line argument');
  process.exit(1);
}

updateUser(); 