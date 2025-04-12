-- First check if the table exists
DO $$ 
BEGIN
    -- Check if the table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'shirt_designs') THEN
        -- Add user_id column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'shirt_designs' AND column_name = 'user_id') THEN
            ALTER TABLE shirt_designs ADD COLUMN user_id UUID REFERENCES auth.users(id);
        END IF;
    ELSE
        -- Create the table if it doesn't exist
        CREATE TABLE shirt_designs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            prompt TEXT NOT NULL,
            image_url TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            user_id UUID REFERENCES auth.users(id)
        );
    END IF;
END $$;

-- Create an index on user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_shirt_designs_user_id'
    ) THEN
        CREATE INDEX idx_shirt_designs_user_id ON shirt_designs(user_id);
    END IF;
END $$; 