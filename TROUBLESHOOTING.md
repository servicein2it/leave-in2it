# 🔧 Troubleshooting Guide

## Issue 1: Email Templates Not Showing

### Symptoms:
- Email Settings page shows "No Templates Found"
- Or shows error message about database

### Solution:
You need to create the `email_templates` table in your Supabase database.

#### Quick Fix (5 minutes):

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Login and select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Run This SQL**:
   - Open file: `supabase-email-templates.sql`
   - Copy ALL content
   - Paste into SQL Editor
   - Click "Run"

4. **Verify Success**:
   - You should see: "4 rows affected"
   - Check Table Editor → `email_templates` → Should have 4 rows

5. **Refresh Your App**:
   - Go back to your Leave Management System
   - Refresh the page (Cmd+R or Ctrl+R)
   - Navigate to Admin → Email Settings
   - You should now see 4 templates! ✅

---

## Issue 2: Icons Not Showing

### Symptoms:
- Icons appear as empty squares or don't show at all
- Admin dashboard cards have no icons
- Buttons show no icons

### Causes & Solutions:

#### Cause 1: FontAwesome Not Loading
**Check**: Open browser console (F12) and look for errors

**Solution**: FontAwesome is already included in `client/index.html`:
```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
```

If it's not loading:
- Check your internet connection
- Try a different CDN version
- Or install FontAwesome locally: `npm install @fortawesome/fontawesome-free`

#### Cause 2: Content Security Policy (CSP)
If you see CSP errors in console:

**Solution**: Add this to your HTML `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com;">
```

#### Cause 3: Ad Blocker
Some ad blockers block FontAwesome CDN

**Solution**:
- Temporarily disable ad blocker
- Or use local FontAwesome installation

---

## Issue 3: CORS Font Errors

### Symptoms:
- Console shows: "Access to font at '...' has been blocked by CORS policy"
- External fonts not loading

### Solution:
✅ Already fixed! We removed external fonts and now use system fonts.

If you still see CORS errors:
1. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Check `client/src/index.css` - should use system fonts only
3. Restart dev server: `npm run dev`

---

## Issue 4: Database Connection Errors

### Symptoms:
- "Cannot connect to database"
- "DATABASE_URL is not defined"
- API returns 500 errors

### Solution:

1. **Check `.env` file exists** in project root

2. **Verify DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   ```

3. **Get correct URL from Supabase**:
   - Supabase Dashboard → Settings → Database
   - Copy "Connection string" (URI format)
   - Paste into `.env` file

4. **Restart server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## Issue 5: Gmail SMTP Not Working

### Symptoms:
- Test emails not sending
- "Gmail credentials not configured"
- Email errors in console

### Solution:

1. **Set up Gmail App Password**:
   - Enable 2-Factor Authentication on Gmail
   - Go to Google Account → Security → App passwords
   - Generate password for "Mail"
   - Copy 16-character password

2. **Update `.env` file**:
   ```env
   GMAIL_USER="your-email@gmail.com"
   GMAIL_APP_PASSWORD="your-16-char-password"
   ADMIN_EMAIL="admin@yourcompany.com"
   ```

3. **Restart server**:
   ```bash
   npm run dev
   ```

---

## Issue 6: Build Errors

### Symptoms:
- TypeScript errors
- Build fails
- "Cannot find module"

### Solution:

1. **Check TypeScript**:
   ```bash
   npm run check
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Clear cache and rebuild**:
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   npm run build
   ```

---

## Issue 7: Netlify Deployment Fails

### Symptoms:
- Build fails on Netlify
- "Module not found" errors
- Environment variables not working

### Solution:

1. **Set Environment Variables in Netlify**:
   - Site Settings → Environment Variables
   - Add all variables from `.env`:
     - `DATABASE_URL`
     - `GMAIL_USER`
     - `GMAIL_APP_PASSWORD`
     - `ADMIN_EMAIL`

2. **Check Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`

3. **Trigger Redeploy**:
   - Deploys → Trigger deploy → Clear cache and deploy

---

## Common Commands

### Development:
```bash
npm run dev          # Start development server
npm run check        # Check TypeScript errors
npm run build        # Build for production
```

### Database:
```bash
npm run db:push      # Push schema changes to database
```

### Git:
```bash
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
```

---

## Still Having Issues?

### Check These Files:
1. `.env` - Environment variables
2. `package.json` - Dependencies
3. `supabase-email-templates.sql` - Database schema
4. `client/index.html` - FontAwesome CDN
5. `server/routes.ts` - API endpoints

### Browser Console:
- Press F12 to open Developer Tools
- Check Console tab for errors
- Check Network tab for failed requests

### Server Logs:
- Look at terminal where `npm run dev` is running
- Check for error messages
- Look for database connection errors

---

## Quick Checklist

Before asking for help, verify:

- [ ] Database table `email_templates` exists in Supabase
- [ ] `.env` file has correct `DATABASE_URL`
- [ ] Gmail credentials are set in `.env`
- [ ] `npm install` completed successfully
- [ ] No TypeScript errors (`npm run check`)
- [ ] Server is running (`npm run dev`)
- [ ] Browser console shows no errors (F12)
- [ ] FontAwesome CDN is loading (check Network tab)

---

## Getting Help

If you're still stuck:

1. **Check error messages** - They usually tell you what's wrong
2. **Read documentation** - Check the README and other .md files
3. **Search the error** - Google the exact error message
4. **Check GitHub Issues** - Someone might have had the same problem

## Files to Reference:
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `FIX-EMAIL-TEMPLATES-ERROR.md` - Quick email fix
- `QUICK-SETUP-GUIDE.md` - Setup instructions
- `EMAIL-NOTIFICATION-SCENARIOS.md` - Email documentation
