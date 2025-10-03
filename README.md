# Leave Management System (IN2IT)

A comprehensive leave management system built with React, TypeScript, Express.js, and PostgreSQL.

## Features

- 🏢 Employee and Admin dashboards
- 📝 Leave request submission and approval workflow
- 📊 Leave balance tracking
- 📧 Email notifications (Gmail SMTP)
- 📅 Calendar view of leave requests
- 👥 Employee management
- 🔐 Role-based authentication

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Email**: Gmail SMTP via Nodemailer
- **Deployment**: Netlify (Frontend + Functions)

## Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd leave-management-system
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Set up database:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment to Netlify

### Prerequisites

1. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Railway)
2. **Gmail App Password**: Generate an app password for email notifications
3. **Netlify Account**: Create account at netlify.com

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build:netlify
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist/public`
   - Set functions directory: `netlify/functions`

3. **Configure Environment Variables in Netlify:**
   Go to Site Settings → Environment Variables and add:
   ```
   DATABASE_URL=your_postgresql_connection_string
   GMAIL_USER=your-gmail@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ADMIN_EMAIL=admin@yourcompany.com
   ```

4. **Deploy:**
   - Push to your main branch or manually deploy

### Gmail Setup for Email Notifications

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password as `GMAIL_APP_PASSWORD`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GMAIL_USER` | Gmail address for sending emails | Yes |
| `GMAIL_APP_PASSWORD` | Gmail app password | Yes |
| `ADMIN_EMAIL` | Admin email for notifications | Yes |
| `FIREBASE_*` | Firebase config for file uploads | No |

## Default Admin Account

- Username: `admin`
- Password: `admin`

**⚠️ Change the default admin password after first login!**

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/leave-requests` - Get leave requests
- `POST /api/leave-requests` - Submit leave request
- `PUT /api/leave-requests/:id` - Update leave request
- `POST /api/auth/login` - User login

## License

MIT License
