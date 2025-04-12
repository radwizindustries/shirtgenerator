-- Create config table
CREATE TABLE IF NOT EXISTS public.config (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Config is viewable by everyone"
ON public.config FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Config is updatable by admins"
ON public.config FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Create updated_at trigger
CREATE TRIGGER handle_config_updated_at
BEFORE UPDATE ON public.config
FOR EACH ROW
EXECUTE FUNCTION moddatetime (updated_at); 