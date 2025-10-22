# Library Management System - Complete Workspace

## 🎯 Project Overview
A modern library management system built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS. Features include user authentication, book management, table reservations, and borrow requests with role-based access control.

## 🚀 Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with dark/light mode support
- **Database**: MongoDB with comprehensive schemas

## 📁 Project Structure
```
library-management/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin-specific API endpoints
│   │   │   ├── stats/           # Dashboard statistics
│   │   │   ├── books/           # Book management
│   │   │   ├── borrow-requests/ # Borrow request handling
│   │   │   └── reservations/    # Table reservation management
│   │   └── auth/                # Authentication endpoints
│   │       └── [...nextauth]/   # NextAuth.js handler
│   ├── admin/                   # Admin pages
│   │   └── page.tsx            # Admin dashboard
│   ├── student/                 # Student pages
│   │   └── page.tsx            # Student dashboard
│   ├── signin/                  # Authentication pages
│   │   └── page.tsx            # Sign-in form
│   ├── unauthorized/            # Access denied page
│   │   └── page.tsx
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                   # Reusable components
│   ├── AdminLayout.tsx         # Admin dashboard layout
│   ├── Navigation.tsx          # Main navigation
│   ├── Providers.tsx           # Context providers
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   └── Toast.tsx               # Toast notification system
├── lib/                         # Utilities and configurations
│   ├── auth.ts                 # NextAuth configuration
│   ├── api-utils.ts            # API utility functions
│   └── mongodb.ts              # MongoDB connection
├── models/                      # MongoDB schemas
│   ├── User.ts                 # User model with roles
│   ├── Book.ts                 # Book model
│   ├── Table.ts                # Table model for seating
│   ├── Reservation.ts          # Table reservation model
│   ├── BorrowRequest.ts        # Book borrowing model
│   └── index.ts                # Model exports
├── types/                       # TypeScript definitions
│   ├── index.ts                # Main type definitions
│   └── next-auth.d.ts          # NextAuth type extensions
├── scripts/                     # Utility scripts
│   └── create-test-users.js    # Test user creation
├── .cursorrules                 # Development guidelines
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── env.example                 # Environment variables template
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Project documentation
└── tsconfig.json               # TypeScript configuration
```

## 🔑 Key Features

### Authentication System
- **NextAuth.js** integration with credentials provider
- **Role-based access control** (ADMIN/STUDENT)
- **Protected routes** with middleware
- **Session management** with JWT tokens

### Admin Dashboard
- **Comprehensive statistics** overview
- **Book management** with CRUD operations
- **Borrow request approval** workflow
- **Table reservation management**
- **Real-time updates** with toast notifications

### Database Models
- **User**: Authentication and role management
- **Book**: Library catalog with availability status
- **Table**: Library seating arrangements
- **Reservation**: Table and seat bookings
- **BorrowRequest**: Book borrowing workflow

### UI/UX Features
- **Dark/Light mode** support
- **Responsive design** for all screen sizes
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **Notion-inspired** clean design

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your MongoDB URI and NextAuth secret
   ```

3. **Create test users:**
   ```bash
   npm run create-users
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Home: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Student: http://localhost:3000/student

## 🔐 Test Credentials
- **Admin**: admin@library.com / admin123
- **Student**: student@library.com / student123

## 📝 Development Guidelines
See `.cursorrules` for comprehensive development standards including TypeScript usage, component design, and best practices.
