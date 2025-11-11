-- Run this in Supabase SQL Editor to check if the table exists

-- Step 1: Check if table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'email_templates';

-- If the above returns no rows, the table doesn't exist

-- Step 2: Check all tables in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Step 3: If email_templates doesn't exist, run this to create it:
-- (Copy everything below and run it)

DROP TABLE IF EXISTS email_templates CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE email_templates (
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

CREATE INDEX idx_email_templates_type ON email_templates(template_type);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO email_templates (id, template_name, template_type, subject, sender_name, sender_email, banner_text, email_body, is_active) VALUES 
('template-001', 'Leave Request Submitted', 'LEAVE_SUBMITTED', '[IN2IT] Leave Request Submitted', 'IN2IT Leave System', 'noreply@in2it.co.th', 'Request Submitted', '<p>Your leave request has been submitted.</p>', true),
('template-002', 'Leave Request Approved', 'LEAVE_APPROVED', '[IN2IT] Leave Request Approved', 'IN2IT Leave System', 'noreply@in2it.co.th', 'Request Approved', '<p>Your leave request has been approved.</p>', true),
('template-003', 'Leave Request Rejected', 'LEAVE_REJECTED', '[IN2IT] Leave Request Update', 'IN2IT Leave System', 'noreply@in2it.co.th', 'Request Update', '<p>Your leave request was not approved.</p>', true),
('template-004', 'Admin Notification', 'ADMIN_NOTIFICATION', '[IN2IT] New Leave Request', 'IN2IT Leave System', 'noreply@in2it.co.th', 'New Request', '<p>New leave request pending.</p>', true);

-- Step 4: Verify the data was inserted
SELECT COUNT(*) as total_templates FROM email_templates;
SELECT id, template_name, template_type FROM email_templates;
