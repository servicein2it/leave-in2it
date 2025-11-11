# 🏗️ Deployment Architecture - IMPORTANT!

## ⚠️ Current Issue

Your app is showing **404 errors** on Netlify because:

**Problem:** Netlify only hosts **static files** (HTML, CSS, JS)
**Your App Needs:** A **Node.js server** to run Express backend and API routes

## 🎯 Correct Architecture

Your Leave Management System needs **TWO** deployments:

```
┌─────────────────────────────────────────────────┐
│  Frontend (React SPA)                           │
│  Deployed on: Netlify                           │
│  URL: https://leave-in2it.netlify.app          │
│  Serves: Static files (HTML, CSS, JS)          │
└─────────────────────────────────────────────────┘
                    ↓ API Calls
┌─────────────────────────────────────────────────┐
│  Backend (Node.js + Express)                    │
│  Deployed on: Render/Railway/Heroku             │
│  URL: https://leave-in2it-api.onrender.com     │
│  Handles: /api/* routes, database, emails      │
└─────────────────────────────────────────────────┘
                    ↓ Queries
┌─────────────────────────────────────────────────┐
│  Database (PostgreSQL)                          │
│  Hosted on: Supabase                            │
│  Connection: DATABASE_URL                       │
└─────────────────────────────────────────────────┘
```

## 🚀 Recommended Solution: Deploy to Render.com

### Why Render?
- ✅ Free tier available
- ✅ Supports Node.js servers
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variable management
- ✅ Built-in SSL certificates

### Step-by-Step Deployment

#### **Step 1: Deploy Backend to Render**

1. **Go to Render.com**
   - Visit https://render.com
   - Sign up or log in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `servicein2it/leave-in2it`
   - Click "Connect"

3. **Configure the Service**
   ```
   Name: leave-in2it-backend
   Region: Singapore (closest to your Supabase)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install && npm run build && npm run build:server
   Start Command: node dist/index.js
   ```

4. **Set Environment Variables**
   Click "Advanced" → Add Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@...
   GMAIL_USER=service@in2it.co.th
   GMAIL_APP_PASSWORD=your-gmail-app-password
   ADMIN_EMAIL=service@in2it.co.th
   NODE_ENV=production
   PORT=10000
   ```

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://leave-in2it-backend.onrender.com`)

#### **Step 2: Update Frontend to Use Backend API**

The frontend needs to know where the backend is. We'll update the API client:

1. **Add API_URL environment variable to Netlify**
   ```
   VITE_API_URL=https://leave-in2it-backend.onrender.com
   ```

2. **Redeploy on Netlify**
   - Trigger a new deploy
   - Frontend will now call the correct backend

#### **Step 3: Test Everything**

1. **Test Backend Directly**
   ```
   https://leave-in2it-backend.onrender.com/api/users
   ```
   Should return user data (if logged in)

2. **Test Frontend**
   ```
   https://leave-in2it.netlify.app
   ```
   Should work completely now!

## 🔄 Alternative: Deploy Everything to Render

If you want to simplify, deploy BOTH frontend and backend to Render:

### Single Render Deployment

1. **Use the existing server setup**
   - It already serves the built frontend from `dist/public`
   - No need for separate Netlify deployment

2. **Deploy to Render**
   ```
   Build Command: npm install && npm run build && npm run build:server
   Start Command: node dist/index.js
   ```

3. **Access your app**
   ```
   https://leave-in2it.onrender.com
   ```

**Pros:**
- ✅ Simpler architecture
- ✅ One deployment
- ✅ No CORS issues
- ✅ Backend and frontend together

**Cons:**
- ❌ No CDN for static files
- ❌ Slower for global users

## 📋 Current Status

- ✅ Frontend deployed to Netlify (static files only)
- ❌ Backend NOT deployed (causing 404 errors)
- ✅ Database setup complete (Supabase)
- ⏳ Need to deploy backend to Render/Railway

## 🎯 Action Plan

### Option A: Keep Netlify + Add Render Backend (Recommended)

1. Deploy backend to Render (follow steps above)
2. Update Netlify environment variables with backend URL
3. Redeploy Netlify

### Option B: Move Everything to Render (Simpler)

1. Deploy full app to Render
2. Stop using Netlify
3. Update DNS to point to Render

## 🔧 Files Added for Deployment

- `render.yaml` - Render configuration
- `DEPLOYMENT-ARCHITECTURE.md` - This file

## 📝 Next Steps

**Choose your deployment strategy:**

1. **If you want to keep Netlify:**
   - Deploy backend to Render
   - Update API configuration
   - See: "Option A" above

2. **If you want simpler deployment:**
   - Deploy everything to Render
   - Forget about Netlify
   - See: "Option B" above

## 🆘 Need Help?

**Render Documentation:**
- https://render.com/docs

**Common Issues:**
- Build fails → Check build logs in Render dashboard
- 502 errors → Check start command and PORT variable
- Database connection fails → Verify DATABASE_URL

## 💡 Pro Tip

For production, consider:
- **Frontend**: Netlify or Vercel (CDN, fast)
- **Backend**: Render or Railway (Node.js support)
- **Database**: Supabase (already set up ✅)

This is the standard architecture for modern web apps!
