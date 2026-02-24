-- Add model and attachments columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS model text DEFAULT 'GPT-4o';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;
