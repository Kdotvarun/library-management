# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Git repository access

## Local Development Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd library-management
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/library-management
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/library-management

NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Create Test Users
```bash
npm run create-users
```

### 4. Start Development Server
```bash
npm run dev
```

## Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Deploy to Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### 4. Deploy to Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` folder
- **Railway**: Connect GitHub and set environment variables
- **DigitalOcean App Platform**: Use Node.js buildpack

## Database Setup

### MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whititelist your IP address
5. Get connection string and update `MONGODB_URI`

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/library-management`

## Security Considerations

### Environment Variables
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Never commit `.env.local` to version control
- Use different secrets for development and production

### Database Security
- Use MongoDB Atlas for production
- Enable database authentication
- Use connection string with credentials
- Whitelist only necessary IP addresses

### Authentication
- Implement rate limiting for sign-in attempts
- Use HTTPS in production
- Consider implementing 2FA for admin accounts

## Monitoring and Maintenance

### Logging
- Monitor API routes for errors
- Set up database query monitoring
- Track user authentication events

### Performance
- Monitor database query performance
- Implement caching for frequently accessed data
- Use MongoDB indexes for better query performance

### Backup
- Regular database backups
- Version control for code changes
- Environment variable backup

## Troubleshooting

### Common Issues
1. **MongoDB Connection Errors**: Check connection string and network access
2. **Authentication Issues**: Verify NextAuth configuration and secrets
3. **Build Errors**: Check TypeScript errors and dependencies
4. **Environment Variables**: Ensure all required variables are set

### Debug Mode
Enable debug mode in development:
```env
NODE_ENV=development
```

## Support
- Check the README.md for detailed documentation
- Review the .cursorrules for development guidelines
- Check console logs for error details
