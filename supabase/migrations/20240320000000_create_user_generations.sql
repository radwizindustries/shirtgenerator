-- Create user_generations table
CREATE TABLE IF NOT EXISTS public.user_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_generations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own generations
CREATE POLICY "Users can view their own generations"
    ON public.user_generations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own generations
CREATE POLICY "Users can insert their own generations"
    ON public.user_generations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own generations
CREATE POLICY "Users can delete their own generations"
    ON public.user_generations
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS user_generations_user_id_idx ON public.user_generations(user_id); 