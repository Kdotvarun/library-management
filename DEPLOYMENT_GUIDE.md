# Library Management System - Vercel Deployment Guide

## 🚀 Quick Deployment to Vercel

This guide will help you deploy the Library Management System to Vercel with a fully populated database.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Account**: For connecting your repository

### Step 1: Set up MongoDB Atlas

1. Create a new cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
4. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/library-management`)

### Step 2: Deploy to Vercel

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management
   NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Step 3: Seed the Database

After deployment, you need to populate the database with test data:

1. **Option A: Use the Seeding Script** (Recommended):
   ```bash
   # Clone your repository locally
   git clone https://github.com/yourusername/library-management.git
   cd library-management
   
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp env.example .env.local
   # Edit .env.local with your MongoDB Atlas connection string
   
   # Run the seeding script
   npm run seed-comprehensive
   ```

2. **Option B: Manual Database Setup**:
   - Connect to your MongoDB Atlas cluster
   - Create the following collections: `users`, `books`, `tables`, `reservations`, `borrowrequests`
   - Use the data from `scripts/seed-comprehensive-database.js`

### Step 4: Test the Application

1. Visit your deployed URL: `https://your-app-name.vercel.app`
2. You should see the sign-in page
3. Use these test credentials:

   **Admin Accounts:**
   - Email: `admin@library.com` | Password: `admin123`
   - Email: `manager@library.com` | Password: `manager123`

   **Student Accounts:**
   - Email: `john.smith@student.com` | Password: `student123`
   - Email: `sarah.johnson@student.com` | Password: `student123`
   - Email: `mike.wilson@student.com` | Password: `student123`
   - Email: `emily.davis@student.com` | Password: `student123`
   - Email: `david.brown@student.com` | Password: `student123`

### Step 5: Verify All Features

✅ **Admin Features:**
- View dashboard with statistics
- Manage books (add, edit, delete)
- Approve/deny borrow requests
- Manage study table reservations
- View system statistics

✅ **Student Features:**
- Browse available books
- Request to borrow books
- Reserve study tables
- View personal reservations and borrow requests

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/library-management` |
| `NEXTAUTH_SECRET` | Secret for JWT tokens | `your-super-secret-key-here` |
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` |

### Database Schema

The application uses the following MongoDB collections:

- **users**: User accounts (admins and students)
- **books**: Library book catalog
- **tables**: Study table configurations
- **reservations**: Study table reservations
- **borrowrequests**: Book borrowing requests

### API Endpoints

- `GET /api/books` - List all books
- `POST /api/books` - Add new book (admin only)
- `GET /api/admin/borrow-requests` - List borrow requests (admin only)
- `GET /api/student/reservations` - List student reservations
- `POST /api/books/borrow-request` - Submit borrow request

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**:
   - Check that all environment variables are set
   - Ensure MongoDB connection string is valid
   - Verify Node.js version compatibility

2. **Database Connection Issues**:
   - Verify MongoDB Atlas cluster is running
   - Check IP whitelist settings
   - Ensure database user has correct permissions

3. **Authentication Issues**:
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Ensure user accounts exist in database

### Performance Optimization

1. **Database Indexes**: The application includes optimized indexes for common queries
2. **Image Optimization**: Uses Next.js Image component for optimal loading
3. **Caching**: Implements proper caching strategies for API responses

## 📊 Sample Data

The seeding script creates:

- **2 Admin users** with full system access
- **5 Student users** for testing
- **10 Books** across multiple genres (Computer Science, Web Development, Machine Learning, Programming, Software Engineering)
- **7 Study tables** with various seat configurations
- **3 Sample reservations** with different statuses
- **3 Sample borrow requests** with different statuses

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CSRF protection via NextAuth
- Secure session management

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Dark and light themes

## 🚀 Production Checklist

Before going live:

- [ ] Change default passwords
- [ ] Set up proper domain name
- [ ] Configure SSL certificates (handled by Vercel)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB
- [ ] Review and update environment variables
- [ ] Test all user flows thoroughly
- [ ] Set up error tracking (e.g., Sentry)

## 📞 Support

If you encounter any issues:

1. Check the Vercel deployment logs
2. Verify MongoDB Atlas cluster status
3. Review environment variable configuration
4. Test locally with the same environment variables

## 🎉 Success!

Once deployed and seeded, your Library Management System will be fully functional with:

- Complete user authentication system
- Book management capabilities
- Study table reservation system
- Borrow request management
- Responsive, modern UI
- Dark/light theme support
- Mobile-friendly design

The application is now ready for production use!