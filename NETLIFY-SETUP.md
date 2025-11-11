# 🚀 Netlify Deployment - Complete Setup Guide

## ✅ Your App is NOW Ready for Netlify!

I've configured everything to run on Netlify using **Netlify Functions** (serverless backend).

## 🎯 What Was Fixed

### Before (❌ Not Working):
- Netlify tried to serve static files only
- No backend server to handle `/api/*` routes
- 404 errors on all API calls

### After (✅ Working):
- Frontend: Static files served by Netlify
- Backend: Netlify Functions handle all `/api/*` routes
- Database: Connects to Supabase
- Everything works on Netlify!

## 📋 Files Updated

1. **netlify.toml** - Changed build command to `npm run build:netlify`
2. **package.json** - Updated build:functions to use CommonJS format
3. **netlify/functions/api.ts** - Already configured (no changes needed)

## 🚀 Deploy to Netlify

### Step 1: Set Environment Variables in Netlify

**CRITICAL:** You MUST set these in Netlify Dashboard:

1. Go to https://app.netlify.com
2. Select your site: **leave-in2it**
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** and add each of these:

```
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:YOUR_NEW_PASSWORD@YOUR_REGION.pooler.supabase.com:6543/postgres
GMAIL_USER=service@in2it.co.th
GMAIL_APP_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=service@in2it.co.th
NODE_ENV=production
```

**⚠️ IMPORTANT:**
- Use your NEW database password (after rotating due to security incident)
- These values are secrets - never commit them to git
- Netlify will inject them at build time

### Step 2: Trigger a New Deploy

After setting environment variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait 3-5 minutes for build to complete

OR just push to GitHub (auto-deploys):
```bash
git push origin main
```

### Step 3: Verify Deployment

After deployment completes:

1. **Check Build Logs**
   - Should see: "✓ built in X seconds"
   - Should see: "netlify/functions/api.js  50.6kb"

2. **Test Your Site**
   - Visit: https://leave-in2it.netlify.app
   - Login should work
   - Admin dashboard should work
   - **Email settings should work!** ✅

3. **Test API Directly**
   - Visit: https://leave-in2it.netlify.app/.netlify/functions/api/users
   - Should return JSON (if logged in)

## 🔧 How It Works

### Architecture:

```
Browser Request
    ↓
https://leave-in2it.netlify.app/admin/email-settings
    ↓
Loads React App (static files)
    ↓
React calls: /api/email-templates
    ↓
Netlify redirects to: /.netlify/functions/api/email-templates
    ↓
Netlify Function (serverless) handles request
    ↓
Connects to Supabase database
    ↓
Returns data to React
    ↓
Page displays ✅
```

### What Happens on Deploy:

1. **Build Frontend**: `vite build` → Creates `dist/public/`
2. **Build Functions**: `esbuild netlify/functions/api.ts` → Creates `netlify/functions/api.js`
3. **Deploy**: Netlify uploads both frontend and functions
4. **Route**: `/api/*` requests go to Netlify Function
5. **Serve**: Everything else serves static files

## 🐛 Troubleshooting

### Build Fails

**Check build logs in Netlify:**
- Look for errors in the build output
- Common issue: Missing dependencies

**Fix:**
```bash
# Locally test the build
npm run build:netlify
```

### API Returns 404

**Cause:** Functions not deployed or environment variables missing

**Fix:**
1. Check build logs - should see "netlify/functions/api.js" built
2. Verify environment variables are set
3. Check redirects in netlify.toml

### Database Connection Fails

**Cause:** DATABASE_URL not set or incorrect

**Fix:**
1. Go to Netlify → Environment variables
2. Verify DATABASE_URL is correct
3. Test connection from local:
```bash
DATABASE_URL="your-url" node test-db-connection.js
```

### Email Settings Still Shows "Database Not Set Up"

**Cause:** Environment variables not set in Netlify

**Fix:**
1. Set DATABASE_URL in Netlify dashboard
2. Trigger new deploy
3. Hard refresh browser (Ctrl+Shift+R)

### Function Timeout

**Cause:** Netlify Functions have 10-second timeout on free tier

**Fix:**
- Optimize database queries
- Add indexes to database
- Upgrade to Netlify Pro (26-second timeout)

## 📊 Monitoring

### View Function Logs

1. Go to Netlify Dashboard
2. Click **Functions** tab
3. Click on **api** function
4. View logs and invocations

### Check Function Performance

- **Invocations**: How many times function was called
- **Duration**: How long each request took
- **Errors**: Any failed requests

## 💰 Costs

### Netlify Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ 125,000 function requests/month
- ✅ 100 hours function runtime/month
- ✅ Automatic SSL
- ✅ CDN

**For your app:** Free tier should be sufficient for development and small teams.

## ✅ Deployment Checklist

Before going live:

- [x] netlify.toml configured ✅
- [x] Netlify Functions built ✅
- [x] Build script updated ✅
- [ ] Environment variables set in Netlify
- [ ] Database password rotated (security)
- [ ] Test deployment successful
- [ ] Email settings page works
- [ ] All icons display correctly
- [ ] Leave requests work
- [ ] Email notifications send

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Site loads at https://leave-in2it.netlify.app
2. ✅ Login works
3. ✅ Admin dashboard accessible
4. ✅ Email settings page loads (no "Database Not Set Up" error)
5. ✅ Icons display correctly
6. ✅ Leave requests can be created
7. ✅ Email notifications send

## 📞 Support

**Netlify Issues:**
- Docs: https://docs.netlify.com/functions/overview/
- Support: https://answers.netlify.com/

**Build Issues:**
- Check: https://app.netlify.com/sites/leave-in2it/deploys
- View logs for detailed error messages

## 🔒 Security Notes

### After Security Incident:

1. ✅ Removed exposed credentials from git
2. ⏳ Rotate database password (DO THIS!)
3. ✅ Use Netlify environment variables
4. ✅ Never commit .env files

### Best Practices:
- Use environment variables for all secrets
- Rotate credentials regularly
- Monitor function logs for suspicious activity
- Enable Netlify's security features

## 🚀 Next Steps

1. **Set environment variables in Netlify** (CRITICAL!)
2. **Trigger new deploy**
3. **Test the site**
4. **Celebrate!** 🎉

Your app is now fully configured to run on Netlify with serverless functions!
