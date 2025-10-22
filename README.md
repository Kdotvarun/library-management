# Library Management System

A modern library management system built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 📚 Book management (CRUD operations)
- 👥 User management with role-based access
- 📋 Borrowing and return tracking
- 🔍 Search and filtering capabilities
- 🌙 Dark/Light mode support
- 🔐 Authentication with NextAuth.js
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with dark mode support
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/library-management
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
library-management/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Providers.tsx      # Theme provider
│   └── ThemeToggle.tsx    # Dark/Light mode toggle
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── api-utils.ts      # API utility functions
│   └── mongodb.ts        # MongoDB connection
├── models/                # MongoDB schemas
│   ├── Book.ts           # Book model
│   ├── BorrowRecord.ts   # Borrowing record model
│   └── User.ts           # User model
├── types/                 # TypeScript interfaces
│   └── index.ts          # Type definitions
├── public/                # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with pagination and search)
- `POST /api/books` - Create a new book

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

## User Roles

- **ADMIN**: Full access to all features including user management, book management, table management, and all reservations/borrow requests
- **STUDENT**: Can view books, make reservations for tables/seats, submit borrow requests, and manage their own reservations

## Database Models

### User
- _id, name, email, password, role (ADMIN/STUDENT), reservations, borrowedBooks, timestamps

### Book
- _id, title, author, genre, description, coverImageURL, availabilityStatus, addedBy, timestamps

### Table
- _id, label, seats (array of seat numbers), timestamps

### Reservation
- _id, studentId, bookId, tableId, seatNumber, reservedDate, timeSlot (startTime/endTime), status (PENDING/APPROVED/DENIED/WAITLISTED), timestamps

### BorrowRequest
- _id, studentId, bookId, requestedFromDate, requestedToDate, status (PENDING/APPROVED/DENIED), timestamps

## Development

### Adding New Features

1. Create TypeScript interfaces in `/types`
2. Add MongoDB models in `/models`
3. Create API routes in `/app/api`
4. Build UI components in `/components`
5. Add pages in `/app`

### Database Connection

The MongoDB connection is handled in `/lib/mongodb.ts` with proper error handling and connection caching for development.

### Styling

The project uses Tailwind CSS with dark mode support. The theme can be toggled using the `ThemeToggle` component.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
