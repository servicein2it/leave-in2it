# Email Notification Scenarios

## 📧 Email Notification System Overview

The Leave Management System includes a comprehensive email notification system with customizable templates for different scenarios.

## 🎯 Notification Scenarios

### 1. **Leave Request Submitted** (LEAVE_SUBMITTED)
**Trigger**: Automatically sent when an employee submits a new leave request through the system

**Recipients**: Employee who submitted the request

**Purpose**: 
- Confirm successful submission of leave request
- Provide request details for employee's records
- Set expectations for approval timeline
- Reassure employee that request is being processed

**Email Content**:
- Professional greeting with employee name
- Confirmation message with success indicator
- Complete leave request details in formatted table
- Timeline expectations (24-48 hours)
- Next steps information
- HR contact information

**Default Variables**:
- `{{employeeName}}` - Employee's full name
- `{{leaveType}}` - Type of leave requested
- `{{totalDays}}` - Number of days requested
- `{{startDate}}` - Leave start date (formatted)
- `{{endDate}}` - Leave end date (formatted)
- `{{reason}}` - Reason for leave

**Default Subject**: `[IN2IT] ✅ Your Leave Request Has Been Submitted`

**Design Features**:
- Blue gradient info box with request details
- Yellow warning box for "what happens next"
- Professional typography with clear hierarchy
- Mobile-responsive design

---

### 2. **Leave Request Approved** (LEAVE_APPROVED)
**Trigger**: Automatically sent when an admin/manager approves a leave request in the system

**Recipients**: Employee whose leave was approved

**Purpose**: 
- Notify employee of approval decision
- Confirm approved leave dates
- Provide important reminders for leave preparation
- Show who approved the request
- Celebrate the approval with positive messaging

**Email Content**:
- Congratulatory message with success icon (✅)
- Green gradient celebration box
- Complete approved leave details
- Important reminders checklist:
  - Complete pending tasks
  - Set out-of-office responder
  - Inform team members
  - Update emergency contact info
- HR contact information
- Positive, encouraging tone

**Default Variables**:
- `{{employeeName}}` - Employee's full name
- `{{leaveType}}` - Type of leave
- `{{totalDays}}` - Number of days approved
- `{{startDate}}` - Leave start date (formatted)
- `{{endDate}}` - Leave end date (formatted)
- `{{reason}}` - Reason for leave
- `{{approver}}` - Name of person who approved

**Default Subject**: `[IN2IT] ✅ Your Leave Request Has Been Approved`

**Additional Actions**:
- Leave balance is automatically deducted from employee's account
- Leave status updated to "อนุมัติ" (Approved)
- Calendar is updated with approved leave dates

**Design Features**:
- Green gradient success banner with checkmark
- Blue info box with reminders
- Professional and celebratory tone
- Clear call-to-action for preparation

---

### 3. **Leave Request Not Approved** (LEAVE_REJECTED)
**Trigger**: Automatically sent when an admin/manager does not approve a leave request

**Recipients**: Employee whose leave was not approved

**Purpose**: 
- Inform employee of decision professionally and empathetically
- Provide clear next steps and alternatives
- Maintain positive employee relations
- Encourage communication with management
- Offer support and guidance

**Email Content**:
- Empathetic opening message
- Professional notification with info icon (ℹ️)
- Red/orange gradient notification box (not harsh red)
- Complete request details for reference
- Constructive "Next Steps" section:
  - Schedule meeting with supervisor
  - Consider alternative dates
  - Contact HR for assistance
  - Review leave policies
- Encouraging message about discussing alternatives
- Multiple contact options (email, phone)
- Professional and supportive tone throughout

**Default Variables**:
- `{{employeeName}}` - Employee's full name
- `{{leaveType}}` - Type of leave
- `{{totalDays}}` - Number of days requested
- `{{startDate}}` - Leave start date (formatted)
- `{{endDate}}` - Leave end date (formatted)
- `{{reason}}` - Reason for leave
- `{{approver}}` - Name of person who reviewed

**Default Subject**: `[IN2IT] ℹ️ Update on Your Leave Request`

**Additional Actions**:
- Leave status updated to "ปฏิเสธ" (Not Approved)
- No balance deduction occurs
- Request remains in history for reference

**Design Features**:
- Soft red/orange gradient (not aggressive)
- Yellow "Next Steps" action box
- Gray contact information box
- Empathetic and professional language
- Focus on solutions and alternatives

**Important Notes**:
- Tone is professional, not punitive
- Encourages dialogue and understanding
- Provides clear paths forward
- Maintains employee morale

---

### 4. **Admin Notification - New Leave Request** (ADMIN_NOTIFICATION)
**Trigger**: When an employee submits a new leave request

**Recipients**: Admin/HR personnel (configured in environment variables)

