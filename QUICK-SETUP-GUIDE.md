# 🚀 Quick Setup Guide - Email Templates

## Problem
Getting "Cannot GET /api/email-templates" error because the email templates table doesn't exist in your database yet.

## Solution
Run the SQL migration to create the email templates table and insert default templates.

## Steps

### 1. Open Supabase Dashboard
- Go to https://supabase.com
- Login and select your project

### 2. Open SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New query"** button

### 3. Copy and Run the SQL
- Open the file `supabase-email-templates.sql` in your project
- Copy ALL the content
- Paste it into the Supabase SQL Editor
- Click **"Run"** button

### 4. Verify Installation
The script will:
- ✅ Create `email_templates` table
- ✅ Add indexes for performance
- ✅ Create update trigger
- ✅ Insert 4 default email templates:
  1. Leave Request Submitted
  2. Leave Request Approved
  3. Leave Request Not Approved
  4. Admin Notification

### 5. Check Results
At the bottom of the SQL output, you should see:
```
template_name                              | template_type        | subject
-------------------------------------------|---------------------|------------------
Leave Request Submitted - Employee...      | LEAVE_SUBMITTED     | [IN2IT] Your...
Leave Request Approved - Confirmation      | LEAVE_APPROVED      | [IN2IT] Your...
Leave Request Not Approved - Notification  | LEAVE_REJECTED      | [IN2IT] Update...
Admin Alert - New Leave Request Pending    | ADMIN_NOTIFICATION  | [IN2IT] New...
```

### 6. Refresh Your App
- Go back to your Leave Management System
- Navigate to Admin → Email Settings
- You should now see all 4 email templates!

## Alternative: Run Complete Setup

If you haven't set up your database at all, run `supabase-complete-setup.sql` instead, which includes:
- Users table
- Leave requests table
- Sessions table
- Email templates table
- Sample data

## Troubleshooting

### Error: "relation email_templates does not exist"
- You haven't run the SQL script yet
- Run `supabase-email-templates.sql` in Supabase SQL Editor

### Error: "function update_updated_at_column() does not exist"
- Run the complete setup: `supabase-complete-setup.sql`
- This includes the trigger function

### Templates not showing
- Check if the SQL ran successfully
- Verify in Supabase: Table Editor → email_templates
- Should see 4 rows

### API still returns error
- Restart your development server: `npm run dev`
- Check DATABASE_URL in .env file
- Verify Supabase connection

## Next Steps

After setup:
1. ✅ Navigate to `/admin/email-settings`
2. ✅ Select a template to customize
3. ✅ Edit content, subject, sender info
4. ✅ Send test emails
5. ✅ Preview templates

## Need Help?

Check these files:
- `supabase-email-templates.sql` - Email templates setup
- `supabase-complete-setup.sql` - Complete database setup
- `EMAIL-NOTIFICATION-SCENARIOS.md` - Detailed documentation
- `DEPLOYMENT.md` - Full deployment guide
