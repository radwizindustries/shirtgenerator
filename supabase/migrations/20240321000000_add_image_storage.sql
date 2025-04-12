-- Create a storage bucket for shirt designs
INSERT INTO storage.buckets (id, name, public)
VALUES ('shirt_designs', 'shirt_designs', true)
ON CONFLICT (id) DO NOTHING;

-- Add storage policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'shirt_designs');

-- Add storage policy to allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'shirt_designs');

-- Add permanent_image_url column to shirt_designs
ALTER TABLE shirt_designs 
ADD COLUMN IF NOT EXISTS permanent_image_url TEXT;

-- Add index on permanent_image_url
CREATE INDEX IF NOT EXISTS idx_shirt_designs_permanent_url 
ON shirt_designs(permanent_image_url); 