-- Step 1: Check if the table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'email_templates'
) AS table_exists;

-- Step 2: If the above returns FALSE, run the following:

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Email Templates Configuration Table
CREATE TABLE IF NOT EXISTS email_templates (
  id VARCHAR PRIMARY KEY NOT NULL,
  template_name VARCHAR UNIQUE NOT NULL,
  template_type VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  sender_name VARCHAR NOT NULL,
  sender_email VARCHAR NOT NULL,
  banner_text VARCHAR NOT NULL,
  email_body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 3: Verify the table was created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'email_templates'
ORDER BY ordinal_position;
