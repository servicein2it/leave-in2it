-- Simple Email Templates Setup Script
-- Run this entire script in Supabase SQL Editor

-- Drop existing table if it exists (clean start)
DROP TABLE IF EXISTS email_templates CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the update function
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the email_templates table
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

-- Create indexes
CREATE INDEX idx_email_templates_type ON email_templates(template_type);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

-- Create trigger
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO email_templates (id, template_name, template_type, subject, sender_name, sender_email, banner_text, email_body, is_active) VALUES 
('template-001', 'Leave Request Submitted - Employee Confirmation', 'LEAVE_SUBMITTED', '[IN2IT] Your Leave Request Has Been Submitted', 'IN2IT Leave Management System', 'noreply@in2it.co.th', 'Leave Request Submitted Successfully', '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;"><p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{{employeeName}}</strong>,</p><p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Your leave request has been successfully submitted.</p></div>', true),
('template-002', 'Leave Request Approved - Confirmation', 'LEAVE_APPROVED', '[IN2IT] Your Leave Request Has Been Approved', 'IN2IT Leave Management System', 'noreply@in2it.co.th', 'Leave Request Approved', '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;"><p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{{employeeName}}</strong>,</p><p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Your leave request has been approved.</p></div>', true),
('template-003', 'Leave Request Not Approved - Notification', 'LEAVE_REJECTED', '[IN2IT] Update on Your Leave Request', 'IN2IT Leave Management System', 'noreply@in2it.co.th', 'Leave Request Status Update', '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;"><p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{{employeeName}}</strong>,</p><p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Your leave request could not be approved at this time.</p></div>', true),
('template-004', 'Admin Alert - New Leave Request Pending', 'ADMIN_NOTIFICATION', '[IN2IT] New Leave Request from {{employeeName}} - Action Required', 'IN2IT Leave Management System', 'noreply@in2it.co.th', 'New Leave Request Requires Your Attention', '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;"><p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;"><strong>{{employeeName}}</strong> has submitted a new leave request.</p></div>', true);

-- Verify the setup
SELECT COUNT(*) as total_templates FROM email_templates;
SELECT id, template_name, template_type FROM email_templates ORDER BY template_type;
