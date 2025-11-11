# Netlify Deployment Guide

## ✅ Repository Connected to Netlify

Your GitHub repository is connected to Netlify and will auto-deploy on push.

## 🚀 What Happens When You Push to Git

1. **GitHub receives the push**
2. **Netlify detects the change**
3. **Netlify runs the build**
4. **Site is automatically deployed**

## ⚙️ Netlify Configuration

### Build Settings

Make sure these are set in Netlify:

**Build Command:**
```
npm run build
```

**Publish Directory:**
```
dist/public
```

**Node Version:**
```
20.x
```

## 🔐 Environment Variables (CRITICAL!)

You MUST set these in Netlify Dashboard:

1. Go to **Site Settings** → **Environment Variables**
2. Add these variables:

```
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:YOUR_NEW_PASSWORD@YOUR_REGION.pooler.supabase.com:6543/postgres
GMAIL_USER=service@in2it.co.th
GMAIL_APP_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=service@in2it.co.th
NODE_ENV=production
```

**⚠️ IMPORTANT:** 
- Use your NEW database password (after rotating due to the security incident)
- Never commit these values to git
- Update them in Netlify dashboard only

## 📋 Deployment Checklist

Before deploying to production:

- [x] Code pushed to GitHub ✅
- [x] Build successful locally ✅
- [x] Icons fixed (lucide-react) ✅
- [x] Email templates table exists ✅
- [x] Admin role protection added ✅
- [ ] Environment variables set in Netlify
- [ ] Database password rotated (security incident)
- [ ] Test deployment works

## 🔄 How to Deploy

### Automatic Deployment (Recommended)
Just push to main branch:
```bash
git push origin main
```
Netlify will automatically deploy!

### Manual Deployment
1. Go to Netlify Dashboard
2. Click **"Trigger deploy"**
3. Select **"Deploy site"**

## 🧪 Testing After Deployment

After Netlify deploys, test these URLs:

1. **Homepage**: `https://your-site.netlify.app/`
2. **Login**: Should redirect to login page
3. **Admin Dashboard**: `https://your-site.netlify.app/admin`
4. **Email Settings**: `https://your-site.netlify.app/admin/email-settings`
5. **Employee Management**: `https://your-site.netlify.app/admin/employees`

### What to Check:
- ✅ Login works
- ✅ Icons display correctly
- ✅ Admin can access all pages
- ✅ Email settings loads (no "Database Not Set Up" error)
- ✅ Leave requests work
- ✅ Email notifications send

## 🐛 Troubleshooting

### Build Fails on Netlify

**Check build logs:**
1. Go to Netlify Dashboard
2. Click on the failed deploy
3. View build logs

**Common issues:**
- Missing dependencies → Check package.json
- Build command wrong → Should be `npm run build`
- Node version mismatch → Set to 20.x

### Email Settings Shows "Database Not Set Up"

**Cause:** Environment variables not set in Netlify

**Fix:**
1. Go to Site Settings → Environment Variables
2. Add `DATABASE_URL` with your Supabase connection string
3. Redeploy the site

### Icons Not Showing

**Cause:** Build cache issue

**Fix:**
1. Go to Site Settings → Build & Deploy
2. Click "Clear cache and deploy site"

### 404 on Routes

**Cause:** SPA routing not configured

**Fix:**
Create `dist/public/_redirects` file:
```
/*    /index.html   200
```

Or add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📊 Monitoring

### Check Deployment Status
- Netlify Dashboard shows deployment status
- Green checkmark = successful
- Red X = failed (check logs)

### View Logs
- **Build logs**: Netlify Dashboard → Deploys → Click deploy
- **Function logs**: Netlify Dashboard → Functions
- **Analytics**: Netlify Dashboard → Analytics

## 🔒 Security Notes

### After the Security Incident:

1. **Database password rotated** ✅ (You did this, right?)
2. **Environment variables updated** in Netlify
3. **Old credentials removed** from git ✅
4. **Git history cleaned** (optional but recommended)

### Best Practices:
- Never commit `.env` files
- Use Netlify environment variables
- Rotate credentials regularly
- Monitor access logs
- Enable 2FA on Netlify

## 📞 Support

**Netlify Issues:**
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support/

**Application Issues:**
- Check server logs in Netlify Functions
- Check browser console for errors
- Verify database connection
- Test API endpoints

## 🎉 Success!

Once deployed successfully:
1. Your site is live at `https://your-site.netlify.app`
2. Auto-deploys on every git push
3. SSL certificate automatically provisioned
4. CDN distribution worldwide

**Current Status:**
- ✅ Latest code pushed to GitHub
- ✅ Build successful
- ✅ Ready for Netlify deployment
- ⏳ Waiting for Netlify to deploy

Check your Netlify dashboard for deployment status!
