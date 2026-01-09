-- Add status column to app_proposals if it doesn't exist
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- This migration will fail if column already exists, which is expected
ALTER TABLE app_proposals ADD COLUMN status TEXT DEFAULT 'active';

