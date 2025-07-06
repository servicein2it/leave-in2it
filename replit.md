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
- July 06, 2025. Initial setup with hybrid Firebase/mock authentication system
- July 06, 2025. Enhanced employee management with:
  * Added username/password fields for employee login
  * Added profile picture upload with Firebase Storage
  * Added address, social media, and Line User ID fields
  * Updated leave types to 11 Thai leave categories with 0-day defaults
  * Connected to real Firebase database for file uploads
  * Implemented image validation (5MB max, image files only)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```