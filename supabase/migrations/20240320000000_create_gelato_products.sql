-- Create gelato_products table
CREATE TABLE IF NOT EXISTS public.gelato_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    gelato_product_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.gelato_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gelato products"
    ON public.gelato_products
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gelato products"
    ON public.gelato_products
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_gelato_products_updated_at
    BEFORE UPDATE ON public.gelato_products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 