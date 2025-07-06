# Leave Management System

## Overview

This is a comprehensive Leave Management System built for IN2IT Company with a Thai language interface. The application is designed as a full-stack web application with a React frontend and Express backend, featuring role-based authentication, leave request management, and employee administration capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for authentication state
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with Vite integration

### Authentication & Authorization
- **Firebase Integration**: Real Firebase Authentication and Firestore database
- **Hybrid System**: Automatic fallback to mock services when Firebase unavailable
- **Profile Pictures**: Firebase Storage for image uploads with validation
- **Role-Based Access Control**: Two roles (EMPLOYEE, ADMIN) with different permissions
- **Session Persistence**: LocalStorage for client-side session management
- **Protected Routes**: Route-level protection based on user roles

### Email Notifications
- **SendGrid Integration**: Professional email notifications for leave approvals/rejections
- **Automated Workflow**: Emails sent automatically when admin approves or rejects leave requests
- **Rich HTML Templates**: Beautiful, responsive email templates with Thai language support
- **Notification Content**: Includes leave details, status, approver info, and rejection reasons
- **Error Handling**: Graceful fallback if email service is unavailable

## Key Components

### User Management
- **Employee Role**: Can view leave balances, submit requests, view history, edit profile
- **Admin Role**: Full CRUD operations on employees, leave request management, company-wide analytics
- **Employee Creation**: Admins can create employees with custom username/password
- **Profile Management**: Profile pictures uploaded to Firebase Storage
- **Enhanced Fields**: Address, social media, Line User ID support
- **Default User**: Single admin user (username: 'admin', password: 'admin')

### Leave Management
- **Leave Types**: 11 specific Thai leave categories:
  * วันลาสะสม, ลาป่วย, ลาคลอดบุตร, ลาไปช่วยเหลือภริยาที่คลอดบุตร
  * ลากิจส่วนตัว, ลาพักผ่อน, ลาอุปสมบทหรือการลาไปประกอบพิธีฮัจย์
  * ลาเข้ารับการตรวจเลือกทหาร, ลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน
  * ลาไปปฏิบัติงานในองค์การระหว่างประเทศ, ลาติดตามคู่สมรส
- **Default Balances**: All leave types default to 0 days
- **Request Workflow**: Submit → Pending → Approved/Rejected
- **Balance Tracking**: Automatic deduction from employee balances upon approval
- **History Tracking**: Complete audit trail of all leave requests

### Data Models
- **UserData**: Complete employee profile with leave balances
- **LeaveRequest**: Request details with status tracking
- **Enums**: Typed enums for Title, Gender, LeaveType, LeaveStatus, UserRole

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Thai Language**: Complete Thai localization with Buddhist calendar support
- **Print Functionality**: Browser-native printing for official leave forms
- **Dark Mode Support**: CSS variables for theme switching capability

## Data Flow

### Authentication Flow
1. User submits credentials through LoginForm
2. MockAuth validates against in-memory user store
3. AuthContext updates application state
4. Route protection redirects based on user role

### Leave Request Flow
1. Employee submits request through LeaveRequestForm
2. Request stored in MockFirestore with PENDING status
3. Admin views request in AllLeaveRequests component
4. Admin approves/rejects, triggering balance updates
5. Employee receives notification and updated balance

### Employee Management Flow
1. Admin accesses EmployeeManagement interface
2. CRUD operations performed through EmployeeModal
3. MockFirestore handles data persistence
4. Real-time updates reflected across admin dashboard

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Router alternative (Wouter)
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **Form Management**: React Hook Form, Hookform Resolvers
- **Data Fetching**: TanStack React Query
- **Database**: Drizzle ORM, Neon Database Serverless
- **Styling**: Tailwind CSS, Class Variance Authority

### Development Dependencies
- **Build Tools**: Vite, ESBuild for production builds
- **TypeScript**: Full TypeScript support with strict mode
- **Development**: TSX for TypeScript execution, Replit integration

