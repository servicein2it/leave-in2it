# Email Templates Database Setup Guide

## Problem
You're seeing "Database Not Set Up" error because the `email_templates` table doesn't exist in your Supabase database.

## Solution - Follow These Steps EXACTLY

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **Leave Management System**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Setup Script
1. Click **"New Query"** button
2. Copy the ENTIRE content from `create-email-templates-simple.sql`
3. Paste it into the SQL Editor
4. Click **"Run"** button (or press Cmd/Ctrl + Enter)

### Step 3: Verify Success
You should see output like:
```
total_templates: 4
```

And a list of 4 templates:
- template-001 (LEAVE_SUBMITTED)
- template-002 (LEAVE_APPROVED)
- template-003 (LEAVE_REJECTED)
- template-004 (ADMIN_NOTIFICATION)

### Step 4: Refresh Your Application
1. Go back to your Leave Management System
2. Navigate to Email Settings page
3. Press **Ctrl+Shift+R** (or Cmd+Shift+R on Mac) to hard refresh
4. The error should be gone!

## Troubleshooting

### If you still see the error:

**Check 1: Verify the table exists**
Run this query in Supabase SQL Editor:
```sql
SELECT * FROM email_templates;
```

**Check 2: Check your DATABASE_URL**
Make sure your `.env` file has the correct Supabase connection string:
```
DATABASE_URL="postgresql://postgres.cjqdbdfsyspbxeyxqcgh:In2it2018!15@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**Check 3: Restart your development server**
```bash
# Kill the current server
# Then restart with:
PORT=3000 NODE_ENV=development DATABASE_URL="your-database-url" npx tsx server/index.ts
```

**Check 4: Check for SQL errors**
If the SQL script fails, look at the error message in Supabase SQL Editor. Common issues:
- Permission denied → Make sure you're logged in as the database owner
- Syntax error → Make sure you copied the ENTIRE script
- Connection timeout → Try running the script again

## Files in This Project

- `supabase-email-templates.sql` - Full script with all template content
- `create-email-templates-simple.sql` - Simplified script (USE THIS ONE)
- `verify-email-templates.sql` - Diagnostic script to check if table exists

## Need Help?

If you're still having issues:
1. Take a screenshot of the Supabase SQL Editor showing the error
2. Check the browser console for any error messages
3. Check the server terminal for any error logs
