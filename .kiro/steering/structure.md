# Project Structure

## Root Level
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript types and schemas
├── attached_assets/ # Project documentation and assets
└── dist/           # Production build output
```

## Client Structure (`client/`)
```
├── src/
│   ├── components/
│   │   ├── admin/     # Admin-specific components
│   │   ├── auth/      # Authentication components
│   │   ├── employee/  # Employee-specific components
│   │   ├── layout/    # Layout components
│   │   ├── shared/    # Shared components
│   │   └── ui/        # shadcn/ui component library
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries and configurations
│   ├── pages/         # Page components
│   ├── services/      # API service layer
│   ├── types/         # Client-specific TypeScript types
│   └── utils/         # Utility functions
├── index.html         # HTML entry point
└── .env              # Client environment variables
```

## Server Structure (`server/`)
```
├── index.ts          # Express server entry point
├── routes.ts         # API route definitions
├── auth.ts           # Authentication middleware
├── db.ts             # Database connection and queries
├── emailService.ts   # Email notification service
├── storage.ts        # File storage utilities
└── vite.ts           # Vite integration for development
```

## Shared Structure (`shared/`)
```
└── schema.ts         # Drizzle database schema and Zod validation
```

## Naming Conventions
- **Components**: PascalCase (e.g., `AdminDashboard.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Folders**: lowercase with hyphens for multi-word (e.g., `leave-requests`)
- **API Routes**: RESTful conventions (`/api/users`, `/api/leave-requests`)

## Component Organization
- Role-based component separation (`admin/`, `employee/`)
- Shared components in `shared/` folder
- UI components follow shadcn/ui patterns
- Each major feature has its own component file

## Import Patterns
- Use path aliases: `@/` for client src, `@shared/` for shared types
- Relative imports for same-directory files
- Absolute imports for cross-directory references