**Purpose**: Alert administrators that a new leave request requires their attention

**Default Variables**:
- `{{employeeName}}` - Employee's full name
- `{{position}}` - Employee's position
- `{{leaveType}}` - Type of leave requested
- `{{totalDays}}` - Number of days requested
- `{{startDate}}` - Leave start date
- `{{endDate}}` - Leave end date
- `{{reason}}` - Reason for leave
- `{{email}}` - Employee's email
- `{{phone}}` - Employee's phone number

**Default Subject**: `[IN2IT] คำขอลาใหม่รอการอนุมัติ - {{employeeName}}`

**Additional Info**:
- Includes employee contact information
- Marked as urgent/priority
- Sent immediately upon request submission

---

## 🎨 Customization Features

### Available Customizations:

1. **Subject Line**
   - Customize the email subject for each scenario
   - Use variables for dynamic content

2. **Sender Name**
   - Change the display name of the email sender
   - Default: "IN2IT Leave Management"

3. **Sender Email**
   - Configure the from email address
   - Must match Gmail SMTP configuration

4. **Banner Text**
   - Customize the header banner text
   - Appears at the top of the email

5. **Email Body**
   - Full HTML customization
   - Use variables for dynamic content
   - Supports HTML formatting

6. **Test Email**
   - Send test emails to verify templates
   - Uses sample data for preview

---

## 📝 Template Variables Reference

### Common Variables (Available in all templates):
- `{{employeeName}}` - Full name of the employee
- `{{leaveType}}` - Type of leave (e.g., ลาพักผ่อน, ลาป่วย)
- `{{totalDays}}` - Number of days
- `{{startDate}}` - Start date (formatted)
- `{{endDate}}` - End date (formatted)
- `{{reason}}` - Reason for leave

### Approval/Rejection Specific:
- `{{approver}}` - Name of the approver/rejector

### Admin Notification Specific:
- `{{position}}` - Employee's job position
- `{{email}}` - Employee's email address
- `{{phone}}` - Employee's phone number

---

## 🔧 Configuration Steps

### 1. Access Email Settings
- Login as Admin
- Go to Admin Dashboard
- Click "ตั้งค่าอีเมล" (Email Settings)

### 2. Select Template
- Choose from 4 available templates
- Each template corresponds to a notification scenario

### 3. Customize Content
- **Content Tab**: Edit subject, banner, and email body
- **Settings Tab**: Configure sender name and email
- **Test Tab**: Send test emails

### 4. Save Changes
- Click "บันทึก" (Save) to apply changes
- Changes take effect immediately

### 5. Test Email
- Enter a test email address
- Click "ส่งอีเมลทดสอบ" (Send Test Email)
- Verify the email appearance and content

---

## 🎯 Best Practices

1. **Use Clear Subject Lines**
   - Include company name or system identifier
   - Use action-oriented language
   - Include key information (e.g., employee name, status)

2. **Keep Content Concise**
   - Focus on essential information
   - Use bullet points for details
   - Include clear call-to-action

3. **Test Before Deploying**
   - Always send test emails
   - Check on different email clients
   - Verify all variables are replaced correctly

4. **Maintain Professional Tone**
   - Use appropriate language
   - Include company branding
   - Provide contact information

5. **Mobile-Friendly Design**
   - Templates are responsive by default
   - Keep content width reasonable
   - Use readable font sizes

---

## 🔒 Security Considerations

1. **Email Configuration**
   - Use Gmail App Password (not regular password)
   - Store credentials in environment variables
   - Never commit credentials to version control

2. **Recipient Privacy**
   - Emails sent individually (no CC/BCC exposure)
   - Personal information only sent to relevant parties
   - Admin notifications separate from employee notifications

3. **Content Security**
   - HTML is sanitized
   - No external scripts allowed
   - Safe variable replacement

---

## 📊 Monitoring

### Email Delivery Status
- Check server logs for email sending status
- Monitor Gmail SMTP quota (500 emails/day for free accounts)
- Track failed deliveries

### Template Usage
- All templates logged in database
- Track last updated timestamp
- Monitor active/inactive status

---

## 🆘 Troubleshooting

### Email Not Sending
1. Verify Gmail credentials in .env
2. Check Gmail App Password is correct
3. Ensure 2FA is enabled on Gmail account
4. Check server logs for errors

### Variables Not Replacing
1. Verify variable syntax: `{{variableName}}`
2. Check template has correct variable names
3. Test with sample data first

### Formatting Issues
1. Preview template before saving
2. Test on multiple email clients
3. Keep HTML simple and standard

---

## 📈 Future Enhancements

Potential features for future versions:
- Email scheduling
- Bulk notifications
- Email analytics
- Multiple language support
- Attachment support
- Rich text editor
- Template versioning
- A/B testing