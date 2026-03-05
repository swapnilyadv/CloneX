-- Add status, files, model columns if they don't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'building',
ADD COLUMN IF NOT EXISTS files jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS model text DEFAULT 'gpt-4o';

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
