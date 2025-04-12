import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, updates } = req.body;

    if (!email || !updates) {
      return res.status(400).json({ error: 'Email and updates are required' });
    }

    // Find user by email
    const { data: users, error: findError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (findError) {
      throw new Error('User not found');
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      users.id,
      { user_metadata: updates }
    );

    if (updateError) {
      throw updateError;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
} 