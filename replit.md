# Leave Management System

## Overview
This is a comprehensive Leave Management System for IN2IT Company, featuring a Thai language interface. It's a full-stack web application with a React frontend and Express backend, designed to manage leave requests, employee administration, and includes role-based authentication. The system aims to streamline leave processes, improve employee management, and provide robust, localized tools for HR operations with high performance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: React Context API
- **UI Components**: Shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with custom CSS variables
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (via Neon Database)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Authentication & Authorization
- **Hybrid System**: Real Firebase Authentication and Firestore, with automatic fallback to mock services if Firebase is unavailable.
- **Profile Pictures**: Firebase Storage for image uploads.
- **Role-Based Access Control**: EMPLOYEE and ADMIN roles with distinct permissions.
- **Protected Routes**: Route-level protection based on user roles.

### Email Notifications
- **SendGrid Integration**: Professional email notifications for leave approvals/rejections.
- **Automated Workflow**: Emails sent automatically for status changes.
- **Templates**: Rich HTML templates with Thai language support.

### Key Features
- **User Management**: Admins have full CRUD on employees; Employees can manage their profiles and leave. Includes profile picture uploads, and enhanced fields like address, social media, and Line User ID.
- **Leave Management**: Supports 11 specific Thai leave categories with default 0-day balances. Features a workflow: Submit → Pending → Approved/Rejected, with automatic balance deduction upon approval and complete history tracking.
- **UI/UX Features**: Responsive design (mobile-first), full Thai localization with Buddhist calendar support, print functionality for official forms, and dark mode support.

## External Dependencies

- **Database**: Neon Database (for PostgreSQL)
- **Authentication/Storage**: Firebase (Authentication, Firestore, Storage)
- **Email Service**: SendGrid
- **React Ecosystem**: React, React DOM, Wouter, Radix UI, Lucide React, React Hook Form, TanStack React Query
- **Styling**: Tailwind CSS, Class Variance Authority
- **Development Tools**: Vite, ESBuild, TypeScript, TSX, Replit plugins (e.g., Cartographer)