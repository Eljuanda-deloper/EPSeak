-- Add career_id foreign key to modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS career_id UUID REFERENCES careers(id) ON DELETE CASCADE;

-- Create index for career_id lookups
CREATE INDEX IF NOT EXISTS idx_modules_career_id ON modules(career_id);

-- Update existing modules to have a career_id if they don't have one
-- This assumes there's a way to determine which career they belong to
-- For now, we'll leave them NULL and require future modules to specify a career
UPDATE modules SET career_id = NULL WHERE career_id IS NULL;

-- Make career_id NOT NULL for new modules (optional, depends on business logic)
-- ALTER TABLE modules ALTER COLUMN career_id SET NOT NULL;