### Mock Services
- **Firebase Mock**: Complete Firebase-style API simulation
- **In-Memory Storage**: Client-side data persistence for development
- **Session Management**: Browser localStorage for authentication state

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon Database for development and production
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Production Build
- **Frontend**: Vite build with optimized bundling
- **Backend**: ESBuild compilation to ESM modules
- **Static Assets**: Served through Express static middleware
- **Database Migrations**: Drizzle Kit for schema management

### Replit Integration
- **Replit Plugins**: Cartographer for development visualization
- **Error Handling**: Runtime error overlay for debugging
- **Hot Reload**: Seamless development experience

## Changelog

```
Changelog:
- July 06, 2025. Removed Rejection Reason Feature:
  * Completely removed "เหตุผลปฏิเสธ" (rejection reason) functionality from the system
  * Updated admin rejection workflow to use simple confirmation dialog instead of reason prompt
  * Removed rejection reason field from database schema and all components
  * Simplified email notifications - no more rejection reason display
  * Updated frontend types and backend API to remove rejectedReason field
  * Streamlined leave request rejection process for better user experience
- July 06, 2025. Employee Leave Request Deletion Feature:
  * Added delete functionality for pending leave requests in employee dashboard
  * Employees can now delete their own leave requests only when status is "รอพิจารณา" (pending)
  * Delete button appears only for pending requests, preventing deletion of approved/rejected requests
  * Added server-side validation to ensure only pending requests can be deleted
  * Added user-friendly error messages and confirmation dialogs
  * Includes loading states and proper error handling with toast notifications
- July 06, 2025. Print Document Format Fix:
  * Removed generic checkboxes for "ป่วย" and "กิจส่วนตัว" from print document
  * Replaced checkbox section with actual leave type from request
  * Added styled box to highlight the specific leave type (e.g., "วันลาสะสม", "ลาป่วย")
  * Print document now shows the exact leave type requested instead of generic options
  * Improved visual formatting for better official document appearance
- July 06, 2025. Month Filter Bug Fix:
  * Fixed inconsistent month indexing between UI and filtering logic
  * Changed Thai months array to use 1-based indexing (1-12) instead of 0-based (0-11)
  * Updated getCurrentMonthYear to return proper 1-based month numbers
  * Month filter now correctly shows/hides leave requests by selected month
  * Default behavior shows all requests when no month/year filter is selected
  * Filter properly converts Buddhist calendar dates for comparison
- July 06, 2025. Complete PostgreSQL Migration Success:
  * Migrated from Firebase to PostgreSQL for dramatically improved performance
  * Removed all Firebase dependencies and services completely  
  * Database queries now execute in 80-2000ms vs slow Firebase connections
  * Admin user auto-created with credentials: admin/admin
  * All API endpoints working with PostgreSQL backend
  * No more Firebase WebChannel connection errors
  * System now 100% Firebase-free and PostgreSQL-powered
- July 06, 2025. Initial setup with hybrid Firebase/mock authentication system
- July 06, 2025. Enhanced employee management with:
  * Added username/password fields for employee login
  * Added profile picture upload with Firebase Storage
  * Added address, social media, and Line User ID fields
  * Updated leave types to 11 Thai leave categories with 0-day defaults
  * Connected to real Firebase database for file uploads
  * Implemented image validation (5MB max, image files only)
- July 06, 2025. Enhanced Employee Dashboard with:
  * Real-time date count summary when selecting leave dates
  * Leave balance validation with modal warnings
  * Document upload requirement for sick leave type only
  * Automatic refresh of leave history after form submission
  * Comprehensive form validation with Thai error messages
- July 06, 2025. Implemented email notification system:
  * SendGrid integration for professional email delivery
  * Automated notifications on leave approval/rejection
  * Rich HTML email templates with Thai language support
  * Backend API endpoint for email notifications
  * Integrated with admin approval workflow
- July 06, 2025. Production-ready Firebase integration:
  * Removed mock users and implemented real Firebase authentication
  * Enabled production Firebase configuration with environment variables
  * Added automatic admin user initialization in Firebase
  * Created comprehensive production deployment guide
  * System now fully integrated with Firebase Firestore and Storage
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```