-- Migration to add archive functionality to existing tasks table
-- Run this in Supabase SQL Editor if you already have the tasks table

-- Add archived column if it doesn't exist
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Add archived_at column if it doesn't exist
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- Create index for archived tasks
CREATE INDEX IF NOT EXISTS tasks_archived_idx ON tasks(archived);

-- Success message
SELECT 'Archive columns added successfully!' as message;