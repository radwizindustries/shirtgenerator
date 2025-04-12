const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Required environment variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'REPLICATE_API_TOKEN',
  'PRINTFUL_API_KEY'
];

// Check each required variable
let allSet = true;
for (const varName of requiredVars) {
  if (!envConfig[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    allSet = false;
  } else {
    console.log(`✅ ${varName} is set`);
  }
}

if (allSet) {
  console.log('\nAll environment variables are properly configured!');
} else {
  console.log('\nPlease set all required environment variables before deploying.');
  process.exit(1);
} 