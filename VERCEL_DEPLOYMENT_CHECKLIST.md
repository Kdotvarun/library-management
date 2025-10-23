# Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] `MONGODB_URI` - MongoDB connection string (use MongoDB Atlas for production)
- [ ] `NEXTAUTH_SECRET` - Strong secret key for NextAuth.js
- [ ] `NEXTAUTH_URL` - Your production domain (e.g., https://yourdomain.vercel.app)

### ✅ Database Setup
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for Vercel)
- [ ] Connection string tested locally

### ✅ Code Quality
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No ESLint errors (`npm run lint` passes)
- [ ] All environment variables properly validated
- [ ] Error handling implemented for database connections

## Vercel Configuration

### ✅ Project Settings
1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next` (default)
4. **Install Command**: `npm install`

### ✅ Environment Variables in Vercel Dashboard
Set these in your Vercel project settings:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management
NEXTAUTH_SECRET=your-production-secret-key-here
NEXTAUTH_URL=https://yourdomain.vercel.app
NODE_ENV=production
```

### ✅ Domain Configuration
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate enabled
- [ ] Redirects configured for www/non-www

## Common Deployment Issues & Solutions

### ❌ Build Failures

**Issue**: TypeScript compilation errors
**Solution**: 
- Run `npm run build` locally first
- Fix all TypeScript errors
- Ensure all imports are correct

**Issue**: Missing dependencies
**Solution**:
- Check `package.json` for missing dependencies
- Ensure all imports have corresponding packages

### ❌ Runtime Errors

**Issue**: MongoDB connection failed
**Solution**:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has proper permissions

**Issue**: NextAuth configuration error
**Solution**:
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure all required environment variables are present

**Issue**: Environment variables not found
**Solution**:
- Check Vercel environment variables are set
- Verify variable names match exactly
- Redeploy after adding new variables

### ❌ Performance Issues

**Issue**: Slow API responses
**Solution**:
- Implement database connection pooling
- Add proper error handling
- Use MongoDB indexes for queries

**Issue**: Large bundle size
**Solution**:
- Use dynamic imports for heavy components
- Optimize images with Next.js Image component
- Remove unused dependencies

## Post-Deployment Verification

### ✅ Functionality Tests
- [ ] Home page loads correctly
- [ ] Authentication works (sign in/out)
- [ ] Admin dashboard accessible with admin role
- [ ] Student dashboard accessible with student role
- [ ] API endpoints respond correctly
- [ ] Database operations work (CRUD)

### ✅ Security Checks
- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed
- [ ] Authentication redirects work properly
- [ ] Role-based access control functions

### ✅ Performance Checks
- [ ] Page load times are acceptable
- [ ] API response times are reasonable
- [ ] No memory leaks in serverless functions
- [ ] Database queries are optimized

## Monitoring & Maintenance

### ✅ Logs
- [ ] Monitor Vercel function logs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor database performance

### ✅ Updates
- [ ] Keep dependencies updated
- [ ] Monitor security advisories
- [ ] Regular database backups

## Troubleshooting Commands

```bash
# Check build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint

# Test environment variables
node -e "console.log(process.env.MONGODB_URI ? 'MongoDB URI set' : 'MongoDB URI missing')"
```

## Emergency Rollback

If deployment fails:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connectivity
4. Rollback to previous working version if needed
5. Fix issues and redeploy

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
