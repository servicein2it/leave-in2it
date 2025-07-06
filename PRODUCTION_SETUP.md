# Production Deployment Setup Guide

## Overview
This guide will help you deploy the Leave Management System to production with real Firebase integration.

## Prerequisites

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project or use existing one
3. Enable the following services:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create database in production mode
   - **Storage**: Enable for profile picture uploads

### 2. Firestore Security Rules
Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Leave requests - only authenticated users can read/write their own requests
    match /leaveRequests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Admin can read all documents
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Storage Security Rules
Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables

### Required Secrets in Replit
Set these environment variables in your Replit Secrets:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
SENDGRID_API_KEY=your_sendgrid_api_key
```

### How to get Firebase credentials:
1. Go to Firebase Console > Project Settings
2. Scroll down to "Your apps" section
3. Select your web app or create one
4. Copy the config values

## Initial Setup

### 1. Admin User Creation
The system automatically creates an admin user when no admin exists:
- **Username**: admin
- **Password**: admin
- **Email**: admin@in2it.co.th

**IMPORTANT**: Change the admin password immediately after first login!

### 2. Employee Setup
Create employees through the admin dashboard:
1. Login as admin
2. Go to "จัดการพนักงาน" (Employee Management)
3. Click "เพิ่มพนักงานใหม่" (Add New Employee)
4. Fill in employee details including username/password

## Production Checklist

### Security
- [ ] Change default admin password
- [ ] Set up proper Firestore security rules
- [ ] Set up proper Storage security rules
- [ ] Use environment variables for all secrets
- [ ] Enable authentication in Firebase

### Email Configuration
- [ ] Set up SendGrid account
- [ ] Configure verified sender email
- [ ] Test email notifications
- [ ] Update sender email in `server/emailService.ts` (currently set to noreply@in2it.co.th)

### Database
- [ ] Test user creation and authentication
- [ ] Test leave request workflow
- [ ] Test profile picture uploads
- [ ] Verify data persistence

### Monitoring
- [ ] Monitor Firebase usage quotas
- [ ] Monitor SendGrid email limits
- [ ] Set up error logging

## Post-Deployment

### 1. Test Complete Workflow
1. Login as admin
2. Create test employee
3. Login as employee
4. Submit leave request
5. Login as admin and approve/reject
6. Verify email notification sent

### 2. Backup Strategy
- Firebase automatically handles backups
- Consider setting up additional backup using Firebase Admin SDK if needed

### 3. Maintenance
- Regularly monitor Firebase usage
- Update Firebase dependencies as needed
- Monitor email delivery rates
- Regular security updates

## Troubleshooting

### Common Issues

**Firebase Connection Errors**:
- Verify environment variables are set correctly
- Check Firebase project settings
- Ensure Firestore rules allow access

**Email Not Sending**:
- Verify SendGrid API key
- Check sender email verification
- Monitor SendGrid dashboard for errors

**Authentication Issues**:
- Ensure Firebase Authentication is enabled
- Check Firestore security rules
- Verify user creation in Firebase console

### Support
For technical issues, check:
1. Browser console for JavaScript errors
2. Firebase console for authentication/database errors
3. Server logs for backend issues
4. SendGrid dashboard for email delivery issues

## Scaling Considerations

### Performance
- Firebase automatically scales
- Consider implementing pagination for large datasets
- Optimize Firestore queries

### Costs
- Monitor Firebase usage (reads/writes/storage)
- Monitor SendGrid email usage
- Consider implementing email rate limiting

### Features
- Add push notifications
- Implement advanced reporting
- Add mobile app support
- Integrate with HR systems

---

**Note**: This system is now production-ready with real Firebase integration. The mock services have been removed and all data is stored in Firebase Firestore.