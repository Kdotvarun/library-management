# Complete File Listing

## Configuration Files
- `.cursorrules` - Development guidelines and coding standards
- `.eslintrc.json` - ESLint configuration
- `.gitignore` - Git ignore rules
- `env.example` - Environment variables template
- `next.config.js` - Next.js configuration
- `package.json` - Dependencies and scripts
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

## App Router Pages
- `app/globals.css` - Global styles with dark mode support
- `app/layout.tsx` - Root layout with providers
- `app/page.tsx` - Home page with role-based redirects
- `app/signin/page.tsx` - Sign-in form with validation
- `app/unauthorized/page.tsx` - Access denied page
- `app/admin/page.tsx` - Admin dashboard with full management features
- `app/student/page.tsx` - Student dashboard

## API Routes
- `app/api/auth/[...nextauth]/route.ts` - NextAuth.js handler
- `app/api/admin/stats/route.ts` - Dashboard statistics API
- `app/api/admin/books/route.ts` - Book management API (CRUD)
- `app/api/admin/borrow-requests/route.ts` - Borrow request management API
- `app/api/admin/reservations/route.ts` - Table reservation management API

## Components
- `components/AdminLayout.tsx` - Admin dashboard layout with sidebar
- `components/Navigation.tsx` - Main navigation component
- `components/Providers.tsx` - Context providers (Session, Theme, Toast)
- `components/ThemeToggle.tsx` - Dark/light mode toggle
- `components/Toast.tsx` - Toast notification system

## Database Models
- `models/User.ts` - User model with authentication and roles
- `models/Book.ts` - Book model with availability status
- `models/Table.ts` - Table model for library seating
- `models/Reservation.ts` - Table reservation model
- `models/BorrowRequest.ts` - Book borrowing request model
- `models/index.ts` - Model exports

## Utilities and Configuration
- `lib/auth.ts` - NextAuth.js configuration
- `lib/api-utils.ts` - API utility functions
- `lib/mongodb.ts` - MongoDB connection handler

## Type Definitions
- `types/index.ts` - Main TypeScript interfaces and enums
- `types/next-auth.d.ts` - NextAuth type extensions

## Scripts
- `scripts/create-test-users.js` - Test user creation script

## Documentation
- `README.md` - Project documentation
- `WORKSPACE_README.md` - Workspace overview and setup guide

## Middleware
- `middleware.ts` - Route protection and role-based access control
