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
  template_type VARCHAR NOT NULL, -- 'LEAVE_SUBMITTED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'ADMIN_NOTIFICATION'
  subject VARCHAR NOT NULL,
  sender_name VARCHAR NOT NULL,
  sender_email VARCHAR NOT NULL,
  banner_text VARCHAR NOT NULL,
  email_body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default email templates
INSERT INTO email_templates (
  id,
  template_name,
  template_type,
  subject,
  sender_name,
  sender_email,
  banner_text,
  email_body,
  is_active
) VALUES 
(
  'template-001',
  'Leave Request Submitted - Employee Confirmation',
  'LEAVE_SUBMITTED',
  '[IN2IT] Your Leave Request Has Been Submitted',
  'IN2IT Leave Management System',
  'noreply@in2it.co.th',
  'Leave Request Submitted Successfully',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;">
  <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{{employeeName}}</strong>,</p>
  
  <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Your leave request has been successfully submitted and is now pending approval from management. 
    You will receive a notification once your request has been reviewed.
  </p>

  <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <h3 style="color: #1e40af; margin: 0 0 16px 0; font-size: 17px; font-weight: 600;">
      Leave Request Details
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Leave Type:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{leaveType}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{totalDays}} day(s)</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Start Date:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{startDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">End Date:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{endDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Reason:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">{{reason}}</td>
      </tr>
    </table>
  </div>

  <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #92400e;">
      <strong>What happens next?</strong><br>
      Your manager will review your request within 24-48 hours. You''ll receive an email notification once a decision has been made.
    </p>
  </div>

  <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
    If you need to make any changes to your request, please contact HR or your direct supervisor.
  </p>
</div>',
  true
),
(
  'template-002',
  'Leave Request Approved - Confirmation',
  'LEAVE_APPROVED',
  '[IN2IT] Your Leave Request Has Been Approved',
  'IN2IT Leave Management System',
  'noreply@in2it.co.th',
  'Leave Request Approved',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;">
  <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{{employeeName}}</strong>,</p>
  
  <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-left: 4px solid #22c55e; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
    <div style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 24px; font-weight: 600; font-size: 14px; margin-bottom: 16px;">
      APPROVED
    </div>
    <h2 style="color: #166534; margin: 0 0 8px 0; font-size: 24px;">Leave Request Approved!</h2>
    <p style="color: #15803d; margin: 0; font-size: 15px;">Your leave has been approved by management</p>
  </div>

  <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    Great news! Your leave request has been <strong style="color: #22c55e;">approved</strong>. 
    You can proceed with your leave as planned. Please ensure all your work responsibilities are properly handed over before your leave begins.
  </p>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 17px; font-weight: 600;">
      Approved Leave Details
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Leave Type:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{leaveType}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{totalDays}} day(s)</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Start Date:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{startDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">End Date:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{endDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Approved By:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{approver}}</td>
      </tr>
    </table>
  </div>

  <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #1e40af;">
      <strong>Important Reminders:</strong><br>
      - Ensure all pending tasks are completed or delegated<br>
      - Update your out-of-office email responder<br>
      - Inform your team about your absence<br>
      - Keep your contact information updated for emergencies
    </p>
  </div>

  <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
    Have a great time off! If you have any questions, please contact HR at <a href="mailto:hr@in2it.co.th" style="color: #3b82f6;">hr@in2it.co.th</a>
  </p>
</div>',
  true
),
(
  'template-003',
  'Leave Request Not Approved - Notification',
  'LEAVE_REJECTED',
  '[IN2IT] Update on Your Leave Request',
  'IN2IT Leave Management System',
  'noreply@in2it.co.th',
  'Leave Request Status Update',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;">
  <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>{{employeeName}}</strong>,</p>
  
  <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left: 4px solid #ef4444; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
    <div style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 24px; font-weight: 600; font-size: 14px; margin-bottom: 16px;">
      NOT APPROVED
    </div>
    <h2 style="color: #991b1b; margin: 0 0 8px 0; font-size: 24px;">Leave Request Not Approved</h2>
    <p style="color: #dc2626; margin: 0; font-size: 15px;">Your leave request requires further discussion</p>
  </div>

  <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    We regret to inform you that your leave request could not be approved at this time. 
    This decision was made after careful consideration of current business needs and team availability.
  </p>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 17px; font-weight: 600;">
      Request Details
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Leave Type:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{leaveType}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{totalDays}} day(s)</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Requested Dates:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{startDate}} - {{endDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Reviewed By:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{approver}}</td>
      </tr>
    </table>
  </div>

  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #92400e;">
      <strong>Next Steps:</strong><br>
      - Schedule a meeting with your supervisor to discuss alternative dates<br>
      - Consider submitting a request for different dates that may work better<br>
      - Contact HR if you need assistance with leave planning<br>
      - Review company leave policies for guidance
    </p>
  </div>

  <p style="font-size: 15px; line-height: 1.6; margin: 20px 0;">
    We understand this may be disappointing. Please feel free to discuss this decision with your manager 
    or reach out to HR to explore alternative options or understand the reasoning behind this decision.
  </p>

  <div style="background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #475569;">
      <strong>Need Help?</strong><br>
      Contact HR: <a href="mailto:hr@in2it.co.th" style="color: #3b82f6;">hr@in2it.co.th</a><br>
      Phone: 02-123-4567
    </p>
  </div>

  <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
    Thank you for your understanding and cooperation.
  </p>
</div>',
  true
),
(
  'template-004',
  'Admin Alert - New Leave Request Pending',
  'ADMIN_NOTIFICATION',
  '[IN2IT] New Leave Request from {{employeeName}} - Action Required',
  'IN2IT Leave Management System',
  'noreply@in2it.co.th',
  'New Leave Request Requires Your Attention',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, sans-serif; color: #1f2937;">
  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
    <div style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 24px; font-weight: 600; font-size: 14px; margin-bottom: 16px;">
      ACTION REQUIRED
    </div>
    <h2 style="color: #92400e; margin: 0 0 8px 0; font-size: 24px;">New Leave Request</h2>
    <p style="color: #b45309; margin: 0; font-size: 15px;">Pending your review and approval</p>
  </div>

  <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
    <strong>{{employeeName}}</strong> ({{position}}) has submitted a new leave request that requires your attention and approval.
  </p>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 17px; font-weight: 600;">
      Employee Information
    </h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Employee:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{employeeName}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Position:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{position}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><a href="mailto:{{email}}" style="color: #3b82f6;">{{email}}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">{{phone}}</td>
      </tr>
    </table>

    <h3 style="color: #1e293b; margin: 20px 0 16px 0; font-size: 17px; font-weight: 600;">
      Leave Request Details
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Leave Type:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{leaveType}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{totalDays}} day(s)</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Start Date:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{startDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">End Date:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">{{endDate}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Reason:</td>
        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">{{reason}}</td>
      </tr>
    </table>
  </div>

  <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 14px; color: #991b1b;">
      <strong>Action Required:</strong><br>
      Please review and respond to this leave request within 24-48 hours. 
      The employee is waiting for your decision to plan accordingly.
    </p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="https://your-app-url.com/admin" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
      Review Leave Request
    </a>
  </div>

  <p style="font-size: 14px; color: #64748b; margin-top: 24px; text-align: center;">
    Login to the admin dashboard to approve or decline this request
  </p>
</div>',
  true
) ON CONFLICT (template_name) DO NOTHING;

-- Verify templates
SELECT 
  template_name,
  template_type,
  subject,
  sender_name,
  is_active
FROM email_templates
ORDER BY template_type;