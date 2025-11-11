# Production Deployment Guide

## Issue Fixed
✅ Email Settings page now has admin role protection and will work in production

## What Was Changed
1. Added authentication check to `EmailSettingsPage.tsx`
2. Non-admin users are automatically redirected to employee page
3. Page only renders for authenticated admin users

## How to Deploy to Production

### Option 1: Deploy to Netlify (Recommended)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://app.netlify.com
   - Drag and drop the `dist/public` folder
   - Or use Netlify CLI:
     ```bash
     netlify deploy --prod --dir=dist/public
     ```

3. **Set Environment Variables in Netlify**
   - Go to Site Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL=your-supabase-connection-string
     GMAIL_USER=service@in2it.co.th
     GMAIL_APP_PASSWORD=your-gmail-app-password
     ADMIN_EMAIL=service@in2it.co.th
     ```

4. **Configure Redirects**
   - Netlify should automatically handle SPA routing
   - If not, create `dist/public/_redirects`:
     ```
     /*    /index.html   200
     ```

### Option 2: Deploy to Your Own Server

1. **Build the application**
   ```bash
   npm run build
   npm run build:server
   ```

2. **Upload files to server**
   - Upload `dist/` folder
   - Upload `node_modules/` (or run `npm install --production` on server)
   - Upload `.env` file with production values

3. **Start the production server**
   ```bash
   NODE_ENV=production node dist/index.js
   ```

4. **Use PM2 for process management** (recommended)
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name leave-management
   pm2 save
   pm2 startup
   ```

### Option 3: Deploy to Replit

1. **Push to GitHub** (already done ✅)
2. **Import to Replit**
   - Go to https://replit.com
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Select your repository

3. **Set Environment Variables**
   - Click "Secrets" (lock icon)
   - Add all variables from `.env`

4. **Run the application**
   - Replit will automatically detect and run `npm run dev`

## Verify Deployment

After deployment, test these URLs:

1. **Login Page**: `https://your-domain.com/`
2. **Admin Dashboard**: `https://your-domain.com/admin`
3. **Email Settings**: `https://your-domain.com/admin/email-settings`
4. **Employee Management**: `https://your-domain.com/admin/employees`

## Troubleshooting

### Email Settings page shows 404
- **Cause**: Server not configured for SPA routing
- **Fix**: Add catch-all route or `_redirects` file (see above)

### Email Settings shows "Database Not Set Up"
- **Cause**: `email_templates` table doesn't exist
- **Fix**: Run `create-email-templates-simple.sql` in Supabase

### Icons not showing
- **Cause**: Build issue or CDN problem
- **Fix**: Already fixed with lucide-react icons ✅

### Can't access as admin
- **Cause**: User role not set correctly
- **Fix**: Check database - user.role should be 'ADMIN'

## Post-Deployment Checklist

- [ ] Login works
- [ ] Admin can access dashboard
- [ ] Admin can access email settings
- [ ] Admin can access employee management
- [ ] Icons display correctly
- [ ] Email templates load (after running SQL)
- [ ] Leave requests work
- [ ] Email notifications work

## Environment Variables Required

```env
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@YOUR_REGION.pooler.supabase.com:6543/postgres
GMAIL_USER=your-email@domain.com
GMAIL_APP_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=your-admin@domain.com
NODE_ENV=production
PORT=5000
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` file to git
- Never hardcode credentials in source code
- Use environment variables in production
- Rotate credentials if exposed

## Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs
3. Verify environment variables are set
4. Ensure database is accessible
5. Confirm email templates table exists
