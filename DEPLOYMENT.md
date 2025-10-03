# Netlify Deployment Guide

## 🚀 Quick Deployment Checklist

### 1. Prerequisites Setup

#### Database (Required)
- [ ] Set up PostgreSQL database (recommended providers):
  - **Neon** (free tier available): https://neon.tech
  - **Supabase** (free tier available): https://supabase.com
  - **Railway** (free tier available): https://railway.app
- [ ] Get your `DATABASE_URL` connection string

#### Gmail SMTP (Required for email notifications)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password:
  1. Go to Google Account → Security → 2-Step Verification
  2. Click "App passwords"
  3. Generate password for "Mail"
  4. Copy the 16-character password

### 2. Netlify Setup

#### Connect Repository
- [ ] Push your code to GitHub/GitLab
- [ ] Connect repository to Netlify
- [ ] Set build settings:
  - **Build command**: `npm run build`
  - **Publish directory**: `dist/public`
  - **Functions directory**: `netlify/functions`

#### Environment Variables
Go to Site Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://username:password@host:port/database
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=admin@yourcompany.com
```

### 3. Deploy

- [ ] Push to main branch or trigger manual deploy
- [ ] Wait for build to complete
- [ ] Test the deployment

### 4. Post-Deployment

- [ ] Test login with default admin account:
  - Username: `admin`
  - Password: `admin`
- [ ] **IMPORTANT**: Change admin password immediately
- [ ] Test email notifications
- [ ] Create employee accounts
- [ ] Test leave request workflow

## 🔧 Build Commands

```bash
# Build frontend only
npm run build

# Build Netlify functions
npm run build:functions

# Build everything for Netlify
npm run build:netlify
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Ensure database allows external connections
   - Check if database is running

2. **Email Not Sending**
   - Verify Gmail credentials
   - Check if 2FA is enabled
   - Ensure App Password is correct (not regular password)

3. **Function Timeout**
   - Netlify functions have 10s timeout on free tier
   - Consider upgrading for longer timeouts

4. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Logs and Debugging

- **Netlify Functions Logs**: Site Dashboard → Functions → View logs
- **Build Logs**: Site Dashboard → Deploys → Build log
- **Real-time Logs**: `netlify dev` for local testing

## 📊 Performance Optimization

### Frontend
- Code splitting is already configured
- Consider lazy loading for large components
- Optimize images and assets

### Backend
- Database connection pooling is configured
- Consider caching for frequently accessed data
- Monitor function execution time

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use Netlify's environment variables
   - Rotate credentials regularly

2. **Database Security**
   - Use SSL connections (already configured)
   - Limit database access by IP if possible
   - Regular backups

3. **Authentication**
   - Change default admin password
   - Consider implementing stronger password policies
   - Add session timeout if needed

## 📈 Monitoring

- **Netlify Analytics**: Built-in traffic analytics
- **Function Monitoring**: Execution time and errors
- **Database Monitoring**: Use your database provider's monitoring tools

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Netlify build logs
3. Check function execution logs
4. Verify environment variables are set correctly

## 📝 Notes

- Free Netlify tier includes 125k function invocations/month
- Database providers offer free tiers with limitations
- Gmail has sending limits (500 emails/day for free accounts)
- Consider upgrading plans for production use