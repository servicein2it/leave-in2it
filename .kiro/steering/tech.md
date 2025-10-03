# Technology Stack

## Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** with shadcn/ui components
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Framer Motion** for animations

## Backend
- **Node.js** with **Express.js**
- **TypeScript** throughout the stack
- **Drizzle ORM** with PostgreSQL database
- **Passport.js** for authentication
- **Express Session** with PostgreSQL store
- **SendGrid** for email notifications

## Database
- **PostgreSQL** with Neon serverless
- **Drizzle Kit** for migrations
- Session storage in database

## Development Tools
- **ESBuild** for server bundling
- **TSX** for TypeScript execution
- **Autoprefixer** and **PostCSS**

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run check        # TypeScript type checking
```

### Database
```bash
npm run db:push      # Push schema changes to database
```

### Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

## Architecture Notes
- Monorepo structure with shared types
- Client builds to `dist/public`, server to `dist/`
- All services run on port 5000 in production
- Path aliases: `@/*` for client, `@shared/*` for shared types